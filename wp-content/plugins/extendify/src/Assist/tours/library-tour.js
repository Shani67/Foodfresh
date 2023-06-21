import { __ } from '@wordpress/i18n'
import { waitUntilExists, waitUntilGone } from '@assist/util/element'

export default {
    id: 'library-tour',
    settings: {
        allowOverflow: true,
        hideDotsNav: true,
        startFrom: [
            window.extAssistData.adminUrl + 'post-new.php?post_type=page',
        ],
    },
    onStart: async () => {
        // Wait for gutenberg to be ready
        await waitUntilExists('#extendify-templates-inserter-btn')

        // Close sidebar if open
        document
            .querySelector(`[aria-label="${__('Settings')}"].is-pressed`)
            ?.click()
    },
    steps: [
        {
            title: __('Open the Pattern Library', 'extendify'),
            text: __(
                'The Extendify pattern library can be opened by clicking the button to the left.',
                'extendify',
            ),
            attachTo: {
                element: '#extendify-templates-inserter-btn',
                offset: {
                    marginTop: 0,
                    marginLeft: 15,
                },
                position: {
                    x: 'right',
                    y: 'top',
                },
                hook: 'top left',
            },
            events: {
                beforeAttach: () => {
                    // If the Extendify library is open, close it
                    return dispatchEvent(
                        new CustomEvent('extendify::close-library'),
                    )
                },
            },
        },
        {
            title: __('Patterns and Layouts', 'extendify'),
            text: __(
                'Choose to insert individual block patterns, or full blown templates.',
                'extendify',
            ),
            attachTo: {
                element: '#patterns-toggle',
                offset: {
                    marginTop: 0,
                    marginLeft: 15,
                },
                position: {
                    x: 'right',
                    y: 'top',
                },
                hook: 'top left',
            },
            options: {
                blockPointerEvents: true,
            },
            events: {
                beforeAttach: async () => {
                    // Open the Extendify library panel
                    dispatchEvent(new CustomEvent('extendify::open-library'))

                    return await waitUntilExists('#patterns-toggle')
                },
            },
        },
        {
            title: __('Filter Patterns', 'extendify'),
            text: __(
                'Click on any pattern category to refine the selection.',
                'extendify',
            ),
            attachTo: {
                element: '#filter-patterns',
                position: {
                    x: 'right',
                    y: 'top',
                },
                hook: 'top left',
            },
            events: {
                beforeAttach: () => {
                    document
                        .querySelector(
                            'ul#filter-patterns > li:first-of-type button',
                        )
                        .click()
                },
            },
        },
        {
            title: __('Select a Pattern', 'extendify'),
            text: __(
                'Simply select any pattern you wish to insert into a page by clicking on it.',
                'extendify',
            ),
            attachTo: {
                element: '#masonry-grid > div:first-child > div:first-child',
                position: {
                    x: 'right',
                    y: 'top',
                },
                hook: 'top left',
            },
            events: {
                beforeAttach: async () => {
                    // If the Extendify library is closed, open it
                    dispatchEvent(new CustomEvent('extendify::open-library'))

                    return await waitUntilExists(
                        '#masonry-grid > div:first-child > div:first-child',
                    )
                },
            },
        },
        {
            title: __('View the Inserted Pattern', 'extendify'),
            text: __(
                'The selected pattern has been inserted into the page.',
                'extendify',
            ),
            attachTo: {
                element: '.wp-block-group:last-child',
                frame: 'iframe[name="editor-canvas"]',
                offset: {
                    marginTop: 15,
                    marginLeft: 0,
                },
                position: {
                    x: 'right',
                    y: 'top',
                },
                hook: 'top right',
            },
            events: {
                beforeAttach: async () => {
                    document
                        .querySelector(
                            '#masonry-grid > div:first-child > div:first-child > div',
                        )
                        ?.click()

                    return await waitUntilGone('#masonry-grid')
                },
            },
            options: {
                hideBackButton: true,
            },
        },
    ],
}
