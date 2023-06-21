import useSWR from 'swr'
import { getQuickLinks } from '@assist/api/Data'

export const useQuickLinks = () => {
    const { data: quickLinks, error } = useSWR(
        'quicklinks',
        async () => {
            const response = await getQuickLinks()

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

    return { quickLinks, error, loading: !quickLinks && !error }
}
