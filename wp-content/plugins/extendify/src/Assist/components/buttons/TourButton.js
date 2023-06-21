import { __ } from '@wordpress/i18n'
import { useTourStore } from '@assist/state/Tours'
import tours from '@assist/tours/tours'

export const TourButton = ({ task }) => {
    const { startTour, wasOpened } = useTourStore()

    if (!tours[task.slug]) return null

    const getButtonText = () => {
        const { buttonTextDone, buttonTextToDo } = task
        if (wasOpened(task.slug)) {
            return buttonTextDone ?? __('Restart Tour', 'extendify')
        }
        return buttonTextToDo ?? __('Start Tour', 'extendify')
    }

    return (
        <button
            className="px-3 py-2 leading-tight min-w-20 sm:min-w-30 button-focus bg-gray-100 hover:bg-gray-200 focus:shadow-button text-gray-900 rounded-sm relative z-10 cursor-pointer text-center no-underline text-sm"
            type="button"
            onClick={() => startTour(tours[task.slug])}>
            {getButtonText()}
        </button>
    )
}
