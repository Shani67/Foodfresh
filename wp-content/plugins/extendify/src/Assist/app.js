import { render } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Assist } from '@assist/Assist'
import { AssistAdminBarHelpCenter } from '@assist/AssistAdminBarHelpCenter'
import { AssistAdminBarHelpCenterSubMenu } from '@assist/AssistAdminBarHelpCenterSubMenu'
import { AssistAdminBarTourThisPage } from '@assist/AssistAdminBarTourThisPage'
import { AssistLandingPage } from '@assist/AssistLandingPage'
import { TaskBadge } from '@assist/components/TaskBadge'
import './app.css'

// Disable Assist while Launch is running
const q = new URLSearchParams(window.location.search)
const launchActive = ['page'].includes(q.get('extendify-launch'))

const assistPage = document.getElementById('extendify-assist-landing-page')

// Assist landing page
if (!launchActive && assistPage) {
    // append skip link to get here
    document
        .querySelector('.screen-reader-shortcut')
        .insertAdjacentHTML(
            'afterend',
            `<a href="#extendify-assist-landing-page" class="screen-reader-shortcut">${__(
                'Skip to Assist',
                'extendify',
            )}</a>`,
        )
    render(<AssistLandingPage />, assistPage)
}

if (!launchActive) {
    const assist = Object.assign(document.createElement('div'), {
        className: 'extendify-assist',
    })
    document.body.append(assist)
    render(<Assist />, assist)
}

if (!launchActive) {
    document
        .querySelector(
            '#toplevel_page_extendify-admin-page.wp-has-current-submenu',
        )
        ?.classList.add('current')
    document
        .querySelectorAll('.extendify-assist-badge-count')
        ?.forEach((el) => render(<TaskBadge />, el))
}

if (!launchActive) {
    const tourThisPage = Object.assign(document.createElement('li'), {
        id: 'wp-admin-bar-extendify-assist-tour-button',
        className: 'extendify-assist',
    })
    document.querySelector('#wp-admin-bar-my-account')?.after(tourThisPage)
    render(<AssistAdminBarTourThisPage />, tourThisPage)

    const helpCenter = Object.assign(document.createElement('li'), {
        id: 'wp-admin-bar-extendify-assist-help-center',
        className: 'extendify-assist menupop',
    })
    document.querySelector('#wp-admin-bar-my-account')?.after(helpCenter)
    render(<AssistAdminBarHelpCenter />, helpCenter)

    const helpCenterSubMenu = Object.assign(document.createElement('div'), {
        id: 'wp-admin-bar-extendify-assist-help-center-sub-menu',
        className: 'ab-sub-wrapper',
        style: 'margin-top: -7px',
    })
    document.querySelector('#assist-help-center')?.after(helpCenterSubMenu)
    render(<AssistAdminBarHelpCenterSubMenu />, helpCenterSubMenu)
}
