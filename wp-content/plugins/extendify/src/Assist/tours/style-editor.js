import { __ } from '@wordpress/i18n'
import { waitUntilExists } from '@assist/util/element'

const { adminUrl, themeSlug, blockTheme } = window.extAssistData

export default {
    id: 'style-editor-tour',
    settings: {
        allowOverflow: false,
        startFrom: [
            adminUrl +
                `site-editor.php?canvas=edit&postType=wp_template&postId=${themeSlug}%2F%2Fhome`,
        ],
        enabled: blockTheme ?? false,
    },
    onStart: () => {
        // close modal if shown
        document.querySelector('.components-modal__header > button')?.click()
    },
    steps: [
        {
            title: __('Style Editor', 'extendify'),
            text: __(
                'The style editor allows you to edit the styles, colors, and typographic elements of your site. To access the style editor, first open the Editor via Appearance > Editor.',
                'extendify',
            ),
            image: 'https://placehold.co/342x240',
            attachTo: {
                element: '.interface-pinned-items button:nth-child(2)',
                offset: {
                    marginTop: 10,
                    marginLeft: -30,
                },
                position: {
                    x: 'left',
                    y: 'bottom',
                },
                hook: 'top left',
            },
            events: {
                beforeAttach: () => waitUntilExists('.interface-pinned-items'),
            },
        },
        {
            title: __('Styles Panel', 'extendify'),
            text: __(
                'The styles panel allows you to customize the appearance of your site. It includes style variations, colors, typography, and more.',
                'extendify',
            ),
            attachTo: {
                element: '.edit-site-global-styles-sidebar',
                offset: {
                    marginTop: 1,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    document
                        .querySelector(
                            '.interface-pinned-items button:nth-child(2):not(.is-pressed)',
                        )
                        ?.click()
                    return await waitUntilExists(
                        '.edit-site-global-styles-sidebar',
                    )
                },
            },
        },
        {
            title: __('Style Variations', 'extendify'),
            text: __(
                'The Browse Styles button opens the style variations panel.',
                'extendify',
            ),
            attachTo: {
                element:
                    '.edit-site-global-styles-sidebar button[id="/variations"]',
                offset: {
                    marginTop: 0,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    // Press the back button if the next step opened the variations panel, and now we're going back.
                    document
                        .querySelector(
                            '.edit-site-global-styles-sidebar button.components-navigator-back-button',
                        )
                        ?.click()
                    return await waitUntilExists(
                        '.edit-site-global-styles-preview__iframe',
                    )
                },
            },
        },
        {
            title: __('Style Variations', 'extendify'),
            text: __(
                'Choose a style you like to preview how it will look on your site.',
                'extendify',
            ),
            attachTo: {
                element: '.edit-site-global-styles-sidebar__navigator-screen',
                offset: {
                    marginTop: 0,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    document
                        .querySelector(
                            '.edit-site-global-styles-sidebar button[id="/variations"]',
                        )
                        ?.click()
                    return await waitUntilExists(
                        '.edit-site-global-styles-header__description',
                    )
                },
            },
        },
        {
            title: __('Typography', 'extendify'),
            text: __(
                'The Typography button opens the typography settings panel.',
                'extendify',
            ),
            attachTo: {
                element:
                    '.edit-site-global-styles-sidebar button[id="/typography"]',

                offset: {
                    marginTop: 0,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    // Press the back button if the next step opened the typography panel, and now we're going back.
                    document
                        .querySelector(
                            '.edit-site-global-styles-sidebar button.components-navigator-back-button',
                        )
                        ?.click()
                    return await waitUntilExists(
                        '.edit-site-global-styles-preview__iframe',
                    )
                },
            },
        },
        {
            title: __('Typography', 'extendify'),
            text: __('Choose a typographic element to customize.', 'extendify'),
            attachTo: {
                element: '.edit-site-global-styles-sidebar__navigator-screen',
                offset: {
                    marginTop: 0,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    document
                        .querySelector(
                            '.edit-site-global-styles-sidebar button[id="/typography"]',
                        )
                        ?.click()
                    return await waitUntilExists(
                        '.edit-site-global-styles-header__description',
                    )
                },
            },
        },
        {
            title: __('Colors', 'extendify'),
            text: __(
                'The Colors button opens the color settings panel.',
                'extendify',
            ),
            attachTo: {
                element:
                    '.edit-site-global-styles-sidebar button[id="/colors"]',

                offset: {
                    marginTop: 0,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    // Press the back button if the next step opened the typography panel, and now we're going back.
                    document
                        .querySelector(
                            '.edit-site-global-styles-sidebar button.components-navigator-back-button',
                        )
                        ?.click()
                    return await waitUntilExists(
                        '.edit-site-global-styles-preview__iframe',
                    )
                },
            },
        },
        {
            title: __('Colors', 'extendify'),
            text: __(
                "Select the theme's palette or individual elements to customize their colors.",
                'extendify',
            ),
            attachTo: {
                element: '.edit-site-global-styles-sidebar__navigator-screen',
                offset: {
                    marginTop: 0,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    document
                        .querySelector(
                            '.edit-site-global-styles-sidebar button[id="/colors"]',
                        )
                        ?.click()
                    return await waitUntilExists(
                        '.edit-site-global-styles-header__description',
                    )
                },
            },
        },
        {
            title: __('Layout', 'extendify'),
            text: __(
                'The Layout button opens the layout settings panel.',
                'extendify',
            ),
            attachTo: {
                element:
                    '.edit-site-global-styles-sidebar button[id="/layout"]',

                offset: {
                    marginTop: 0,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    // Press the back button if the next step opened the typography panel, and now we're going back.
                    document
                        .querySelector(
                            '.edit-site-global-styles-sidebar button.components-navigator-back-button',
                        )
                        ?.click()
                    return await waitUntilExists(
                        '.edit-site-global-styles-preview__iframe',
                    )
                },
            },
        },
        {
            title: __('Layout', 'extendify'),
            text: __(
                'From here you can customize the dimensions, padding, and margins used for your site layout.',
                'extendify',
            ),
            attachTo: {
                element: '.edit-site-global-styles-sidebar__navigator-screen',
                offset: {
                    marginTop: 0,
                    marginLeft: -15,
                },
                position: {
                    x: 'left',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    document
                        .querySelector(
                            '.edit-site-global-styles-sidebar button[id="/layout"]',
                        )
                        ?.click()
                    return await waitUntilExists('.components-tools-panel')
                },
            },
        },
    ],
    onFinish: async () => {
        document
            .querySelector(
                '.edit-site-global-styles-sidebar button.components-navigator-back-button',
            )
            ?.click()
        return await waitUntilExists('.edit-site-global-styles-preview__iframe')
    },
}
