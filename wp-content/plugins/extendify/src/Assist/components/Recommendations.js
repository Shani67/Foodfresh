import { Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useRecommendations } from '@assist/hooks/useRecommendations'
import { useRecommendationsStore } from '@assist/state/Recommendations'
import { useSelectionStore } from '@assist/state/Selections'
import { useTasksStore } from '@assist/state/Tasks'

export const Recommendations = () => {
    const { recommendations, loading, error } = useRecommendations()
    const { goals } = useSelectionStore()
    const { completedTasks } = useTasksStore()
    const { track } = useRecommendationsStore()

    // Get recommendations that match the selected goals
    const goalRecs =
        recommendations?.filter((rec) =>
            goals?.some((goal) => rec?.goalDepSlugs?.includes(goal?.slug)),
        ) ?? []

    // Get recommendations that match the selected tasks
    const taskRecs =
        recommendations?.filter((rec) =>
            completedTasks?.some((task) =>
                rec?.taskDepSlugs?.includes(task?.id),
            ),
        ) ?? []

    // Get recommendations that have no dependencies
    const recsNoDeps =
        recommendations?.filter(
            ({ goalDepSlugs, taskDepSlugs }) =>
                goalDepSlugs === null && taskDepSlugs === null,
        ) ?? []

    // Combine the filtered recommendations with the goal and task recommendations
    const recsFiltered = [...recsNoDeps, ...goalRecs, ...taskRecs]

    if (loading || error) {
        return (
            <div className="my-4 w-full flex justify-center bg-white border border-gray-300 p-4 lg:p-8 rounded">
                <Spinner />
            </div>
        )
    }

    if (recsFiltered.length === 0) {
        return (
            <div className="my-4 w-full mx-auto bg-white border border-gray-300 p-4 lg:p-8 rounded">
                {__(
                    "All set! We don't have any recommendations right now for your site.",
                    'extendify',
                )}
            </div>
        )
    }

    return (
        <div className="my-4 w-full mx-auto text-base">
            {recsFiltered.map(
                ({
                    slug,
                    title,
                    description,
                    linkType,
                    externalLink,
                    internalLink,
                    buttonText,
                }) => (
                    <div
                        key={slug}
                        className="mb-4 w-full bg-white border border-gray-300 p-4 lg:p-8 flex flex-col rounded">
                        <h3 className="m-0 mb-2 text-md font-bold">{title}</h3>
                        <p className="m-0 text-sm">{description}</p>
                        <a
                            className="px-3 py-2 mt-4 w-max leading-tight min-w-30 button-focus bg-gray-100 hover:bg-gray-200 focus:shadow-button text-gray-900 rounded relative z-10 cursor-pointer text-center no-underline text-sm"
                            href={
                                linkType === 'externalLink'
                                    ? `${externalLink}`
                                    : `${window.extAssistData.adminUrl}${internalLink}`
                            }
                            onClick={() => track(slug)}
                            target={linkType === 'externalLink' ? '_blank' : ''}
                            rel={
                                linkType === 'externalLink'
                                    ? 'noreferrer'
                                    : undefined
                            }>
                            <span>{buttonText}</span>
                        </a>
                    </div>
                ),
            )}
        </div>
    )
}
