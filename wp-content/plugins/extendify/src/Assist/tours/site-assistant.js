import { __ } from '@wordpress/i18n'
import { waitUntilExists } from '@assist/util/element'

export default {
    id: 'site-assistant-tour',
    settings: {
        allowOverflow: false,
        startFrom: [
            window.extAssistData.adminUrl +
                'admin.php?page=extendify-assist#dashboard',
        ],
    },
    steps: [
        {
            title: __('Site Assistant', 'extendify'),
            text: __(
                'The Site Assistant gives you personalized recommendations and helps with creating and maintaining your site.',
                'extendify',
            ),
            attachTo: {
                element: '#assist-menu-bar',
                offset: {
                    marginTop: 20,
                    marginLeft: -5,
                },
                position: {
                    x: 'left',
                    y: 'bottom',
                },
                hook: 'top left',
                boxPadding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            events: {
                onAttach: () => {
                    document.querySelector('#assist-menu-bar')?.scrollIntoView()
                },
            },
        },
        {
            title: __('Tasks', 'extendify'),
            text: __(
                "Now that you've created your starter site, make it your own with these follow up tasks.",
                'extendify',
            ),
            showOnlyIf: () => document.querySelector('.assist-tasks-module'),
            attachTo: {
                element: '#assist-tasks-module',
                offset: {
                    marginTop: window.innerWidth <= 1150 ? 15 : 0,
                    marginLeft: window.innerWidth <= 1150 ? 2 : 15,
                },
                position: {
                    x: window.innerWidth <= 1150 ? 'left' : 'right',
                    y: window.innerWidth <= 1150 ? 'bottom' : 'top',
                },
                hook: 'top left',
            },
            events: {
                beforeAttach: () => waitUntilExists('#assist-tasks-module'),
                onAttach: () => {
                    document
                        .querySelector('#assist-tasks-module')
                        ?.scrollIntoView()
                },
            },
        },
        {
            title: __('Recommendations', 'extendify'),
            text: __(
                'See our personalized recommendations for you that will help you accomplish your goals.',
                'extendify',
            ),
            showOnlyIf: () =>
                document.querySelector('#assist-recommendations-module'),
            attachTo: {
                element: '#assist-recommendations-module',
                offset: {
                    marginTop: window.innerWidth <= 1150 ? 20 : 0,
                    marginLeft: window.innerWidth <= 1150 ? -5 : 15,
                },
                position: {
                    x: window.innerWidth <= 1150 ? 'left' : 'right',
                    y: window.innerWidth <= 1150 ? 'bottom' : 'top',
                },
                hook: 'top left',
            },
            events: {
                beforeAttach: () =>
                    waitUntilExists('#assist-recommendations-module'),
                onAttach: () => {
                    document
                        .querySelector('#assist-recommendations-module')
                        ?.scrollIntoView()
                },
            },
        },
        {
            title: __('Knowledge Base', 'extendify'),
            text: __(
                'Find articles with information on accomplishing different things with WordPress, including screenshots, and videos.',
                'extendify',
            ),
            attachTo: {
                element: '#assist-knowledge-base-module',
                offset: {
                    marginTop: window.innerWidth <= 1150 ? 15 : 0,
                    marginLeft: window.innerWidth <= 1150 ? 2 : -15,
                },
                position: {
                    x: window.innerWidth <= 1150 ? 'left' : 'left',
                    y: window.innerWidth <= 1150 ? 'bottom' : 'top',
                },
                hook: window.innerWidth <= 1150 ? 'top left' : 'top right',
            },
            events: {
                beforeAttach: () =>
                    waitUntilExists('#assist-knowledge-base-module'),
                onAttach: () => {
                    document
                        .querySelector('#assist-knowledge-base-module')
                        ?.scrollIntoView()
                },
            },
        },
        {
            title: __('Tours', 'extendify'),
            text: __(
                'See additional tours of the different parts of WordPress. Restart your completed tours at any time.',
                'extendify',
            ),
            attachTo: {
                element: '#assist-tours-module',
                offset: {
                    marginTop: window.innerWidth <= 1150 ? 15 : 0,
                    marginLeft: window.innerWidth <= 1150 ? 2 : -15,
                },
                position: {
                    x: window.innerWidth <= 1150 ? 'left' : 'left',
                    y: window.innerWidth <= 1150 ? 'bottom' : 'top',
                },
                hook: window.innerWidth <= 1150 ? 'top left' : 'top right',
            },
            events: {
                beforeAttach: () => waitUntilExists('#assist-tours-module'),
                onAttach: () => {
                    document
                        .querySelector('#assist-tours-module')
                        ?.scrollIntoView()
                },
            },
        },
        {
            title: __('Quick Links', 'extendify'),
            text: __(
                'Easily access some of the most common items in WordPress with these quick links.',
                'extendify',
            ),
            attachTo: {
                element: '#assist-quick-links-module',
                offset: {
                    marginTop: window.innerWidth <= 1150 ? 10 : 0,
                    marginLeft: window.innerWidth <= 1150 ? 10 : -15,
                },
                position: {
                    x: window.innerWidth <= 1150 ? 'right' : 'left',
                    y: 'top',
                },
                hook: window.innerWidth <= 1150 ? 'top left' : 'top right',
            },
            events: {
                beforeAttach: () =>
                    waitUntilExists('#assist-quick-links-module'),
                onAttach: () => {
                    document
                        .querySelector('#assist-quick-links-module')
                        ?.scrollIntoView()
                },
            },
        },
        {
            title: __('Site Assistant', 'extendify'),
            text: __(
                'Come back to the Site Assistant any time by clicking the menu item.',
                'extendify',
            ),
            attachTo: {
                element: '#toplevel_page_extendify-admin-page',
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
                onAttach: () => {
                    if (document.body.classList.contains('folded')) {
                        document.body.classList.remove('folded')
                        document.body.classList.add('temp-open')
                    }
                },
                onDetach: () => {
                    if (document.body.classList.contains('temp-open')) {
                        document.body.classList.remove('temp-open')
                        document.body.classList.add('folded')
                    }
                },
            },
        },
    ],
}
