import { __ } from '@wordpress/i18n'

export default {
    id: 'welcome-tour',
    settings: {
        allowOverflow: true,
        startFrom: [
            window.extAssistData.adminUrl + 'index.php',
            window.extAssistData.adminUrl +
                'admin.php?page=extendify-assist#dashboard',
        ],
        minBoxWidth: '360px',
    },
    onStart: () => {
        // if the menu is collapsed, remove the class to expand it
        if (document.body.classList.contains('folded')) {
            document.body.classList.remove('folded')
            document.body.classList.add('temp-open')
        }
    },
    onFinish: () => {
        // only fold the menu if it was folded before
        if (document.body.classList.contains('temp-open')) {
            document.body.classList.remove('temp-open')
            document.body.classList.add('folded')
        }
    },
    steps: [
        {
            title: __('View Site', 'extendify'),
            text: __(
                "At any time, you can view your site (from a visitor's perspective) from the top admin bar under your site's name.",
                'extendify',
            ),
            image: 'https://assets.extendify.com/tours/welcome/view-site.gif',
            attachTo: {
                element: '#wp-admin-bar-view-site',
                offset: {
                    marginTop: 0,
                    marginLeft: 10,
                },
                position: {
                    x: 'right',
                    y: 'top',
                },
                hook: 'top left',
            },
            events: {
                beforeAttach: () => {
                    const menu = document.querySelector(
                        '#wp-admin-bar-site-name .ab-sub-wrapper',
                    )
                    menu.style.position = 'relative'
                    menu.style.display = 'block'
                },
                onAttach: () => {
                    const menu = document.querySelector(
                        '#wp-admin-bar-site-name .ab-sub-wrapper',
                    )
                    menu.style.position = 'relative'
                    menu.style.display = 'block'
                },
                onDetach: () => {
                    const menu = document.querySelector(
                        '#wp-admin-bar-site-name .ab-sub-wrapper',
                    )
                    menu.style.position = 'absolute'
                    menu.style.display = ''
                },
            },
        },
        {
            title: __('Site Assistant', 'extendify'),
            text: __('Access the Site Assistant at any time.', 'extendify'),
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
            events: {},
        },
        {
            title: __('Dashboard', 'extendify'),
            text: __(
                'The default WordPress dashboard will have some overall site metrics and modules added from certain plugins.',
                'extendify',
            ),
            attachTo: {
                element: '#menu-dashboard',
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
            events: {},
        },
        {
            title: __('Posts', 'extendify'),
            text: __('Manage and create blog posts.', 'extendify'),
            attachTo: {
                element: '#menu-posts',
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
            events: {},
        },
        {
            title: __('Media', 'extendify'),
            text: __(
                'Add, edit, or remove images and other media from your library. When you upload an image to be used on your site, it will be added to the library.',
                'extendify',
            ),
            attachTo: {
                element: '#menu-media',
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
            events: {},
        },
        {
            title: __('Pages', 'extendify'),
            text: __(
                'Use the pages menu to add, delete, or edit the pages on your site.',
                'extendify',
            ),
            image: 'https://assets.extendify.com/tours/welcome/add-pages.gif',
            attachTo: {
                element: '#menu-pages',
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
            events: {},
        },
        {
            title: __('Comments', 'extendify'),
            text: __(
                'If you have commenting enabled on your posts, you can manage those comments here.',
                'extendify',
            ),
            attachTo: {
                element: '#menu-comments',
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
            events: {},
        },
        {
            title: __('Appearance', 'extendify'),
            text: __(
                'Manage your theme and access the Site Editor from the Appearance menu. The Site Editor is where you can make global changes to your site (such as the menu, header/footer, and styles).',
                'extendify',
            ),
            attachTo: {
                element: '#menu-appearance',
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
            events: {},
        },
        {
            title: __('Plugins', 'extendify'),
            text: __('Add or manage the plugins on your site.', 'extendify'),
            attachTo: {
                element: '#menu-plugins',
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
            events: {},
        },
        {
            title: __('Users', 'extendify'),
            text: __(
                'Add or manage users on your site, both admin users and others.',
                'extendify',
            ),
            attachTo: {
                element: '#menu-users',
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
            events: {},
        },
        {
            title: __('Tools', 'extendify'),
            text: __(
                'Import/export post data, check site health, and edit theme or plugin files directly in the WordPress admin.',
                'extendify',
            ),
            attachTo: {
                element: '#menu-tools',
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
            events: {},
        },
        {
            title: __('Settings', 'extendify'),
            text: __(
                'Advanced settings for your site and for certain plugins.',
                'extendify',
            ),
            attachTo: {
                element: '#menu-settings',
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
            events: {},
        },
        {
            title: __('Collapse menu', 'extendify'),
            text: __(
                'Use this toggle to collapse or expand the sidebar menu.',
                'extendify',
            ),
            attachTo: {
                element: '#collapse-menu',
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
            events: {},
        },
        {
            title: __('User', 'extendify'),
            text: __(
                'Manage your profile or log out of your account here.',
                'extendify',
            ),
            attachTo: {
                element: '#wp-admin-bar-user-actions',
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
                beforeAttach: () => {
                    const menu = document.querySelector(
                        '#wp-admin-bar-my-account .ab-sub-wrapper',
                    )
                    menu.style.position = 'relative'
                    menu.style.display = 'block'
                },
                onAttach: () => {
                    const menu = document.querySelector(
                        '#wp-admin-bar-my-account .ab-sub-wrapper',
                    )
                    menu.style.position = 'relative'
                    menu.style.display = 'block'
                },
                onDetach: () => {
                    const menu = document.querySelector(
                        '#wp-admin-bar-my-account .ab-sub-wrapper',
                    )
                    menu.style.position = 'absolute'
                    menu.style.display = ''
                },
            },
        },
    ],
}
