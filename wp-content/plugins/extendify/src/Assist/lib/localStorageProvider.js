// https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache
const cacheKey = `${window.extAssistData.wpLanguage}-assist-cache`

export const storageProvider = () => {
    const devMode =
        window.location.search.includes('DEVMODE') ||
        window.location.search.includes('LOCALMODE')

    if (devMode) {
        localStorage.removeItem(cacheKey)
        return new Map()
    }

    const map = new Map(JSON.parse(localStorage.getItem(cacheKey) || '[]'))

    window.addEventListener('beforeunload', () => {
        const cache = JSON.stringify(
            Array.from(map.entries()).filter((item) => !item[1]?.error),
        )

        localStorage.setItem(cacheKey, cache)
    })

    return map
}
