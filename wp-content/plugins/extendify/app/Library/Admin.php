<?php
/**
 * Admin.
 */

namespace Extendify\Library;

use Extendify\Config;
use Extendify\User;
use Extendify\Library\SiteSettings;

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
            'admin_enqueue_scripts',
            function ($hook) {
                if (!current_user_can(Config::$requiredCapability)) {
                    return;
                }

                $this->maybeAddDeactivationScript();

                if (!$this->checkItsGutenbergPost($hook)) {
                    return;
                }

                if (!$this->isLibraryEnabled()) {
                    return;
                }

                $this->addScopedScriptsAndStyles();
            }
        );
    }

    /**
     * Checks if an Extendify pattern exists in any post type
     *
     * @return boolean
     */
    public function patternWasImported()
    {
        // check if Launch has been completed to avoid database search.
        if (Config::$launchCompleted) {
            return true;
        }

        // This is set when a user imports a pattern from the library.
        $wasImported = get_option('extendify_pattern_was_imported', null);
        if ($wasImported !== null) {
            return $wasImported;
        }

        // We only check this once (for bw compatibility).
        $wpdb = $GLOBALS['wpdb'];
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery
        $patternExists = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM $wpdb->posts WHERE post_content LIKE %s  AND post_type != 'revision'",
                '%ext-%'
            )
        ) !== '0';

        update_option('extendify_pattern_was_imported', $patternExists);
        return $patternExists;
    }

    /**
     * Makes sure we are on the correct page
     *
     * @param string $hook - An optional hook provided by WP to identify the page.
     * @return boolean
     */
    public function checkItsGutenbergPost($hook = '')
    {
        // Check for the post type, or on the FSE page.
        $type = isset($GLOBALS['typenow']) ? $GLOBALS['typenow'] : '';
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (!$type && isset($_GET['postType'])) {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $type = sanitize_text_field(wp_unslash($_GET['postType']));
        }

        if (\use_block_editor_for_post_type($type)) {
            return $hook && in_array($hook, ['post.php', 'post-new.php'], true);
        }

        return $hook && in_array($hook, ['site-editor.php'], true);
    }

    /**
     * Adds various JS scripts
     *
     * @return void
     */
    public function addScopedScriptsAndStyles()
    {
        $user = json_decode(User::data('extendifysdk_user_data'), true);
        $openOnNewPage = isset($user['state']['openOnNewPage']) ? $user['state']['openOnNewPage'] : Config::$launchCompleted;
        $version = Config::$environment === 'PRODUCTION' ? Config::$version : uniqid();
        $scriptAssetPath = EXTENDIFY_PATH . 'public/build/extendify-asset.php';
        $fallback = [
            'dependencies' => [],
            'version' => $version,
        ];
        $scriptAsset = file_exists($scriptAssetPath) ? require $scriptAssetPath : $fallback;
        foreach ($scriptAsset['dependencies'] as $style) {
            wp_enqueue_style($style);
        }

        \wp_register_script(
            Config::$slug . '-scripts',
            EXTENDIFY_BASE_URL . 'public/build/extendify.js',
            $scriptAsset['dependencies'],
            $scriptAsset['version'],
            true
        );

        \wp_localize_script(
            Config::$slug . '-scripts',
            'extendifyData',
            array_merge([
                'root' => \esc_url_raw(rest_url(Config::$slug . '/' . Config::$apiVersion)),
                'nonce' => \wp_create_nonce('wp_rest'),
                'user' => $user,
                'openOnNewPage' => $openOnNewPage,
                'sitesettings' => json_decode(SiteSettings::data()),
                'sdk_partner' => \esc_attr(Config::$sdkPartner),
                'asset_path' => \esc_url(EXTENDIFY_URL . 'public/assets'),
                'standalone' => \esc_attr(Config::$standalone),
                'devbuild' => \esc_attr(Config::$environment === 'DEVELOPMENT'),
                'insightsId' => \get_option('extendify_site_id', ''),
            ], $this->getPartnerInformation())
        );

        \wp_enqueue_script(Config::$slug . '-scripts');

        \wp_set_script_translations(Config::$slug . '-scripts', 'extendify');

        // Inline the library styles to keep them out of the iframe live preview.
        // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
        $css = file_get_contents(EXTENDIFY_PATH . 'public/build/extendify.css');
        \wp_register_style(Config::$slug, false, [], $version);
        \wp_enqueue_style(Config::$slug);
        \wp_add_inline_style(Config::$slug, $css);
        $this->registerPartnerStyle();
    }

    /**
     * Adds deactivation prompt JS script
     *
     * @return void
     */
    public function maybeAddDeactivationScript()
    {
        $screen = get_current_screen();
        if (!isset($screen->id) || $screen->id !== 'plugins') {
            return;
        }

        if (version_compare(get_bloginfo('version'), '6.2', '<')) {
            return;
        }

        if (!$this->patternWasImported()) {
            return;
        }

        $version = Config::$environment === 'PRODUCTION' ? Config::$version : uniqid();
        $scriptAssetPath = EXTENDIFY_PATH . 'public/build/extendify-deactivate.asset.php';
        $fallback = [
            'dependencies' => [],
            'version' => $version,
        ];
        $scriptAsset = file_exists($scriptAssetPath) ? require $scriptAssetPath : $fallback;
        foreach ($scriptAsset['dependencies'] as $style) {
            wp_enqueue_style($style);
        }

        \wp_register_script(
            Config::$slug . '-deactivate-scripts',
            EXTENDIFY_BASE_URL . 'public/build/extendify-deactivate.js',
            $scriptAsset['dependencies'],
            $scriptAsset['version'],
            true
        );

        \wp_localize_script(
            Config::$slug . '-deactivate-scripts',
            'extendifyData',
            array_merge([
                'root' => \esc_url_raw(rest_url(Config::$slug . '/' . Config::$apiVersion)),
                'nonce' => \wp_create_nonce('wp_rest'),
                'adminUrl' => \esc_url_raw(\admin_url()),
            ], $this->getPartnerInformation())
        );

        \wp_enqueue_script(Config::$slug . '-deactivate-scripts');

        \wp_set_script_translations(Config::$slug . '-deactivate-scripts', 'extendify');

        \wp_enqueue_style(Config::$slug, EXTENDIFY_BASE_URL . '/public/build/extendify.css', [], $version);
        $this->registerPartnerStyle();
    }

    /**
     * Check if current user is Admin
     *
     * @return Boolean
     */
    private function isAdmin()
    {
        if (\is_multisite()) {
            return \is_super_admin();
        }

        return in_array('administrator', \wp_get_current_user()->roles, true);
    }

    /**
     * Check if scripts should add
     *
     * @return Boolean
     */
    public function isLibraryEnabled()
    {
        $settings = json_decode(SiteSettings::data());

        // If it's disabled, only show it for admins.
        if (isset($settings->state) && (isset($settings->state->enabled)) && !$settings->state->enabled) {
            return $this->isAdmin();
        }

        return true;
    }

    /**
     * Get the Partner information, if it is presented.
     *
     * @return array
     */
    protected function getPartnerInformation()
    {
        $partnerData = $this->checkPartnerDataSources();

        $logo = isset($partnerData['logo']) ? $partnerData['logo'] : null;
        $name = isset($partnerData['name']) ? $partnerData['name'] : \__('Partner logo', 'extendify');

        return [
            'partnerLogo' => $logo,
            'partnerName' => $name,
        ];
    }

    /**
     * Register the Partner style, if it is presented.
     *
     * @return void
     */
    protected function registerPartnerStyle()
    {
        $partnerData = $this->checkPartnerDataSources();

        if (isset($partnerData['bgColor']) && isset($partnerData['fgColor'])) {
            \wp_add_inline_style(Config::$slug, ":root {
                --ext-partner-library-theme-primary-bg: {$partnerData['bgColor']};
                --ext-partner-library-theme-primary-text: {$partnerData['fgColor']};
            }");
        }
    }

    /**
     * Check if partner data is available.
     *
     * @return array
     */
    public function checkPartnerDataSources()
    {
        $return = [];

        try {
            if (defined('EXTENDIFY_ONBOARDING_BG')) {
                $return['bgColor'] = constant('EXTENDIFY_ONBOARDING_BG');
                $return['fgColor'] = constant('EXTENDIFY_ONBOARDING_TXT');
                $return['logo'] = constant('EXTENDIFY_PARTNER_LOGO');
            }

            $data = get_option('extendify_partner_data');
            if ($data) {
                $return['bgColor'] = $data['backgroundColor'];
                $return['fgColor'] = $data['foregroundColor'];
                // Need this check to avoid errors if no partner logo is set in Airtable.
                $return['logo'] = $data['logo'] ? $data['logo'][0]['thumbnails']['large']['url'] : null;
                $return['name'] = isset($data['name']) ? $data['name'] : '';
            }
        } catch (\Exception $e) {
            // Do nothing here, set variables below. Coding Standards require something to be in the catch.
            $e;
        }//end try

        return $return;
    }
}
