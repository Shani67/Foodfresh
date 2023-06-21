import { __ } from '@wordpress/i18n'
import { addQueryArgs } from '@wordpress/url'

const assistUrl = addQueryArgs(`${window.extAssistData.adminUrl}admin.php`, {
    page: 'extendify-assist',
})

export const AssistAdminBarHelpCenterSubMenu = () => {
    return (
        <ul className="ab-submenu">
            <li>
                <a href={`${assistUrl}#knowledge-base`} className="ab-item">
                    {__('Knowledge Base', 'extendify')}
                </a>
            </li>
            <li>
                <a href={`${assistUrl}#tours`} className="ab-item">
                    {__('Tours', 'extendify')}
                </a>
            </li>
        </ul>
    )
}
