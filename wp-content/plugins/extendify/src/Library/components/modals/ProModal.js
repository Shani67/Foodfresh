import { safeHTML } from '@wordpress/dom'
import { useRef } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { brandLogo } from '@library/components/icons'
import { SplitModal } from './SplitModal'

export const ProModal = () => {
    const initialFocus = useRef(null)
    return (
        <SplitModal isOpen={true} invertedButtonColor={true} ref={initialFocus}>
            <div>
                <div className="mb-5 flex items-center space-x-2 text-extendify-black">
                    {brandLogo}
                </div>
                <h3 className="mt-0 text-xl">
                    {__('Pro Patterns and Layouts', 'extendify')}
                </h3>
                <p
                    className="text-sm text-black"
                    dangerouslySetInnerHTML={{
                        __html: safeHTML(
                            sprintf(
                                // translators: %s: The partners@extendify.com email address.
                                __(
                                    "Access to our Pro catalog is available exclusively for customers of select hosting providers. If you're interested in full access, have your hosting provider reach out to %s.",
                                    'extendify',
                                ),
                                '<a href="mailto:partners@extendify.com">partners@extendify.com</a>',
                            ),
                        ),
                    }}
                />
            </div>
            <div className="justify-endrounded-tr-sm flex w-full rounded-br-sm bg-black">
                <img
                    alt={__('Upgrade Now', 'extendify')}
                    className="max-w-full rounded-tr-sm rounded-br-sm"
                    src={
                        window.extendifyData.asset_path +
                        '/modal-extendify-black.png'
                    }
                />
            </div>
        </SplitModal>
    )
}
