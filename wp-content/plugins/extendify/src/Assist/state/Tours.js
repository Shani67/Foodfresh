import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { getTourData, saveTourData } from '../api/Data'

const key = 'extendify-assist-tour-progress'
const startingState = {
    currentTour: null,
    currentStep: undefined,
    preparingStep: undefined,
    progress: [],
    // Optimistically update from local storage - see storage.setItem below
    ...(JSON.parse(localStorage.getItem(key) || '{}')?.state ?? {}),
}

const state = (set, get) => ({
    ...startingState,
    startTour: async (tourData) => {
        const { trackTourProgress, updateProgress, getStepData, onTourPage } =
            get()

        if (onTourPage(tourData?.settings?.startFrom)) {
            await tourData?.onStart?.(tourData)
            tourData.steps =
                tourData.steps?.filter(
                    // Filter out steps that define a condition
                    (s) => s?.showOnlyIf?.() || s?.showOnlyIf?.() === undefined,
                ) || []
            await getStepData(0, tourData)?.events?.beforeAttach?.(tourData)
        }

        set({ currentTour: tourData, currentStep: 0, preparingStep: undefined })
        // Increment the opened count
        const tour = trackTourProgress(tourData.id)
        updateProgress(tour.id, {
            openedCount: tour.openedCount + 1,
            lastAction: 'started',
        })
    },
    onTourPage(startFrom = null) {
        const url = window.location.href
        if (startFrom?.includes(url)) return true
        const { currentTour } = get()
        return currentTour?.settings?.startFrom?.includes(url)
    },
    completeCurrentTour: async () => {
        const { currentTour, finishedTour, findTourProgress, updateProgress } =
            get()
        const tour = findTourProgress(currentTour?.id)
        if (!tour?.id) return
        // if already completed, don't update the completedAt
        if (!finishedTour(tour.id)) {
            updateProgress(tour.id, {
                completedAt: new Date().toISOString(),
                lastAction: 'completed',
            })
        }
        // Track how many times it was completed
        updateProgress(tour.id, {
            completedCount: tour.completedCount + 1,
            lastAction: 'completed',
        })
        await currentTour?.onDetach?.()
        await currentTour?.onFinish?.()
        set({ currentTour: null, currentStep: undefined })
    },
    closeCurrentTour: async (lastAction) => {
        const { currentTour, findTourProgress, updateProgress } = get()
        const tour = findTourProgress(currentTour?.id)
        if (!tour?.id) return
        const additional = {}
        if (['redirected'].includes(lastAction)) {
            return updateProgress(tour?.id, { lastAction })
        }
        if (['closed-by-caught-error'].includes(lastAction)) {
            return updateProgress(tour?.id, { lastAction, errored: true })
        }
        if (lastAction === 'closed-manually') {
            additional.closedManuallyCount = tour.closedManuallyCount + 1
        }

        await currentTour?.onDetach?.()
        await currentTour?.onFinish?.()
        updateProgress(tour?.id, { lastAction, ...additional })
        set({
            currentTour: null,
            currentStep: undefined,
            preparingStep: undefined,
        })
    },
    findTourProgress(tourId) {
        return get().progress.find((tour) => tour.id === tourId)
    },
    finishedTour(tourId) {
        return get().findTourProgress(tourId)?.completedAt
    },
    wasOpened(tourId) {
        return get().findTourProgress(tourId)?.openedCount > 0
    },
    isSeen(tourId) {
        return get().findTourProgress(tourId)?.firstSeenAt
    },
    trackTourProgress(tourId) {
        const { findTourProgress } = get()
        // If we are already tracking it, return that
        if (findTourProgress(tourId)) {
            return findTourProgress(tourId)
        }
        set((state) => ({
            progress: [
                ...state.progress,
                {
                    id: tourId,
                    firstSeenAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    completedAt: null,
                    lastAction: 'init',
                    currentStep: 0,
                    openedCount: 0,
                    closedManuallyCount: 0,
                    completedCount: 0,
                    errored: false,
                },
            ],
        }))
        return findTourProgress(tourId)
    },
    updateProgress(tourId, update) {
        const lastAction = update?.lastAction ?? 'unknown'
        set((state) => {
            const progress = state.progress.map((tour) => {
                if (tour.id === tourId) {
                    return {
                        ...tour,
                        ...update,
                        lastAction,
                        updatedAt: new Date().toISOString(),
                    }
                }
                return tour
            })
            return { progress }
        })
    },
    getStepData(step, tour = get().currentTour) {
        return tour?.steps?.[step] ?? {}
    },
    hasNextStep() {
        if (!get().currentTour) return false
        return get().currentStep < get().currentTour.steps.length - 1
    },
    nextStep: async () => {
        const { currentTour, goToStep, updateProgress, currentStep } = get()
        const step = currentStep + 1
        await goToStep(step)
        updateProgress(currentTour.id, {
            currentStep: step,
            lastAction: 'next',
        })
    },
    hasPreviousStep() {
        if (!get().currentTour) return false
        return get().currentStep > 0
    },
    prevStep: async () => {
        const { currentTour, goToStep, updateProgress, currentStep } = get()
        const step = currentStep - 1
        await goToStep(step)
        updateProgress(currentTour.id, {
            currentStep: step,
            lastAction: 'prev',
        })
    },
    goToStep: async (step) => {
        const { currentTour, updateProgress, closeCurrentTour, getStepData } =
            get()
        const tour = currentTour

        // Check that the step is valid
        if (step < 0 || step > tour.steps.length - 1) {
            closeCurrentTour('closed-by-caught-error')
            return
        }

        updateProgress(tour.id, {
            currentStep: step,
            lastAction: `go-to-step-${step}`,
        })

        const events = getStepData(step)?.events

        if (events?.beforeAttach) {
            set(() => ({ preparingStep: step }))
            // Make sure the preparing animation runs at least 300ms
            await Promise.allSettled([
                events.beforeAttach?.(tour),
                new Promise((resolve) => setTimeout(resolve, 300)),
            ])
            set(() => ({ preparingStep: undefined }))
        }

        set(() => ({ currentStep: step }))
    },
})

const storage = {
    getItem: async () => JSON.stringify(await getTourData()),
    setItem: async (k, value) => {
        // Stash here so we can use it on reload optimistically
        localStorage.setItem(k, value)
        await saveTourData(value)
    },
    removeItem: () => undefined,
}

export const useTourStore = create(
    persist(devtools(state, { name: 'Extendify Assist Tour Progress' }), {
        name: key,
        storage: createJSONStorage(() => storage),
        partialize: (state) => {
            // return without currentTour or currentStep
            // eslint-disable-next-line no-unused-vars
            const { currentTour, currentStep, preparingStep, ...newState } =
                state
            return newState
        },
    }),
    state,
)
