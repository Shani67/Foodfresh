import { useState, useEffect } from '@wordpress/element'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@library/api/User'

const storage = {
    getItem: async () => await User.getData(),
    setItem: async (_name, value) => await User.setData(value),
    removeItem: async () => await User.deleteData(),
}

const isGlobalLibraryEnabled = () =>
    window.extendifyData.sitesettings === null ||
    window.extendifyData?.sitesettings?.state?.enabled

const MAX_IMPORTS = 10
export const useUserStore = create(
    persist(
        (set, get) => ({
            firstLoadedOn: new Date().toISOString(),
            email: '',
            apiKey: '',
            uuid: '',
            sdkPartner: '',
            noticesDismissedAt: {},
            modalNoticesDismissedAt: {},
            imports: 0, // total imports over time
            runningImports: 0, // timed imports, resets to 0 every month
            entryPoint: 'not-set',
            enabled: isGlobalLibraryEnabled(),
            canInstallPlugins: false,
            canActivatePlugins: false,
            openOnNewPage: undefined, // This is only being used on the server
            setOpenOnNewPage: (value) => set({ openOnNewPage: value }),
            incrementImports: () => {
                set((state) => ({
                    imports: Number(state.imports) + 1,
                    runningImports: Number(state.runningImports) + 1,
                }))
            },
            hasAvailableImports: () => {
                return get().apiKey
                    ? true
                    : Number(get().runningImports) < MAX_IMPORTS
            },
            remainingImports: () => {
                const remaining = MAX_IMPORTS - Number(get().runningImports)
                return remaining > 0 ? remaining : 0
            },
            // Will mark a modal or footer notice
            markNoticeSeen: (key, type) => {
                set({
                    [`${type}DismissedAt`]: {
                        ...get()[`${type}DismissedAt`],
                        [key]: new Date().toISOString(),
                    },
                })
            },
        }),
        {
            name: 'extendify-user',
            storage: createJSONStorage(() => storage),
        },
    ),
)

/* Hook useful for when you need to wait on the async state to hydrate */
export const useUserStoreReady = () => {
    const [hydrated, setHydrated] = useState(useUserStore.persist.hasHydrated)
    useEffect(() => {
        const unsubFinishHydration = useUserStore.persist.onFinishHydration(
            () => setHydrated(true),
        )
        return () => {
            unsubFinishHydration()
        }
    }, [])
    return hydrated
}
