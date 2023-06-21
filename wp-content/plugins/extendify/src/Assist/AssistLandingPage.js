import { SWRConfig } from 'swr'
import { useRouter } from '@assist/hooks/useRouter'
import { storageProvider as provider } from '@assist/lib/localStorageProvider'
import { Header } from '@assist/pages/parts/Header'
import './documentation.css'

const Page = () => {
    const { CurrentPage } = useRouter()

    return (
        <>
            <Header />
            <CurrentPage />
        </>
    )
}

export const AssistLandingPage = () => (
    <SWRConfig
        value={{
            provider,
            onError: () => {
                localStorage.removeItem(
                    `${window.extAssistData.wpLanguage}-assist-cache`,
                )
            },
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if (error.status === 404) return
                if (error?.data?.status === 403) {
                    // if they are logged out, we can't recover
                    window.location.reload()
                    return
                }

                // Retry after 5 seconds.
                setTimeout(() => revalidate({ retryCount }), 5000)
            },
        }}>
        <Page />
    </SWRConfig>
)
