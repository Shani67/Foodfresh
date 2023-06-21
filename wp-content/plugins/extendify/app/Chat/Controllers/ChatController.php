<?php
/**
 * Controls Quick Links
 */

namespace Extendify\Chat\Controllers;

use Extendify\Http;

if (!defined('ABSPATH')) {
    die('No direct access.');
}

/**
 * The controller for fetching quick links
 */
class ChatController
{
    /**
     * Send a new question the chat api.
     *
     * @param \WP_REST_Request $request The request.
     * @return \WP_REST_Response
     */
    public static function askQuestion($request)
    {
        $siteType = get_option('extendify_siteType', []);
        $siteInfo = [
            'siteType' => isset($siteType['slug']) ? $siteType['slug'] : '',
            'siteId' => get_option('extendify_site_id', false),
        ];

        $params = $request->get_params();
        $params = array_merge($params['data'], $siteInfo);

        $response = Http::post('/ask-question', $params);

        return new \WP_REST_Response(
            $response,
            wp_remote_retrieve_response_code($response)
        );
    }

    /**
     * Request an answer from the chat api.
     *
     * @param \WP_REST_Request $request The request.
     * @return \WP_REST_Response
     */
    public static function getAnswer($request)
    {
        $response = Http::get('/get-answer', $request->get_params());
        return new \WP_REST_Response(
            $response,
            wp_remote_retrieve_response_code($response)
        );
    }
}
