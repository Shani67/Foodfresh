import { askQuestion } from '@chat/api/Data'
import useSWRImmutable from 'swr/immutable'

export const useQuestion = (question) => {
    const { data, error } = useSWRImmutable(question, async () => {
        const response = await askQuestion({
            question: question.slice(0, 255),
            experience: 'beginner', // TODO: Add experience level to the chat UI
        })

        if (!response?.id) {
            console.error(response)
            throw new Error('Bad data')
        }

        return response
    })
    return { data, error, loading: question && !data && !error }
}
