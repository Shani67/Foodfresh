<?php
/**
 * Admin.
 */

namespace Extendify\Chat;

use Extendify\Config;

/**
 * This class handles any file loading for the admin area.
 */
class Admin
{
    /**
     * The instance
     *
     * @var $instance
     */
    public static $instance = null;

    /**
     * Whether to show the chat or not.
     *
     * @var boolean
     */
    public $showChat = false;

    /**
     * The support URL.
     *
     * @var string
     */
    public $supportUrl = '';

    /**
     * The support message.
     *
     * @var string
     */
    public $supportMessage = '';

    /**
     * Adds various actions to set up the page
     *
     * @return self|void
     */
    public function __construct()
    {
        if (self::$instance) {
            return self::$instance;
        }

        self::$instance = $this;

        if (!defined('EXTENDIFY_PARTNER_ID')) {
            return;
        }

        $chatData = $this->fetchChatData();
        if (! $chatData) {
            return;
        }

        $this->showChat = isset($chatData['showChat']) ? $chatData['showChat'] : false;
        $this->supportUrl = isset($chatData['supportUrl']) ? $chatData['supportUrl'] : '';
        $this->supportMessage = isset($chatData['supportMessage']) ? $chatData['supportMessage'] : '';

        $this->loadScripts();
    }

    /**
     * Adds scripts to the admin
     *
     * @return void
     */
    public function loadScripts()
    {
        \add_action(
            'admin_init',
            function () {
                if (!current_user_can(Config::$requiredCapability)) {
                    return;
                }

                // Don't show on Launch pages.
                if (filter_input(INPUT_GET, 'page', FILTER_SANITIZE_STRING) === 'extendify-launch') {
                    return;
                }

                if (!$this->showChat) {
                    return;
                }

                $this->enqueueGutenbergAssets();

                $version = Config::$environment === 'PRODUCTION' ? Config::$version : uniqid();

                \wp_enqueue_style(
                    Config::$slug . '-chat-styles',
                    EXTENDIFY_BASE_URL . 'public/build/extendify-chat.css',
                    [],
                    $version,
                    'all'
                );
            }
        );
    }

    /**
     * Fetch the data from the partner-data API endpoint.
     *
     * @return array
     */
    private function fetchChatData()
    {
        $chatData = get_transient('extendify_chat_data');

        if ($chatData !== false) {
            return $chatData;
        }

        if (!defined('EXTENDIFY_PARTNER_ID')) {
            return [];
        }

        $apiUrl = Config::$config['api']['onboarding'];

        $response = wp_remote_get(
            add_query_arg(
                ['partner' => EXTENDIFY_PARTNER_ID],
                $apiUrl . '/partner-data/'
            ),
            ['headers' => ['Accept' => 'application/json']]
        );

        if (is_wp_error($response)) {
            return [];
        }

        $result = json_decode(wp_remote_retrieve_body($response), true);
        $data = isset($result['data']) ? $result['data'] : [];

        $chatData = [
            'showChat' => isset($data['showChat']) ? $data['showChat'] : false,
            'supportUrl' => isset($data['supportUrl']) ? $data['supportUrl'] : '',
            'supportMessage' => isset($data['supportMessage']) ? $data['supportMessage'] : '',
        ];

        if (Config::$environment === 'DEVELOPMENT') {
            $chatData['showChat'] = true;
        }

        set_transient('extendify_chat_data', $chatData, DAY_IN_SECONDS);
        return $chatData;
    }

    /**
     * Enqueues Gutenberg stuff on a non-Gutenberg page.
     *
     * @return void
     */
    public function enqueueGutenbergAssets()
    {
        wp_enqueue_media();

        $version = Config::$environment === 'PRODUCTION' ? Config::$version : uniqid();
        $scriptAssetPath = EXTENDIFY_PATH . 'public/build/extendify-chat.asset.php';
        $fallback = [
            'dependencies' => [],
            'version' => $version,
        ];

        $chatDependencies = file_exists($scriptAssetPath) ? require $scriptAssetPath : $fallback;

        foreach ($chatDependencies['dependencies'] as $style) {
            wp_enqueue_style($style);
        }

        \wp_enqueue_script(
            Config::$slug . '-chat-scripts',
            EXTENDIFY_BASE_URL . 'public/build/extendify-chat.js',
            $chatDependencies['dependencies'],
            $chatDependencies['version'],
            true
        );

        \wp_add_inline_script(
            Config::$slug . '-chat-scripts',
            'window.extChatData = ' . wp_json_encode([
                'nonce' => \wp_create_nonce('wp_rest'),
                'root' => \esc_url_raw(\rest_url(Config::$slug . '/' . Config::$apiVersion)),
                'supportUrl' => $this->supportUrl,
                'supportMessage' => $this->supportMessage,
            ]),
            'before'
        );
    }
}
