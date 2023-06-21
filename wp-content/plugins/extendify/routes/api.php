<?php
/**
 * Api routes
 */

if (!defined('ABSPATH')) {
    die('No direct access.');
}

use Extendify\ApiRouter;
use Extendify\Library\Controllers\AuthController;
use Extendify\Library\Controllers\MetaController;
use Extendify\Library\Controllers\PingController;
use Extendify\Library\Controllers\PluginController;
use Extendify\Library\Controllers\SiteSettingsController;
use Extendify\Library\Controllers\TaxonomyController;
use Extendify\Library\Controllers\TemplateController;
use Extendify\Library\Controllers\UserController;
use Extendify\Onboarding\Controllers\DataController;
use Extendify\Onboarding\Controllers\LibraryController;
use Extendify\Onboarding\Controllers\WPController;
use Extendify\Assist\Controllers\AssistDataController;
use Extendify\Assist\Controllers\GlobalsController;
use Extendify\Assist\Controllers\TasksController;
use Extendify\Assist\Controllers\TourController;
use Extendify\Assist\Controllers\RouterController;
use Extendify\Assist\Controllers\UserSelectionController;
use Extendify\Assist\Controllers\WPController as AssistWPController;
use Extendify\Assist\Controllers\QuickLinksController;
use Extendify\Assist\Controllers\RecommendationsController;
use Extendify\Assist\Controllers\SupportArticlesController;
use Extendify\Assist\Controllers\RecommendationsBannerController;
use Extendify\Chat\Controllers\ChatController;

\add_action(
    'rest_api_init',
    function () {
        ApiRouter::get('/active-plugins', [PluginController::class, 'active']);
        ApiRouter::get('/plugins', [PluginController::class, 'index']);
        ApiRouter::post('/plugins', [PluginController::class, 'install']);

        ApiRouter::get('/taxonomies', [TaxonomyController::class, 'index']);

        ApiRouter::post('/templates', [TemplateController::class, 'index']);
        ApiRouter::post('/templates/(?P<template_id>[a-zA-Z0-9-]+)', [TemplateController::class, 'ping']);

        ApiRouter::get('/user', [UserController::class, 'show']);
        ApiRouter::post('/user', [UserController::class, 'store']);
        ApiRouter::post('/clear-user', [UserController::class, 'delete']);
        ApiRouter::get('/user-meta', [UserController::class, 'meta']);

        ApiRouter::post('/register', [AuthController::class, 'register']);
        ApiRouter::post('/login', [AuthController::class, 'login']);

        ApiRouter::get('/meta-data', [MetaController::class, 'getAll']);
        ApiRouter::post('/simple-ping', [PingController::class, 'ping']);

        ApiRouter::get('/site-settings', [SiteSettingsController::class, 'show']);
        ApiRouter::post('/site-settings', [SiteSettingsController::class, 'store']);
        ApiRouter::post('/site-settings/options', [SiteSettingsController::class, 'updateOption']);
        ApiRouter::post('/site-settings/add-utils-to-global-styles', [SiteSettingsController::class, 'addUtilsToGlobalStyles']);

        // Onboarding.
        ApiRouter::post('/onboarding/options', [WPController::class, 'updateOption']);
        ApiRouter::get('/onboarding/options', [WPController::class, 'getOption']);
        ApiRouter::post('/onboarding/parse-theme-json', [WPController::class, 'parseThemeJson']);
        ApiRouter::get('/onboarding/active-plugins', [WPController::class, 'getActivePlugins']);

        ApiRouter::get('/onboarding/site-types', [DataController::class, 'getSiteTypes']);
        ApiRouter::get('/onboarding/styles-list', [DataController::class, 'getStylesList']);
        ApiRouter::get('/onboarding/styles', [DataController::class, 'getStyles']);
        ApiRouter::get('/onboarding/layout-types', [DataController::class, 'getLayoutTypes']);
        ApiRouter::get('/onboarding/goals', [DataController::class, 'getGoals']);
        ApiRouter::get('/onboarding/suggested-plugins', [DataController::class, 'getSuggestedPlugins']);
        ApiRouter::get('/onboarding/template', [DataController::class, 'getTemplate']);
        ApiRouter::get('/onboarding/ping', [DataController::class, 'ping']);

        // Assist.
        ApiRouter::post('/assist/options', [AssistWPController::class, 'updateOption']);
        ApiRouter::get('/assist/options', [AssistWPController::class, 'getOption']);
        ApiRouter::get('/assist/launch-pages', [AssistDataController::class, 'getLaunchPages']);
        ApiRouter::get('/assist/tasks', [TasksController::class, 'fetchTasks']);
        ApiRouter::get('/assist/task-data', [TasksController::class, 'get']);
        ApiRouter::post('/assist/task-data', [TasksController::class, 'store']);
        ApiRouter::get('/assist/tours', [TourController::class, 'fetchTours']);
        ApiRouter::get('/assist/tour-data', [TourController::class, 'get']);
        ApiRouter::post('/assist/tour-data', [TourController::class, 'store']);
        ApiRouter::post('/assist/router-data', [RouterController::class, 'store']);
        ApiRouter::get('/assist/router-data', [RouterController::class, 'get']);
        ApiRouter::get('/assist/global-data', [GlobalsController::class, 'get']);
        ApiRouter::post('/assist/global-data', [GlobalsController::class, 'store']);
        ApiRouter::get('/assist/user-selection-data', [UserSelectionController::class, 'get']);
        ApiRouter::post('/assist/user-selection-data', [UserSelectionController::class, 'store']);
        ApiRouter::get('/assist/active-plugins', [AssistWPController::class, 'getActivePlugins']);
        ApiRouter::get('/assist/tasks/dependency-completed', [TasksController::class, 'dependencyCompleted']);
        ApiRouter::get('/assist/quicklinks', [QuickLinksController::class, 'fetchQuickLinks']);
        ApiRouter::get('/assist/recommendations', [RecommendationsController::class, 'fetchRecommendations']);
        ApiRouter::get('/assist/recommendation-data', [RecommendationsController::class, 'get']);
        ApiRouter::post('/assist/recommendation-data', [RecommendationsController::class, 'store']);
        ApiRouter::get('/assist/support-articles', [SupportArticlesController::class, 'articles']);
        ApiRouter::get('/assist/support-article-categories', [SupportArticlesController::class, 'categories']);
        ApiRouter::get('/assist/support-article', [SupportArticlesController::class, 'article']);
        ApiRouter::get('/assist/support-articles-data', [SupportArticlesController::class, 'get']);
        ApiRouter::post('/assist/support-articles-data', [SupportArticlesController::class, 'store']);
        ApiRouter::get('/assist/get-redirect', [SupportArticlesController::class, 'getRedirect']);
        ApiRouter::get('/assist/recommendations-banner', [RecommendationsBannerController::class, 'get']);
        ApiRouter::get('/assist/support-articles-search', [SupportArticlesController::class, 'searchArticles']);

        // Chat.
        ApiRouter::post('/chat/ask-question', [ChatController::class, 'askQuestion']);
        ApiRouter::get('/chat/get-answer/', [ChatController::class, 'getAnswer']);

        // TODO: consider merging this route into the library.
        ApiRouter::post('/library/site-type', [LibraryController::class, 'updateSiteType']);
    }
);
