<?php
/**
 * Helper class for making http requests
 */

namespace Extendify;

use Extendify\Config;
use Extendify\User;

/**
 * Controller for http communication
 */
class Http
{
    /**
     * The api endpoint
     *
     * @var string
     */
    public $baseUrl = '';

    /**
     * Request data sent to the server
     *
     * @var array
     */
    public $data = [];

    /**
     * Any headers required
     *
     * @var array
     */
    public $headers = [];

    /**
     * The class instance.
     *
     * @var $instance
     */
    protected static $instance = null;

    /**
     * Set up the base object to send with every request
     *
     * @param \WP_REST_Request $request - The request.
     *
     * @return void
     */
    public function __construct($request)
    {
        // Redundant, but extra protection!
        if (!\wp_verify_nonce(sanitize_text_field(wp_unslash($request->get_header('x_wp_nonce'))), 'wp_rest')) {
            return;
        }

        // Some special cases for library development.
        $this->baseUrl = $this->getBaseUrl($request);

        $this->data = [
            'wp_language' => \get_locale(),
            'wp_theme' => \get_option('template'),
            'wp_version' => \get_bloginfo('version'),
            'mode' => Config::$environment,
            'uuid' => User::data('uuid'),
            'library_version' => Config::$version,
            'wp_active_plugins' => $request->get_method() === 'POST' ? \get_option('active_plugins') : [],
            'is_block_theme' => function_exists('wp_is_block_theme') ? wp_is_block_theme() : false,
            'sdk_partner' => Config::$sdkPartner,
        ];

        if ($request->get_header('x_extendify_dev_mode') === 'true') {
            $this->data['devmode'] = true;
        }

        $this->headers = [
            'Accept' => 'application/json',
            'referer' => $request->get_header('referer'),
            'user_agent' => $request->get_header('user_agent'),
        ];
    }

    /**
     * Register dynamic routes
     *
     * @param string $endpoint - The endpoint.
     * @param array  $data     - The data to include.
     * @param array  $headers  - The headers to include.
     *
     * @return array
     */
    public function getHandler($endpoint, $data = [], $headers = [])
    {
        $url = \esc_url_raw(
            \add_query_arg(
                \urlencode_deep(\urldecode_deep(array_merge($this->data, $data))),
                $this->baseUrl . $endpoint
            )
        );

        $response = \wp_remote_get(
            $url,
            [
                'headers' => array_merge($this->headers, $headers),
            ]
        );

        if ((int) $response['response']['code'] >= 500) {
            wp_send_json_error($response['response']['message'], $response['response']['code']);
        }

        if (\is_wp_error($response)) {
            return $response;
        }

        $responseBody = \wp_remote_retrieve_body($response);
        return json_decode($responseBody, true);
    }

    /**
     * Register dynamic routes
     *
     * @param string $endpoint - The endpoint.
     * @param array  $data     - The arguments to include.
     * @param array  $headers  - The headers to include.
     *
     * @return array
     */
    public function postHandler($endpoint, $data = [], $headers = [])
    {
        $response = \wp_remote_post(
            $this->baseUrl . $endpoint,
            [
                'headers' => array_merge($this->headers, $headers),
                'body' => array_merge($this->data, $data),
            ]
        );

        if (\is_wp_error($response)) {
            return $response;
        }

        if ((int) $response['response']['code'] >= 500) {
            wp_send_json_error($response['response']['message'], $response['response']['code']);
        }

        $responseBody = \wp_remote_retrieve_body($response);
        return json_decode($responseBody, true);
    }

    /**
     * The caller
     *
     * @param string $name      - The name of the method to call.
     * @param array  $arguments - The arguments to pass in.
     *
     * @return mixed
     */
    public static function __callStatic($name, array $arguments)
    {
        if ($name === 'init') {
            self::$instance = new static($arguments[0]);
            return;
        }

        $name = "{$name}Handler";
        $r = self::$instance;

        return $r->$name(...$arguments);
    }

    /**
     * Figure out the base URL to use.
     *
     * @param \WP_REST_Request $request - The request.
     *
     * @return string
     */
    public function getBaseUrl($request)
    {
        $headerToConfigKeyMap = [
            'x_extendify_dev_mode' => 'dev',
            'x_extendify_local_mode' => 'local',
            'x_extendify_onboarding_dev_mode' => 'onboarding-dev',
            'x_extendify_onboarding_local_mode' => 'onboarding-local',
            'x_extendify_onboarding' => 'onboarding',
            'x_extendify_assist_dev_mode' => 'assist-dev',
            'x_extendify_assist_local_mode' => 'assist-local',
            'x_extendify_assist' => 'assist',
            'x_extendify_chat' => 'chat',
        ];

        foreach ($headerToConfigKeyMap as $headerKey => $configKey) {
            if ($request->get_header($headerKey) === 'true') {
                return Config::$config['api'][$configKey];
            }
        }

        // Normal Library request.
        return Config::$config['api']['live'];
    }
}
