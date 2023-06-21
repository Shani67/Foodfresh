import { Button } from '@wordpress/components'
import { render, useEffect, useRef } from '@wordpress/element'
import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Icon, close } from '@wordpress/icons'
import { Dialog } from '@headlessui/react'
import { SiteSettings } from '@library/api/SiteSettings'

const extendify = Object.assign(document.createElement('div'), {
    id: 'extendify-deactivation-prompt',
})
document.body.append(extendify)
render(<DeactivationPrompt />, extendify)

export default function DeactivationPrompt() {
    const [isOpen, setIsOpen] = useState(false)
    const shouldDeactivate = useRef(false)
    const initialFocusRef = useRef(null)
    const selector = '#deactivate-extendify'

    const closeAndDeactivate = () => {
        shouldDeactivate.current = true
        setIsOpen(false)
        document.querySelector(selector).click()
    }

    useEffect(() => {
        const element = document.querySelector(selector)
        if (!element) return
        const handle = (event) => {
            if (shouldDeactivate.current) return
            event.preventDefault()
            setIsOpen(true)
        }
        element.addEventListener('click', handle)
        return () => {
            element.removeEventListener('click', handle)
        }
    }, [setIsOpen])

    return (
        <Dialog
            as="div"
            className="extendify extendify-deactivation-prompt-modal"
            open={isOpen}
            initialFocus={initialFocusRef}
            onClose={() => setIsOpen(false)}>
            <div className="fixed top-0 mx-auto w-full h-full overflow-hidden p-2 md:p-6 md:flex justify-center items-center z-high">
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
                    aria-hidden="true"
                />
                <div className="sm:flex relative shadow-2xl sm:overflow-hidden mx-auto bg-white flex flex-col sm:min-w-md rounded-sm">
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="m-0 px-6 text-base text-gray-900">
                            {__('Keep styles?', 'extendify')}
                        </Dialog.Title>
                        <Button
                            className="border-0 cursor-pointer m-4"
                            onClick={() => setIsOpen(false)}
                            icon={<Icon icon={close} size={24} />}
                            label={__('Close Modal', 'extendify')}
                            showTooltip={false}
                        />
                    </div>
                    <div className="m-0 p-6 pt-0 text-left relative max-w-lg">
                        <p className="mt-0">
                            {__(
                                'We detected that you have added some designs from the Site Launcher or Design Library. Click "yes" below to add the styles to your theme (as Additional CSS) so they continue to display properly on your site.',
                                'extendify',
                            )}
                        </p>

                        <div className="flex justify-end gap-4">
                            <Button
                                ref={initialFocusRef}
                                className="components-button bg-design-main text-design-text is-primary"
                                onClick={() => {
                                    SiteSettings.addUtilsToGlobalStyles().finally(
                                        closeAndDeactivate,
                                    )
                                }}
                                showTooltip={false}>
                                {__('Yes, add styles', 'extendify')}
                            </Button>
                            <Button
                                className="components-button bg-design-main text-design-text is-primary"
                                onClick={closeAndDeactivate}
                                showTooltip={false}>
                                {__('Deactivate only', 'extendify')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
