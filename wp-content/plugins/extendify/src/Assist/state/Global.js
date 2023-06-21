import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { getGlobalData, saveGlobalData } from '../api/Data'

const key = 'extendify-assist-globals'
const startingState = {
    dismissedNotices: [],
    dismissedBanners: [],
    modals: [],
    // Optimistically update from local storage - see storage.setItem below
    ...(JSON.parse(localStorage.getItem(key) || '{}')?.state ?? {}),
}

const state = (set, get) => ({
    ...startingState,
    pushModal(modal) {
        set((state) => ({ modals: [modal, ...state.modals] }))
    },
    popModal() {
        set((state) => ({ modals: state.modals.slice(1) }))
    },
    clearModals() {
        set({ modals: [] })
    },
    isDismissed(id) {
        return get().dismissedNotices.some((notice) => notice.id === id)
    },
    dismissNotice(id) {
        if (get().isDismissed(id)) return
        const notice = { id, dismissedAt: new Date().toISOString() }
        set((state) => ({
            dismissedNotices: [...state.dismissedNotices, notice],
        }))
    },
    isDismissedBanner(id) {
        return get().dismissedBanners.some((banner) => banner.id === id)
    },
    dismissBanner(id) {
        if (get().isDismissedBanner(id)) return
        const banner = { id, dismissedAt: new Date().toISOString() }
        set((state) => ({
            dismissedBanners: [...state.dismissedBanners, banner],
        }))
    },
})

const storage = {
    getItem: async () => JSON.stringify(await getGlobalData()),
    setItem: async (k, value) => {
        // Stash here so we can use it on reload optimistically
        localStorage.setItem(k, value)
        await saveGlobalData(value)
    },
    removeItem: () => undefined,
}

export const useGlobalStore = create(
    persist(devtools(state, { name: 'Extendify Assist Globals' }), {
        name: key,
        storage: createJSONStorage(() => storage),
        partialize: (state) => {
            delete state.modals
            return state
        },
    }),
    state,
)
