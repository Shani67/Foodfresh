import { getAnswer } from '@chat/api/Data'
import useSWR from 'swr'

export const useAnswer = (questionId, status = null) => {
    const { data, mutate, error } = useSWR(
        questionId,
        async () => {
            const response = await getAnswer(questionId)

            if (!response?.status) {
                console.error(response)
                throw new Error('Bad data')
            }

            return response
        },
        {
            refreshInterval: status === 'finished' ? 0 : 1_000,
            revalidateOnFocus: false,
            revalidateIfStale: status !== 'finished',
            revalidateOnReconnect: false,
        },
    )

    return { data, mutate, error, loading: questionId && !data && !error }
}
