import { __ } from '@wordpress/i18n'
import { addQueryArgs } from '@wordpress/url'
import { HelpIcon } from '@assist/svg'

const assistUrl = addQueryArgs(`${window.extAssistData.adminUrl}admin.php`, {
    page: 'extendify-admin-page',
})

export const AssistAdminBarHelpCenter = () => {
    return (
        <a
            href={assistUrl}
            id="assist-help-center"
            className="ab-item ltr:pl-1 ltr:pr-2 rtl:pl-2 rtl:pr-1 inline-flex justify-center items-center gap-2">
            <HelpIcon className="w-6 h-6 fill-current leading-loose" />
            <span>{__('Help Center', 'extendify')}</span>
        </a>
    )
}
