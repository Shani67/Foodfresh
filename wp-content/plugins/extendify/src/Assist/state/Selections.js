import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { getUserSelectionData, saveUserSelectionData } from '@assist/api/Data'

const key = 'extendify-site-selection'
const startingState = {
    siteType: {},
    siteInformation: {
        title: undefined,
    },
    siteTypeSearch: [],
    style: null,
    pages: [],
    plugins: [],
    goals: [],
    // Optimistically update from local storage - see storage.setItem below
    ...(JSON.parse(localStorage.getItem(key) || '{}')?.state ?? {}),
}

const state = () => ({
    ...startingState,
    // Add methods here
})

const storage = {
    getItem: async () => JSON.stringify(await getUserSelectionData()),
    setItem: async (k, value) => {
        // Stash here so we can use it on reload optimistically
        localStorage.setItem(k, value)
        await saveUserSelectionData(value)
    },
    removeItem: () => undefined,
}

export const useSelectionStore = create(
    persist(devtools(state, { name: 'Extendify User Selections' }), {
        name: key,
        storage: createJSONStorage(() => storage),
    }),
    state,
)
