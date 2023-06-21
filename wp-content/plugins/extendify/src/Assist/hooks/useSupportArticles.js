import useSWR from 'swr'
import {
    getSupportArticles,
    getSupportArticleCategories,
    getSupportArticle,
    getSearchResults,
} from '@assist/api/Data'

export const useSupportArticles = () => {
    const { data, error } = useSWR(
        'support-articles',
        async () => {
            const response = await getSupportArticles()

            if (!response?.data || !Array.isArray(response.data)) {
                throw new Error('Bad Data')
            }
            return response.data
        },
        {
            refreshInterval: 360_000,
            revalidateOnFocus: false,
            dedupingInterval: 360_000,
        },
    )
    return { data, error, loading: !data && !error }
}

export const useSupportArticleCategories = () => {
    const { data, error } = useSWR(
        'support-article-categories',
        async () => {
            const response = await getSupportArticleCategories()

            if (!response?.data || !Array.isArray(response.data)) {
                console.error(
                    'We got an empty response while querying support-article-categories',
                    response,
                )
                throw new Error('Bad Data')
            }

            return response.data
        },
        {
            refreshInterval: 360_000,
            revalidateOnFocus: false,
            dedupingInterval: 360_000,
        },
    )
    return { data: data, error, loading: !data && !error }
}

export const useSupportArticle = (slug) => {
    const { data, error } = useSWR(
        `support-article-${slug}`,
        async () => {
            const response = await getSupportArticle(slug)

            if (!response?.data || !Array.isArray(response.data)) {
                console.error(
                    `We got an empty response while querying support-article-${slug}`,
                    response,
                )
                throw new Error('Bad Data')
            }

            return response.data?.[0] ?? {}
        },
        {
            refreshInterval: 360_000,
            revalidateOnFocus: false,
            dedupingInterval: 360_000,
        },
    )
    return { data, error, loading: !data && !error }
}

export const useSearchArticles = ({ term, perPage, offset }) => {
    const { data, error } = useSWR(
        { term, perPage, offset },
        async ({ term, perPage, offset }) => {
            if (!term) return []

            const response = await getSearchResults(term, perPage, offset)

            if (!response?.data || !Array.isArray(response.data)) {
                console.error(
                    'We got an empty response while querying search-articles',
                    response,
                )
                throw new Error('Bad Data')
            }

            return response.data
        },
        {
            refreshInterval: 360_000,
            revalidateOnFocus: false,
            dedupingInterval: 360_000,
        },
    )
    return { data, error, loading: !data && !error }
}
