import { useEffect, useRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classNames from 'classnames'
import { getGoals } from '@onboarding/api/DataApi'
import { CheckboxInputCard } from '@onboarding/components/CheckboxInputCard'
import { useFetch } from '@onboarding/hooks/useFetch'
import { PageLayout } from '@onboarding/layouts/PageLayout'
import { usePagesStore } from '@onboarding/state/Pages'
import { useUserSelectionStore } from '@onboarding/state/UserSelections'
import { pageState } from '@onboarding/state/factory'
import {
    BarChart,
    Design,
    Donate,
    Monetization,
    OpenEnvelope,
    Pencil,
    Planner,
    PriceTag,
    School,
    Shop,
    Speech,
    Ticket,
} from '@onboarding/svg'

export const fetcher = () => getGoals()
export const fetchData = () => ({ key: 'goals' })
export const state = pageState('Goals', () => ({
    title: __('Goals', 'extendify'),
    default: undefined,
    showInSidebar: true,
    ready: false,
    // If no goals are selected
    isDefault: () => useUserSelectionStore.getState().goals?.length === 0,
}))
export const Goals = () => {
    const { data: goals, loading } = useFetch(fetchData, fetcher)
    const { toggle, has } = useUserSelectionStore()
    const { goals: selectedGoals } = useUserSelectionStore()
    const nextPage = usePagesStore((state) => state.nextPage)
    const initialFocus = useRef()
    const userSelectedGoals = selectedGoals.map((goal) => goal.slug)
    const iconComponents = {
        BarChart,
        Design,
        Donate,
        Monetization,
        OpenEnvelope,
        Pencil,
        Planner,
        PriceTag,
        School,
        Shop,
        Speech,
        Ticket,
    }

    useEffect(() => {
        if (loading) return
        state.setState({ ready: true })
    }, [loading])

    useEffect(() => {
        if (!initialFocus.current || loading) return
        const raf = requestAnimationFrame(() =>
            initialFocus.current?.querySelector('input')?.focus(),
        )
        return () => cancelAnimationFrame(raf)
    }, [initialFocus, loading])

    return (
        <PageLayout>
            <div>
                <h1
                    className="text-3xl text-partner-primary-text mb-4 mt-0"
                    data-test="goals-heading">
                    {__(
                        'What do you want to accomplish with this new site?',
                        'extendify',
                    )}
                </h1>
                <p className="text-base opacity-70 mb-0">
                    {__('You can change these later.', 'extendify')}
                </p>
            </div>
            <div className="w-full">
                <h2 className="text-lg m-0 mb-4 text-gray-900">
                    {__('Select the goals relevant to your site:', 'extendify')}
                </h2>
                {loading ? (
                    <p>{__('Loading...', 'extendify')}</p>
                ) : (
                    <form
                        data-test="goals-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            nextPage()
                        }}
                        className="w-full grid xl:grid-cols-2 gap-4 goal-select">
                        {/* Added so forms can be submitted by pressing Enter */}
                        <input type="submit" className="hidden" />
                        {goals?.map((goal, index) => {
                            const selected = userSelectedGoals.includes(
                                goal.slug,
                            )
                            const Icon = iconComponents[goal.icon]
                            return (
                                <div
                                    key={goal.id}
                                    className={classNames(
                                        'relative border rounded-lg',
                                        {
                                            'border-gray-800': !selected,
                                            'border-partner-primary-bg':
                                                selected,
                                        },
                                    )}
                                    ref={index === 0 ? initialFocus : undefined}
                                    data-test="goal-item">
                                    <div
                                        className={classNames(
                                            'absolute inset-0 pointer-events-none',
                                            {
                                                'bg-partner-primary-bg':
                                                    selected,
                                            },
                                        )}
                                        aria-hidden="true"
                                        style={{ opacity: '0.04' }}
                                    />
                                    <div className="flex items-center gap-4 h-full">
                                        <CheckboxInputCard
                                            label={goal.title}
                                            slug={`goal-${goal.slug}`}
                                            description={goal.description}
                                            checked={has('goals', goal)}
                                            onChange={() => {
                                                toggle('goals', goal)
                                            }}
                                            Icon={Icon}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </form>
                )}
            </div>
        </PageLayout>
    )
}
