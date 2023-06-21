import { __ } from '@wordpress/i18n'
import { cancelCircleFilled, Icon } from '@wordpress/icons'
import { useRecommendationsBanner } from '@assist/hooks/useRecommendationsBanner'
import { useGlobalStore } from '@assist/state/Global'

export const RecommendationsBanner = () => {
    const { isDismissedBanner, dismissBanner } = useGlobalStore()
    const { recommendationsBanner, loading, error } = useRecommendationsBanner()

    if (error || loading) {
        return null
    }

    // Don't show the banner if the Welcome banner is active.
    const welcomeDismissed = window.extAssistData.dismissedNotices.find(
        (notice) => notice.id === 'welcome-message',
    )

    if (!welcomeDismissed) return null

    const banner = recommendationsBanner
        ?.filter(
            ({ slug, siteAssistant }) =>
                siteAssistant && !isDismissedBanner(slug),
        )
        ?.at(0)

    if (!banner?.link) return null

    return (
        <div className="w-full relative mt-4 mb-2">
            <a
                key={banner.slug}
                className=""
                href={banner.link}
                target="_blank"
                rel="noreferrer">
                <img src={banner.mobileImageURL} className="w-full sm:hidden" />
                <img
                    src={banner.desktopImageURL}
                    className="w-full hidden sm:block"
                />
            </a>
            <button
                aria-label={__('Dismiss Banner', 'extendify-sdk')}
                type="button"
                className="absolute top-0 right-0 m-3.5 p-0 bg-transparent cursor-pointer transition-opacity duration-200 opacity-60 hover:opacity-90"
                onClick={() => dismissBanner(banner.slug)}>
                <Icon
                    icon={cancelCircleFilled}
                    className="text-white fill-current w-6 h-6"
                />
            </button>
        </div>
    )
}
