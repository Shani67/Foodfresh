import { external, Icon } from '@wordpress/icons'

export const Support = () => {
    if (
        !window.extChatData?.supportUrl ||
        !window.extChatData?.supportMessage
    ) {
        return <div className="bg-design-main h-32" />
    }

    return (
        <div className="px-6 py-8">
            <a
                href={window.extChatData.supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-800 no-underline border border-gray-300 border-solid rounded py-3 px-4 flex items-center gap-4">
                <span>{window.extChatData.supportMessage}</span>
                <Icon icon={external} className="w-8" />
            </a>
        </div>
    )
}
