import { Spinner } from '@wordpress/components'
import { sprintf, __ } from '@wordpress/i18n'
import { Icon, chevronRightSmall } from '@wordpress/icons'
import { useRecommendations } from '@assist/hooks/useRecommendations'
import { useRecommendationsStore } from '@assist/state/Recommendations'

export const Recommendations = () => {
    const { recommendations, loading, error } = useRecommendations()
    const { track } = useRecommendationsStore()

    if (loading || error) {
        return (
            <div className="assist-recommendations-module w-full flex justify-center bg-white border border-gray-300 p-2 lg:p-4 rounded">
                <Spinner />
            </div>
        )
    }

    if (recommendations?.length === 0) {
        return (
            <div className="assist-recommendations-module w-full border border-gray-300 p-2 lg:p-4 bg-white rounded">
                {__(
                    "All set! We don't have any recommendations right now for your site.",
                    'extendify',
                )}
            </div>
        )
    }

    return (
        <div
            id="assist-recommendations-module"
            className="w-full border border-gray-300 text-base bg-white p-4 md:p-8 rounded">
            <div className="flex justify-between items-center gap-2">
                <h2 className="text-lg leading-tight m-0">
                    {__('Recommendations', 'extendify')}
                </h2>
                {recommendations?.length > 2 && (
                    <a
                        href="admin.php?page=extendify-assist#recommendations"
                        className="inline-flex items-center no-underline text-sm text-design-main hover:underline">
                        {sprintf(
                            __('View all (%s)', 'extendify'),
                            recommendations?.length,
                        )}
                        <Icon
                            icon={chevronRightSmall}
                            className="fill-current"
                        />
                    </a>
                )}
            </div>
            <div className="w-full mt-4 text-base flex flex-col gap-4">
                {recommendations
                    .slice(0, 5)
                    .map(
                        ({
                            slug,
                            title,
                            description,
                            linkType,
                            externalLink,
                            internalLink,
                        }) => (
                            <a
                                key={slug}
                                className="block p-4 bg-gray-100 hover:bg-gray-200 text-gray-900 no-underline"
                                href={
                                    linkType === 'externalLink'
                                        ? `${externalLink}`
                                        : `${window.extAssistData.adminUrl}${internalLink}`
                                }
                                onClick={() => track(slug)}
                                target={
                                    linkType === 'externalLink' ? '_blank' : ''
                                }
                                rel={
                                    linkType === 'externalLink'
                                        ? 'noreferrer'
                                        : undefined
                                }>
                                <h3 className="text-base font-medium m-0 mb-1.5">
                                    {title}
                                </h3>
                                <span className="text-sm">{description}</span>
                            </a>
                        ),
                    )}
            </div>
        </div>
    )
}
