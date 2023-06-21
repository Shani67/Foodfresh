<?php
/**
 * Simple router to handle admin page loading
 */

namespace Extendify;

use Extendify\Config;
use Extendify\Library\AdminPage as LibraryAdminPage;
use Extendify\Assist\AdminPage as AssistAdminPage;
use Extendify\Assist\Controllers\TasksController as AssistTasksController;
use Extendify\Onboarding\AdminPage as OnboardingAdminPage;

/**
 * This class handles routing when the main admin button is pressed.
 */
class AdminPageRouter
{
    /**
     * Adds various actions to set up the page
     *
     * @return void
     */
    public function __construct()
    {
        // Don't show the admin page if not using the standalone version (e.g. Redux).
        if (!Config::$standalone) {
            return;
        }

        // When Launch is finished, fire this to set the correct permalinks.
        // phpcs:ignore WordPress.Security.NonceVerification
        if (isset($_GET['extendify-launch-success'])) {
            \add_action('admin_init', function () {
                \flush_rewrite_rules();
            });
        }

        // Add top admin page to handle redirects. Everything
        // else will be a subpage of this.
        \add_action('admin_menu', [$this, 'addAdminMenu']);

        \add_action('admin_menu', function () {
            // Always load the Assist page.
            $assist = new AssistAdminPage();
            $cb = [$assist, 'pageContent'];
            $this->addSubMenu('Assist', $assist->slug, $cb);

            // Always load the Library page.
            $library = new LibraryAdminPage();
            $cb = [$library, 'pageContent'];
            $this->addSubMenu('Library', $library->slug, $cb);

            // Show the Launch menu for dev users.
            if ((Config::$showOnboarding && !Config::$launchCompleted) || Config::$environment === 'DEVELOPMENT') {
                $onboarding = new OnboardingAdminPage();
                $cb = [$onboarding, 'pageContent'];
                $this->addSubMenu('Launch', $onboarding->slug, $cb);
            }
        });

        if (Config::$sdkPartner !== 'standalone') {
            \add_action('wp_before_admin_bar_render', [$this, 'changeDashboardLink']);
            \add_filter('block_editor_settings_all', [$this, 'blockEditorSettingsAllFilter'], 10, 2);
            \add_filter('login_redirect', [$this, 'customLoginRedirect'], 10, 3);
        }

        // Hide the menu items unless in dev mode.
        if (Config::$environment === 'PRODUCTION') {
            add_action('admin_head', function () {
                echo '<style>
                #toplevel_page_extendify-admin-page .wp-submenu {
                    display:none!important;
                }
                #toplevel_page_extendify-admin-page::after {
                    content:none!important;
                }
                </style>';
            });
        }

        // If the user is redirected to this while visiting our url, intercept it.
        \add_filter('wp_redirect', function ($url) {
            // Check for extendify-launch-success as other plugins will not override
            // this as they intercept the request.
            // Special treatment for Yoast to disable their redirect when installing.
            if ($url === \admin_url() . 'admin.php?page=wpseo_installation_successful_free') {
                return \admin_url() . 'admin.php?page=extendify-assist';
            }

            // phpcs:ignore WordPress.Security.NonceVerification
            if (isset($_GET['extendify-launch-success'])) {
                return \admin_url() . $this->getRoute();
            }

            return $url;
        }, 9999);

        // Intercept requests and redirect as needed.
        // phpcs:ignore WordPress.Security.NonceVerification
        if (isset($_GET['page']) && $_GET['page'] === 'extendify-admin-page') {
            header('Location: ' . \admin_url() . $this->getRoute(), true, 302);
            exit;
        }
    }

    /**
     * Function for `block_editor_settings_all` filter-hook.
     *
     * @param array                    $editorSettings     Default editor settings.
     * @param \WP_Block_Editor_Context $blockEditorContext The current block editor context.
     *
     * @return array
     * phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter
     */
    public function blockEditorSettingsAllFilter($editorSettings, $blockEditorContext)
    {
        $editorSettings['__experimentalDashboardLink'] = \admin_url() . $this->getRoute();

        return $editorSettings;
    }

    /**
     * A helper for handling sub menus
     *
     * @param string   $name     - The menu name.
     * @param string   $slug     - The menu slug.
     * @param callable $callback - The callback to render the page.
     *
     * @return void
     */
    public function addSubMenu($name, $slug, $callback = '')
    {
        \add_submenu_page(
            'extendify-admin-page',
            $name,
            $name,
            Config::$requiredCapability,
            $slug,
            $callback
        );
    }

    /**
     * Adds Extendify top menu
     *
     * @return void
     */
    public function addAdminMenu()
    {
        $menuLabel = Config::$sdkPartner === 'standalone' ? 'Extendify' : __('Site Assistant', 'extendify');
        $menuLabel = sprintf('%1$s <span class="extendify-assist-badge-count" data-test="assist-badge-count"></span>', $menuLabel);

        \add_menu_page(
            'Extendify',
            $menuLabel,
            Config::$requiredCapability,
            'extendify-admin-page',
            '__return_null',
            // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
            'data:image/svg+xml;base64,' . base64_encode('<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.773,9.373L16.679,10.467L10,3.788L3.321,10.467L2.227,9.373L10,1.6L14.129,5.729L14.129,3.665L16.194,3.665L16.194,7.794L17.773,9.373ZM16.194,11.437L16.194,17.6L3.806,17.6L3.806,11.437L10,5.254L16.194,11.437ZM13.297,11.525C13.394,11.437 13.432,11.301 13.387,11.178L13.388,11.176C13.326,11.008 13.251,10.847 13.165,10.692L13.099,10.578C13.006,10.423 12.901,10.276 12.787,10.138C12.704,10.037 12.566,10.002 12.441,10.042L11.881,10.219C11.74,10.263 11.586,10.235 11.462,10.155C11.393,10.111 11.322,10.07 11.249,10.032C11.116,9.964 11.015,9.845 10.984,9.702L10.858,9.127C10.83,8.999 10.731,8.897 10.601,8.876C10.406,8.843 10.206,8.827 10.001,8.827C9.797,8.827 9.596,8.843 9.402,8.877C9.272,8.899 9.173,9 9.145,9.129L9.019,9.703C8.987,9.847 8.885,9.966 8.754,10.033C8.68,10.07 8.61,10.112 8.541,10.156C8.415,10.236 8.263,10.266 8.121,10.221L7.561,10.043C7.437,10.004 7.299,10.037 7.215,10.139C7.101,10.277 6.997,10.424 6.904,10.579L6.837,10.694C6.751,10.849 6.676,11.01 6.614,11.178C6.569,11.301 6.607,11.437 6.705,11.525L7.141,11.923C7.251,12.022 7.302,12.168 7.294,12.317C7.293,12.358 7.292,12.399 7.292,12.441C7.292,12.483 7.293,12.524 7.294,12.565C7.302,12.712 7.249,12.859 7.141,12.959L6.705,13.355C6.607,13.443 6.569,13.58 6.614,13.703C6.676,13.871 6.751,14.031 6.837,14.187L6.904,14.301C6.997,14.456 7.101,14.603 7.215,14.741C7.299,14.841 7.437,14.877 7.561,14.837L8.12,14.658C8.261,14.613 8.415,14.642 8.539,14.723C8.608,14.767 8.679,14.808 8.752,14.846C8.884,14.913 8.987,15.032 9.018,15.176L9.143,15.75C9.171,15.879 9.27,15.98 9.4,16.002C9.595,16.034 9.795,16.051 10,16.051C10.205,16.051 10.405,16.034 10.6,16.002C10.729,15.98 10.828,15.879 10.857,15.75L10.982,15.176C11.015,15.032 11.116,14.913 11.247,14.846C11.321,14.809 11.391,14.767 11.461,14.723C11.586,14.642 11.739,14.613 11.88,14.658L12.44,14.836C12.564,14.875 12.703,14.841 12.786,14.74C12.9,14.602 13.005,14.455 13.098,14.3L13.164,14.185C13.25,14.03 13.325,13.869 13.387,13.701C13.432,13.578 13.394,13.441 13.297,13.354L12.861,12.957C12.751,12.859 12.7,12.712 12.707,12.564C12.708,12.523 12.71,12.482 12.71,12.439C12.71,12.397 12.708,12.356 12.707,12.315C12.7,12.168 12.752,12.022 12.861,11.922L13.297,11.525ZM10.8,13.238C10.588,13.449 10.301,13.569 10.001,13.569C9.702,13.569 9.415,13.449 9.203,13.238C8.991,13.026 8.872,12.739 8.872,12.439C8.872,12.14 8.991,11.853 9.203,11.641C9.415,11.429 9.702,11.31 10.001,11.31C10.301,11.31 10.588,11.429 10.8,11.641C11.011,11.853 11.13,12.14 11.13,12.439C11.13,12.739 11.011,13.026 10.8,13.238Z" style="fill:#a7aaad;" fill="currentColor" /></svg>'),
            Config::$sdkPartner !== 'standalone' ? 0 : null
        );
    }

    /**
     * Routes pages accordingly
     *
     * @return string
     */
    public function getRoute()
    {
        // If dev, redirect to assist always.
        if (Config::$environment === 'DEVELOPMENT') {
            return 'admin.php?page=extendify-assist';
        }

        // If partner isn't set, show the Library page.
        if (Config::$sdkPartner === 'standalone') {
            return 'admin.php?page=extendify-welcome';
        }

        // If they made it this far, they can go to Assist.
        return 'admin.php?page=extendify-assist';
    }

    /**
     * Change the default url of the dashboard and the site name to extendify assists
     *
     * @return void
     */
    public function changeDashboardLink()
    {
        $wpAdminBar = $GLOBALS['wp_admin_bar'];

        if (!\is_admin()) {
            $url = \admin_url() . $this->getRoute();

            $siteName = $wpAdminBar->get_node('site-name');
            $siteName->href = $url;
            $wpAdminBar->add_menu($siteName);

            $dashboard = $wpAdminBar->get_node('dashboard');
            $dashboard->href = $url;
            $wpAdminBar->add_menu($dashboard);
        }
    }

    /**
     * A custom login redirect
     *
     * @param string             $redirectTo          - The redirect destination URL.
     * @param string             $requestedRedirectTo - The requested redirect destination URL passed as a parameter.
     * @param \WP_USER|\WP_ERROR $user                - WP_User object if login was successful, WP_Error object otherwise.
     *
     * @return string
     */
    public function customLoginRedirect($redirectTo, $requestedRedirectTo, $user)
    {
        if (!$user || !is_a($user, 'WP_User')) {
            return $redirectTo;
        }

        if (!empty($requestedRedirectTo) && $requestedRedirectTo !== \admin_url()) {
            return $requestedRedirectTo;
        }

        return $user->has_cap('administrator') ? \admin_url() . $this->getRoute() : home_url();
    }
}
