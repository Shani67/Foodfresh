<?php
/**
 * Controls User info
 */

namespace Extendify\Library\Controllers;

use Extendify\Library\SiteSettings;
use Extendify\Config;

if (!defined('ABSPATH')) {
    die('No direct access.');
}

/**
 * The controller for managing Extendify SiteSettings.
 */
class SiteSettingsController
{

    /**
     * Return Current SiteSettings meta data
     *
     * @return array
     */
    public static function show()
    {
        $siteSettings = json_decode(SiteSettings::data(), true);
        // Keep the user sitetype in sync across all users.
        $siteType = \get_option('extendify_siteType', false);
        if ($siteType) {
            $siteSettings['state']['siteType'] = $siteType;
        }

        return new \WP_REST_Response(wp_json_encode($siteSettings));
    }

    /**
     * Persist the data
     *
     * @param \WP_REST_Request $request - The request.
     * @return array
     */
    public static function store($request)
    {
        $settingsData = json_decode($request->get_param('data'), true);
        \update_option(SiteSettings::key(), $settingsData, true);
        return new \WP_REST_Response(SiteSettings::data());
    }
    /**
     * Persist the data
     *
     * @param \WP_REST_Request $request - The request.
     * @return \WP_REST_Response
     */
    public static function updateOption($request)
    {
        $params = $request->get_json_params();
        \update_option($params['option'], $params['value']);
        return new \WP_REST_Response(['success' => true], 200);
    }

    /**
     * Update the user's global styles with the extendify utilities
     *
     * @return \WP_REST_Response
     */
    public static function addUtilsToGlobalStyles()
    {
        $globalStyles = get_posts([
            'post_type' => 'wp_global_styles',
            'post_status' => 'publish',
            'posts_per_page' => -1,
        ]);

        $extendifyCss = static::getDeactivationCss();

        foreach ($globalStyles as $post) {
            // phpcs:ignore Squiz.NamingConventions.ValidVariableName.MemberNotCamelCaps
            if (!isset($post->post_content)) {
                continue;
            }

            // phpcs:ignore Squiz.NamingConventions.ValidVariableName.MemberNotCamelCaps
            $content = json_decode($post->post_content, true);
            if (!isset($content['styles']['css'])) {
                if (!isset($content['styles'])) {
                    $content['styles'] = [];
                }

                $content['styles']['css'] = '';
                $content['isGlobalStylesUserThemeJSON'] = true;
                $content['version'] = 2;
            }

            // If they already have extendify styles, leave it alone.
            if (str_contains($content['styles']['css'], 'ext-')) {
                continue;
            }

            $content['styles']['css'] .= ("\n\n" . $extendifyCss);

            wp_update_post(wp_slash([
                'ID' => $post->ID,
                'post_content' => wp_json_encode($content),
            ]));
        }//end foreach

        return new \WP_REST_Response(['success' => true], 200);
    }

    /**
     * Custom CSS to be added on deactivation
     *
     * @return string
     */
    public static function getDeactivationCss()
    {
        $css = '';
        $theme = get_option('template');

        if ($theme === 'twentytwenty') {
            $css = '/* Twenty Twenty adds a lot of margin automatically to blocks. We only want our own margin added to our patterns. */

            .ext .wp-block-group__inner-container figure.wp-block-gallery.alignfull {
            margin-top: unset !important;
            margin-bottom: unset !important;
            }';
        }

        // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
        $content = file_get_contents(EXTENDIFY_PATH . 'public/build/utility-minimum.css');

        return $css .= "\n\n" . $content;
    }
}
