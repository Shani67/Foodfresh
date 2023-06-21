import { PageControl } from '@onboarding/components/PageControl'

export const PageLayoutFull = ({ children, includeNav = true }) => {
    return (
        <div className="md:h-screen md:overflow-y-scroll">
            {includeNav ? (
                <div className="pt-12 xl:pt-16 pb-4 sticky top-0 bg-white z-50 w-full px-8 xl:px-12 max-w-screen-xl mx-auto">
                    <PageControl />
                </div>
            ) : null}
            <div className="mt-8 mb-8 xl:mb-12 flex justify-center max-w-screen-xl mx-auto px-8 xl:px-12">
                {children}
            </div>
        </div>
    )
}
