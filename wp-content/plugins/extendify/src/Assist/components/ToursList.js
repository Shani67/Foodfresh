import { Spinner } from '@wordpress/components'
import { __, sprintf } from '@wordpress/i18n'
import { TourItem } from '@assist/components/task-items/TourItem'
import { useTours } from '@assist/hooks/useTours'
import { useTourStore } from '@assist/state/Tours'
import tours from '@assist/tours/tours'

export const ToursList = () => {
    const { tours: tourData, loading, error } = useTours()
    const { wasOpened } = useTourStore()

    // Now filter all tasks that are marked as completed
    const completed = tourData?.filter((tour) => wasOpened(tour.slug))

    // Filter out tours that are not enabled.
    const activeTours = tourData?.filter(
        (tour) => tours[tour.slug]?.settings?.enabled ?? true,
    )

    if (loading || error) {
        return (
            <div className="my-4 w-full flex justify-center bg-white border border-gray-300 p-4 lg:p-8 rounded">
                <Spinner />
            </div>
        )
    }

    if (activeTours?.length === 0) {
        return (
            <div
                className="my-4 w-full bg-white border border-gray-300 p-4 lg:p-8 rounded"
                data-test="no-tours-found">
                {__('No tours found...', 'extendify')}
            </div>
        )
    }

    return (
        <div className="my-4 w-full bg-white border border-gray-300 p-4 lg:p-8 rounded">
            <div className="mb-6 flex gap-0 flex-col">
                <h2 className="my-0 text-lg">
                    {__('Get going with these WordPress tours', 'extendify')}
                </h2>
                <div className="flex gap-1">
                    <span>
                        {sprintf(
                            // translators: %s is the number of tasks
                            __('%s completed', 'extendify'),
                            completed.length,
                        )}
                    </span>
                </div>
            </div>
            <div
                className="all-tours w-full border border-b-0 border-gray-300 relative"
                data-test="all-tours">
                {activeTours.map((tour) => (
                    <TourItemWrapper key={tour.slug} tour={tour} />
                ))}
                <div className="bg-black bg-opacity-75 rounded w-full h-full p-6 absolute inset-0 flex lg:hidden items-center justify-center z-10">
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

const TourItemWrapper = ({ tour }) => (
    <div className="tour-item-wrapper p-3 flex gap-3 justify-between border-0 border-b border-gray-300 bg-white relative items-center">
        <TourItem tour={tour} />
    </div>
)
