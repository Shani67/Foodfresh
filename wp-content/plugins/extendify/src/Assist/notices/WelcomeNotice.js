import { useState, useEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useGlobalStore } from '@assist/state/Global'
import { useTourStore } from '@assist/state/Tours'
import { ToursPlay } from '@assist/svg'
import siteAssistantTour from '@assist/tours/site-assistant.js'

const noticeKey = 'welcome-message'
export const WelcomeNotice = () => {
    const { isDismissed, dismissNotice } = useGlobalStore()
    // To avoid content flash, we load in this partial piece of state early via php
    const dismissed = window.extAssistData.dismissedNotices.find(
        (notice) => notice.id === noticeKey,
    )
    const [enabled, setEnabled] = useState(false)
    const { startTour } = useTourStore()
    const { launchCompleted } = window.extAssistData

    useEffect(() => {
        if (dismissed || isDismissed(noticeKey)) {
            return
        }
        setEnabled(true)
    }, [dismissed, isDismissed, dismissNotice])

    useEffect(() => {
        if (!enabled || !launchCompleted) return
        // For this notice, we only want to show it once
        dismissNotice(noticeKey)
    }, [dismissNotice, enabled, launchCompleted])

    if (!enabled) return null
    if (!launchCompleted) return null

    return (
        <div
            id="assist-welcome-notice"
            className="bg-design-main text-design-text w-full text-base p-6 md:p-8 rounded mb-6 relative">
            <div className="absolute right-0 top-0">
                <button
                    className="bg-white bg-opacity-70 hover:bg-opacity-80 rounded-bl px-0.5 h-6 w-6 cursor-pointer flex items-center"
                    type="button"
                    onClick={() => setEnabled(false)}>
                    <span className="dashicons dashicons-no-alt" />
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:max-w-lg col-span-8">
                    <h3 className="text-2xl mt-0 mb-3 text-white">
                        {__('Your site is ready!', 'extendify')}
                    </h3>
                    <p className="text-sm my-0">
                        {__(
                            'The Site Assistant is your go-to dashboard to help you get the most out of your site.',
                            'extendify',
                        )}
                    </p>
                </div>
                <div className="xl:max-w-lg col-span-4 flex sm:items-start lg:items-center lg:justify-evenly h-full">
                    <button
                        className="h-12 bg-white border-none cursor-pointer gap-3 grid grid-flow-col items-center no-underline px-5 py-3 rounded-sm text-design-main text-base hover:bg-gray-200 focus:shadow-button"
                        onClick={() => startTour(siteAssistantTour)}>
                        {__('Take a tour', 'extendify')}

                        <ToursPlay className="w-5 h-5 group-hover:fill-current fill-current" />
                    </button>
                </div>
            </div>
        </div>
    )
}
