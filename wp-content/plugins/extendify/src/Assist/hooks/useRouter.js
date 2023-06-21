import { useCallback, useEffect, useLayoutEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { getRouterData, saveRouterData } from '@assist/api/Data'
import { Dashboard } from '@assist/pages/Dashboard'
import { KnowledgeBase } from '@assist/pages/KnowledgeBase'
import { Recommendations } from '@assist/pages/Recommendations'
import { Tasks } from '@assist/pages/Tasks'
import { Tours } from '@assist/pages/Tours'
import {
    helpIcon,
    homeIcon,
    recommendationsIcon,
    tasksIcon,
    toursIcon,
} from '@assist/svg'

const pages = [
    {
        slug: 'dashboard',
        name: __('Dashboard', 'extendify'),
        icon: homeIcon,
        component: Dashboard,
    },
    {
        slug: 'tasks',
        name: __('Tasks', 'extendify'),
        icon: tasksIcon,
        component: Tasks,
    },
    {
        slug: 'tours',
        name: __('Tours', 'extendify'),
        icon: toursIcon,
        component: Tours,
    },
    {
        slug: 'recommendations',
        name: __('Recommendations', 'extendify'),
        icon: recommendationsIcon,
        component: Recommendations,
    },
    {
        slug: 'knowledge-base',
        name: __('Knowledge Base', 'extendify'),
        icon: helpIcon,
        component: KnowledgeBase,
    },
]
const { themeSlug, launchCompleted, disableRecommendations } =
    window.extAssistData
const disableTasks = themeSlug !== 'extendable' || !launchCompleted
const filteredPages = pages.filter((page) => {
    const noTasks = page.slug === 'tasks' && disableTasks
    const noRecs = page.slug === 'recommendations' && disableRecommendations
    return !noTasks && !noRecs
})

let onChangeEvents = []
const state = (set, get) => ({
    history: [],
    viewedPages: [],
    current: null,
    setCurrent: async (page) => {
        if (!page) return
        for (const event of onChangeEvents) {
            await event(page, { ...get() })
        }
        // If history is the same, dont add (they pressed the same nav button)
        if (get().history[0]?.slug === page.slug) return
        set((state) => {
            const lastViewedAt = new Date().toISOString()
            const firstViewedAt = lastViewedAt
            const visited = state.viewedPages.find((a) => a.slug === page.slug)
            return {
                history: [page, ...state.history].filter(Boolean),
                current: page,
                viewedPages: [
                    // Remove the page if it's already in the list
                    ...state.viewedPages.filter((a) => a.slug !== page.slug),
                    // Either add the page or update the count
                    visited
                        ? { ...visited, count: visited.count + 1, lastViewedAt }
                        : {
                              slug: page.slug,
                              firstViewedAt,
                              lastViewedAt,
                              count: 1,
                          },
                ],
            }
        })
    },
})
const storage = {
    getItem: async () => JSON.stringify(await getRouterData()),
    setItem: async (_, value) => await saveRouterData(value),
    removeItem: () => undefined,
}

const useRouterState = create(
    persist(devtools(state, { name: 'Extendify Assist Router' }), {
        name: 'extendify-assist-router',
        storage: createJSONStorage(() => storage),
        partialize: ({ viewedPages }) => ({ viewedPages }),
    }),
    state,
)
export const router = {
    onRouteChange: (event) => {
        // dont add if duplicate
        if (onChangeEvents.includes(event)) return
        onChangeEvents = [...onChangeEvents, event]
    },
    removeOnRouteChange: (event) => {
        onChangeEvents = onChangeEvents.filter((e) => e !== event)
    },
}

let once = false
export const useRouter = () => {
    const { current, setCurrent, history } = useRouterState()
    const Component = current?.component ?? (() => null)

    const navigateTo = (slug) => {
        if (window.location.hash === `#${slug}`) {
            // Fire the event only
            window.dispatchEvent(new Event('hashchange'))
            return
        }
        window.location.hash = `#${slug}`
    }
    useLayoutEffect(() => {
        // if no hash is present use previous or add #dashboard
        if (!window.location.hash) {
            window.location.hash = `#${current?.slug ?? 'dashboard'}`
        }
    }, [current])

    useEffect(() => {
        if (once) return
        once = true
        // watch url changes for #dashboard, etc
        const handle = () => {
            const hash = window.location.hash.replace('#', '')
            const page = filteredPages.find((page) => page.slug === hash)
            if (!page) {
                navigateTo(current?.slug ?? 'dashboard')
                return
            }
            setCurrent(page)
            // Update title to match the page
            document.title = `${page.name} | Extendify Assist`
        }
        window.addEventListener('hashchange', handle)
        if (!current) handle()
        return () => {
            once = false
            window.removeEventListener('hashchange', handle)
        }
    }, [current, setCurrent])

    return {
        current,
        CurrentPage: useCallback(
            () => (
                <div role="region" aria-live="polite">
                    {/* Announce to SR on change */}
                    <h1 className="sr-only">{current?.name}</h1>
                    <Component />
                </div>
            ),
            [current],
        ),
        filteredPages,
        navigateTo,
        history,
    }
}
