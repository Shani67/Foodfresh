import { Icon } from '@wordpress/icons'
import { chevron, robot } from '@chat/svg'

export const Header = ({ question, reset }) => {
    return (
        <header className="flex items-center gap-4">
            {question && (
                <button
                    type="button"
                    onClick={reset}
                    className="bg-transparent border-none p-0 cursor-pointer">
                    <Icon
                        icon={chevron}
                        className="text-design-text fill-current h-4 transform rotate-90"
                    />
                </button>
            )}
            {!question && window.extAssistData?.partnerLogo && (
                <img
                    className="h-8 w-auto"
                    src={window.extAssistData.partnerLogo}
                    alt={window.extAssistData?.partnerName || ''}
                />
            )}
            <div className="ml-auto rounded-full bg-white p-2 flex items-center">
                <Icon
                    icon={robot}
                    className="text-design-main fill-current w-4 h-4"
                />
            </div>
        </header>
    )
}
