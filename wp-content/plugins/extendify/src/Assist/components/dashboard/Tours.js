import { Spinner } from '@wordpress/components'
import { __, sprintf } from '@wordpress/i18n'
import { chevronRightSmall, Icon } from '@wordpress/icons'
import { useTours } from '@assist/hooks/useTours'
import { useTourStore } from '@assist/state/Tours'
import { ToursPlay } from '@assist/svg'
import { ToursRestart } from '@assist/svg'
import availableTours from '@assist/tours/tours.js'

export const Tours = () => {
    const { tours, loading, error } = useTours()
    const { startTour, wasOpened } = useTourStore()

    const getIcon = (slug) => {
        if (wasOpened(slug)) {
            return <ToursRestart className="w-5 h-5 group-hover:fill-current" />
        }
        return <ToursPlay className="w-5 h-5 group-hover:fill-current" />
    }

    if (loading || error) {
        return (
            <div className="assist-tours-module w-full flex justify-center bg-white border-l border-r border-b border-gray-300 p-4 lg:p-8">
                <Spinner />
            </div>
        )
    }

    if (tours.length === 0) {
        return (
            <div className="assist-tours-module w-full border-l border-r border-b border-gray-300 p-4 lg:p-8">
                {__('No tours found...', 'extendify')}
            </div>
        )
    }

    return (
        <div
            id="assist-tours-module"
            className="w-full border-l border-r border-b border-gray-300 bg-white p-4 lg:p-8 text-base">
            <div className="flex justify-between items-center gap-2">
                <h3 className="text-lg leading-tight m-0">
                    {__('Tours', 'extendify')}
                </h3>
                {tours.length > 5 && (
                    <a
                        href="admin.php?page=extendify-assist#tours"
                        className="inline-flex items-center no-underline text-sm text-design-main hover:underline">
                        {sprintf(__('View all %s', 'extendify'), tours?.length)}
                        <Icon
                            icon={chevronRightSmall}
                            className="fill-current"
                        />
                    </a>
                )}
            </div>
            <div className="w-full text-base flex flex-col gap-3 mt-4 relative">
                {tours.slice(0, 5).map(({ title, slug }) => (
                    <button
                        key={slug}
                        className="p-4 button-focus bg-gray-100 hover:bg-gray-200 hover:text-design-main focus:shadow-button cursor-pointer no-underline flex justify-between gap-2 group text-sm"
                        type="button"
                        onClick={() => startTour(availableTours[slug])}>
                        <span className="text-gray-900">{title}</span>
                        {getIcon(slug)}
                    </button>
                ))}
                <div className="bg-black bg-opacity-75 rounded w-full h-full p-6 absolute inset-0 flex lg:hidden items-center justify-center">
                    <h3 className="text-lg m-0 text-white text-center">
                        {__(
                            'Guided tours are optimized for large screens, ensuring the best possible experience.',
                            'extendify',
                        )}
                    </h3>
                </div>
            </div>
        </div>
    )
}
