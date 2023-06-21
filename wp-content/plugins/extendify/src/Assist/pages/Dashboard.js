import { __ } from '@wordpress/i18n'
import { Launch } from '@assist/components/dashboard/Launch'
import { QuickLinks } from '@assist/components/dashboard/QuickLinks'
import { Recommendations } from '@assist/components/dashboard/Recommendations'
import { RecommendationsBanner } from '@assist/components/dashboard/RecommendationsBanner'
import { SupportArticles } from '@assist/components/dashboard/SupportArticles'
import { TasksList } from '@assist/components/dashboard/TasksList'
import { Tours } from '@assist/components/dashboard/Tours'
import { WelcomeNotice } from '@assist/notices/WelcomeNotice'
import { Full } from './layouts/Full'

export const Dashboard = () => {
    const { disableRecommendations } = window.extAssistData
    return (
        <Full>
            <RecommendationsBanner />
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start my-4">
                <div className="col-span-12 xl:col-span-7">
                    <WelcomeNotice />
                    <LaunchOrTasks />
                    {disableRecommendations ? null : <Recommendations />}
                </div>
                <div className="col-span-12 xl:col-span-5">
                    <h2 className="text-base leading-tight m-0 bg-gray-800 text-white px-8 py-4 rounded-t-lg">
                        {__('Help Center', 'extendify')}
                    </h2>
                    <SupportArticles />
                    <Tours />
                    <QuickLinks />
                </div>
            </div>
        </Full>
    )
}

const LaunchOrTasks = () => {
    const { themeSlug, launchCompleted } = window.extAssistData
    if (themeSlug === 'extendable' && !launchCompleted) {
        return <Launch />
    }
    if (themeSlug === 'extendable') {
        return <TasksList />
    }
    return null
}
