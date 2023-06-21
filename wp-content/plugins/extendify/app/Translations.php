<?php
/**
 * Handles translations
 */

namespace Extendify;

/**
 * Handles translations
 */
class Translations
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->installLanguagePack('extendify', Config::$version, \get_locale());

        \add_action('plugins_loaded', function () {
            \load_plugin_textdomain('extendify');
        });
    }

    /**
     * Install language pack
     *
     * @param string $slug    The plugin slug.
     * @param string $version The plugin version.
     * @param string $locale  The locale.
     *
     * @return void|false
     */
    public function installLanguagePack($slug, $version, $locale)
    {
        $langsChecked = (array) get_option('extendify_language_file_preloaded', []);
        if (in_array($locale, $langsChecked, true)) {
            return;
        }

        // Check only once per language.
        update_option('extendify_language_file_preloaded', array_merge($langsChecked, [$locale]));
        include_once ABSPATH . 'wp-admin/includes/translation-install.php';

        $translations = translations_api('plugins', [
            'slug' => 'extendify',
            'version' => $version,
        ]);

        if (!$translations) {
            return false;
        }

        $translations = $translations['translations'];

        $data = array_values(array_filter($translations, function ($translation) use ($locale) {
            return $translation['language'] === $locale;
        }));

        if (! $data) {
            return false;
        }

        $translation = (object) $data[0];

        $currentlyInstalledPacks = wp_get_installed_translations('plugins');
        if (isset($currentlyInstalledPacks[$slug][$locale]) || !wp_can_install_language_pack()) {
            return;
        }

        $skin = new NoopUpgraderSkin();
        $upgrader = new \WP_Upgrader($skin);
        $upgrader->generic_strings();
        $result = $upgrader->run([
            'package' => $translation->package,
            'destination' => WP_LANG_DIR . '/plugins',
            'abort_if_destination_exists' => false,
        ]);
    }
}

/**
 * Overrides the WP output class to prevent any and all output.
 */
require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-includes/pluggable.php';
// phpcs:disable
class NoopUpgraderSkin extends \WP_Upgrader_Skin
{
    public function feedback($data, ...$args) {}
    public function header() {}
    public function footer() {}
}
// phpcs:enable
