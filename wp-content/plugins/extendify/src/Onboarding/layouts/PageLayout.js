import { CompletedTasks } from '@onboarding/components/CompletedTasks'
import { PageControl } from '@onboarding/components/PageControl'
import { Logo } from '@onboarding/svg'

export const PageLayout = ({ children, includeNav = true }) => {
    return (
        <div className="flex flex-col md:flex-row">
            <div className="bg-partner-primary-bg text-partner-primary-text py-12 xl:py-16 px-8 xl:px-12 md:h-screen flex flex-col justify-between md:w-40vw md:max-w-md flex-shrink-0">
                <div className="max-w-prose md:max-w-sm pr-8">
                    <div className="md:min-h-48">
                        {window.extOnbData?.partnerLogo ? (
                            <div className="mb-8">
                                <img
                                    style={{ maxWidth: '200px' }}
                                    src={window.extOnbData.partnerLogo}
                                    alt={window.extOnbData?.partnerName ?? ''}
                                />
                            </div>
                        ) : (
                            <Logo className="logo text-design-text w-32 sm:w-40 mb-8" />
                        )}
                        {children[0]}
                    </div>
                    <CompletedTasks disabled={!includeNav} />
                </div>
            </div>
            <div className="flex-grow md:h-screen md:overflow-y-scroll">
                {includeNav ? (
                    <div className="pt-12 xl:pt-16 pb-4 sticky top-0 bg-white z-50 w-full px-8 xl:px-12 max-w-onboarding-content mx-auto">
                        <PageControl />
                    </div>
                ) : null}
                <div className="mt-8 mb-8 xl:mb-12 flex justify-center max-w-onboarding-content mx-auto px-8 xl:px-12">
                    {children[1]}
                </div>
            </div>
        </div>
    )
}
