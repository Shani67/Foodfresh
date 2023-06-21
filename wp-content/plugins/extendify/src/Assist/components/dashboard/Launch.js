import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classNames from 'classnames'

const launchSteps = {
    'site-type': {
        step: __('Site Industry', 'extendify'),
        title: __("Let's Start Building Your Website", 'extendify'),
        description: __(
            'Create a super-fast, beautiful, and fully customized site in minutes with our Site Launcher.',
            'extendify',
        ),
        buttonText: __('Select Site Industry', 'extendify'),
    },
    'site-title': {
        step: __('Site Title', 'extendify'),
        title: __('Continue Building Your Website', 'extendify'),
        description: __(
            'Create a super-fast, beautiful, and fully customized site in minutes with our Site Launcher.',
            'extendify',
        ),
        buttonText: __('Set Site Title', 'extendify'),
    },
    goals: {
        step: __('Goals', 'extendify'),
        title: __('Continue Building Your Website', 'extendify'),
        description: __(
            'Create a super-fast, beautiful, and fully customized site in minutes with our Site Launcher.',
            'extendify',
        ),
        buttonText: __('Select Site Goals', 'extendify'),
    },
    layout: {
        step: __('Design', 'extendify'),
        title: __('Continue Building Your Website', 'extendify'),
        description: __(
            'Create a super-fast, beautiful, and fully customized site in minutes with our Site Launcher.',
            'extendify',
        ),
        buttonText: __('Select Site Design', 'extendify'),
    },
    pages: {
        step: __('Pages', 'extendify'),
        title: __('Continue Building Your Website', 'extendify'),
        description: __(
            'Create a super-fast, beautiful, and fully customized site in minutes with our Site Launcher.',
            'extendify',
        ),
        buttonText: __('Select Site Pages', 'extendify'),
    },
    confirmation: {
        step: __('Launch', 'extendify'),
        title: __("Let's Launch Your Site", 'extendify'),
        description: __(
            "You're one step away from creating a super-fast, beautiful, and fully customized site in minutes with our Site Launcher.",
            'extendify',
        ),
        buttonText: __('Launch The Site', 'extendify'),
    },
}

export const Launch = () => {
    const getCurrentLaunchStep = () => {
        const pageData = JSON.parse(
            localStorage.getItem('extendify-pages') ?? null,
        )
        const currentPageSlug = pageData?.state?.currentPageSlug

        // If their last step doesn't exist in our options, just use step 1
        if (!Object.keys(launchSteps).includes(currentPageSlug)) {
            return 'site-type'
        }

        return currentPageSlug
    }

    const currentStep = getCurrentLaunchStep()

    let reached = false

    return (
        <div className="w-full border border-gray-300 text-base bg-white relative mb-6 pt-8 rounded overflow-hidden">
            <img
                className="max-w-lg w-full block mx-auto"
                src={window.extAssistData.asset_path + '/extendify-preview.png'}
            />
            <div className="px-3 mx-6 text-center">
                <h2 className="text-2xl mb-4 mt-8">
                    {launchSteps[currentStep]?.title}
                </h2>
                <p className="my-4 text-base">
                    {launchSteps[currentStep]?.description}
                </p>
                <a
                    href={`${window.extAssistData.adminUrl}admin.php?page=extendify-launch`}
                    className="inline-block rounded my-4 px-4 py-2 bg-design-main text-white border-none no-underline cursor-pointer">
                    {launchSteps[currentStep]?.buttonText}
                </a>
            </div>
            <div className="justify-between items-center mt-4 py-6 px-20 flex bg-gray-50">
                {Object.keys(launchSteps).map((slug, index) => {
                    if (slug === currentStep) reached = true
                    return (
                        <Fragment key={slug}>
                            <StepCircle
                                reached={reached}
                                stepName={launchSteps[slug].step}
                                current={slug === currentStep}
                            />
                            {index !== Object.keys(launchSteps).length - 1 && (
                                <div
                                    className={classNames(
                                        'hidden lg:block border-0 border-b-2 border-solid h-0 grow w-full',
                                        {
                                            'border-design-main': !reached,
                                            'border-gray-300': reached,
                                        },
                                    )}
                                />
                            )}
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}

const StepCircle = ({ reached, current, stepName, bgColor }) => (
    <div className="flex-none text-sm flex items-center gap-x-2">
        <span
            style={{ background: reached ? undefined : bgColor }}
            className={classNames(
                'w-6 h-6 rounded-full flex items-center justify-center text-white',
                {
                    'disc-checked bg-design-main border-opacity-10': !reached,
                    'disc-number bg-gray-300': reached && !current,
                    'border-dashed border-2 border-design-main': current,
                },
            )}>
            {!reached && <span className="dashicons dashicons-saved" />}
        </span>
        <span className="sr-only">{stepName}</span>
    </div>
)
