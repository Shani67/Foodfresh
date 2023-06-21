import { Icon } from '@wordpress/components'
import { safeHTML } from '@wordpress/dom'
import { useRef } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { patterns, layouts, support, brandLogo, diamond } from '../icons'
import { SplitModal } from './SplitModal'

export const NoImportModal = () => {
    const initialFocus = useRef(null)
    return (
        <SplitModal
            isOpen={true}
            ref={initialFocus}
            leftContainerBgColor="bg-white">
            <div>
                <div className="mb-5 flex items-center space-x-2 text-extendify-black">
                    {brandLogo}
                </div>

                <h3 className="mt-0 text-xl">
                    {__("You're out of imports", 'extendify')}
                </h3>
                <p
                    className="text-sm text-black"
                    dangerouslySetInnerHTML={{
                        __html: safeHTML(
                            sprintf(
                                // translators: %s: The partners@extendify.com email address.
                                __(
                                    "Interested in unlimited access to our full catalog of standard and Pro patterns and layouts? Premium access is available exclusively for customers of select hosting providers. If you're interested in full access, have your hosting provider reach out to %s.",
                                    'extendify',
                                ),
                                '<a href="mailto:partners@extendify.com">partners@extendify.com</a>',
                            ),
                        ),
                    }}
                />
            </div>
            <div className="flex h-full flex-col justify-center space-y-2 p-10 text-black">
                <div className="flex items-center space-x-3">
                    <Icon icon={patterns} size={24} />
                    <span className="text-sm leading-none">
                        {__("Access to 100's of Patterns", 'extendify')}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <Icon icon={diamond} size={24} />
                    <span className="text-sm leading-none">
                        {__('Access to "Pro" catalog', 'extendify')}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <Icon icon={layouts} size={24} />
                    <span className="text-sm leading-none">
                        {__('Beautiful full page layouts', 'extendify')}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <Icon icon={support} size={24} />
                    <span className="text-sm leading-none">
                        {__('Fast and friendly support', 'extendify')}
                    </span>
                </div>
            </div>
        </SplitModal>
    )
}
