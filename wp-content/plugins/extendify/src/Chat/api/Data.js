import { Axios as api } from './axios'

export const askQuestion = (data) => api.post('chat/ask-question', { data })
export const getAnswer = (questionId) =>
    api.get('chat/get-answer', { params: { id: questionId } })
