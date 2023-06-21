import { useEffect, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classNames from 'classnames'
import { useGlobalStore } from '@onboarding/state/Global'
import { usePagesStore } from '@onboarding/state/Pages'
import { useUserSelectionStore } from '@onboarding/state/UserSelections'
import { LeftArrowIcon, RightArrowIcon } from '@onboarding/svg'

export const PageControl = () => {
    const {
        previousPage,
        currentPageIndex,
        pages,
        setPage,
        replaceHistory,
        pushHistory,
    } = usePagesStore()
    const onFirstPage = currentPageIndex === 0
    const pagesList = Array.from(pages.keys())
    const currentPageKey = pagesList[currentPageIndex]

    useEffect(() => {
        const replaceStateHistory = () => {
            history.state === null && replaceHistory(currentPageIndex)
        }

        window.addEventListener('load', replaceStateHistory)

        const popstate = () => {
            const page = currentPageIndex - 1

            if (page === -1) history.go(-1)

            setPage(page)
            pushHistory(page)
        }

        window.addEventListener('popstate', popstate)

        return () => {
            window.removeEventListener('load', replaceStateHistory)
            window.removeEventListener('popstate', popstate)
        }
    }, [setPage, replaceHistory, pushHistory, currentPageIndex])

    return (
        <div className="flex items-center space-x-2">
            <div
                className={classNames('flex flex-1', {
                    'justify-end': currentPageKey === 'welcome',
                    'justify-between': currentPageKey !== 'welcome',
                })}>
                {onFirstPage || (
                    <button
                        className="flex items-center px-4 py-3 font-medium button-focus text-gray-900 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 bg-transparent"
                        type="button"
                        onClick={previousPage}
                        data-test="back-button">
                        <RightArrowIcon className="h-5 w-5" />
                        {__('Back', 'extendify')}
                    </button>
                )}
                {onFirstPage && (
                    <a
                        className="flex items-center px-4 py-3 font-medium button-focus text-gray-900 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 bg-transparent"
                        href={`${window.extOnbData.adminUrl}admin.php?page=extendify-assist`}>
                        <RightArrowIcon className="h-5 w-5" />
                        {__('Exit Launch', 'extendify')}
                    </a>
                )}
                <NextButton />
            </div>
        </div>
    )
}

const NextButton = () => {
    const { nextPage, currentPageIndex, pages } = usePagesStore()
    const totalPages = usePagesStore((state) => state.count())
    const canLaunch = useUserSelectionStore((state) => state.canLaunch())
    const onLastPage = currentPageIndex === totalPages - 1
    const currentPageKey = Array.from(pages.keys())[currentPageIndex]
    const pageState = pages.get(currentPageKey).state
    const [canProgress, setCanProgress] = useState(false)

    useEffect(() => {
        setCanProgress(pageState?.getState()?.ready)
        return pageState.subscribe(({ ready }) => setCanProgress(ready))
    }, [pageState, currentPageIndex])

    if (canLaunch && onLastPage) {
        return (
            <button
                className="flex items-center px-4 py-3 font-bold bg-partner-primary-bg text-partner-primary-text button-focus"
                onClick={() => {
                    useGlobalStore.setState({ generating: true })
                }}
                type="button"
                data-test="next-button">
                {__('Launch site', 'extendify')}
            </button>
        )
    }

    return (
        <button
            className={classNames(
                'flex items-center px-4 py-3 font-bold bg-partner-primary-bg text-partner-primary-text button-focus',
                {
                    'opacity-50 cursor-not-allowed': !canProgress,
                },
            )}
            onClick={nextPage}
            disabled={!canProgress}
            type="button"
            data-test="next-button">
            {__('Next', 'extendify')}
            <LeftArrowIcon className="h-5 w-5" />
        </button>
    )
}
