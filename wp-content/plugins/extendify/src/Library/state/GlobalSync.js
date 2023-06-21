import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Similiar to Global.js but syncronous ("faster")
const state = (set) => ({
    designColors: {},
    setDesignColors(designColors) {
        set({ designColors })
    },
})

export const useGlobalSyncStore = create(
    persist(devtools(state, { name: 'Extendify Library Globals Sync' }), {
        name: 'extendify-library-globals-sync',
    }),
    state,
)
