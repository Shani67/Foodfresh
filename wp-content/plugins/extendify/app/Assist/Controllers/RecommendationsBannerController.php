<?php
/**
 * Controls Recommendations Banner
 */

namespace Extendify\Assist\Controllers;

use Extendify\Http;

if (!defined('ABSPATH')) {
    die('No direct access.');
}

/**
 * The controller for fetching recommendations banner
 */
class RecommendationsBannerController
{
    /**
     * Return recommendations from source.
     *
     * @return \WP_REST_Response
     */
    public static function get()
    {
        $response = Http::get('/recommendations-banner');
        return new \WP_REST_Response(
            $response,
            wp_remote_retrieve_response_code($response)
        );
    }
}
