import { __ } from '@wordpress/i18n'
import { useTourStore } from '@assist/state/Tours'
import { ToursIcon } from '@assist/svg'
import tours from '@assist/tours/tours.js'

export const AssistAdminBarTourThisPage = () => {
    const { startTour, wasOpened } = useTourStore()

    const tourablePage = Object.values(tours).filter((tour) =>
        tour?.settings?.startFrom.includes(window.location.href),
    )
    if (!tourablePage.length) return null

    // Use the WP admin accent color as the bg
    const menu = document?.querySelector(
        'a.wp-has-current-submenu, li.current > a.current',
    )
    const adminBar = document?.querySelector('#wpadminbar')
    const adminColor = wasOpened(tourablePage[0].id)
        ? window.getComputedStyle(adminBar)?.['background-color']
        : window.getComputedStyle(menu)?.['background-color']

    return (
        <button
            onClick={() => startTour(tourablePage[0])}
            className="ab-item ltr:pl-1 ltr:pr-2 rtl:pl-2 rtl:pr-1 inline-flex justify-center items-center gap-2 rounded-full h-6 mt-1 pl-2.5 pr-3 cursor-pointer"
            style={{ backgroundColor: adminColor, color: '#fff' }}>
            <ToursIcon className="w-6 h-6 fill-current" />
            <span>{__('Tour this page', 'extendify')}</span>
        </button>
    )
}
