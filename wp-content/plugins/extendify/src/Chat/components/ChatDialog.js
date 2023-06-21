import { useState } from '@wordpress/element'
import { Answer } from '@chat/components/dialog/Answer'
import { Header } from '@chat/components/dialog/Header'
import { Question } from '@chat/components/dialog/Question'
import { Support } from '@chat/components/dialog/Support'
import { useQuestion } from '@chat/hooks/useQuestion'

export const ChatDialog = () => {
    // Store the answer in state that the current answer doesn't clear while the new one is loading.
    const [question, setQuestion] = useState('')
    const { data: answer, loading, error } = useQuestion(question ?? null)
    const reset = () => setQuestion('')

    return (
        <div className="fixed z-high overflow-hidden w-80 bottom-24 right-6 border border-solid border-gray-300 text-base bg-white rounded-lg shadow-2xl">
            <div className="px-6 py-4 bg-design-main text-design-text">
                <Header question={question} reset={reset} />
                {!answer && !question && <Question setQuestion={setQuestion} />}
            </div>
            {!answer && !question && <Support />}
            {question && (
                <Answer
                    question={question}
                    answerId={answer?.id}
                    reset={reset}
                    questionLoading={loading}
                    questionError={error}
                />
            )}
        </div>
    )
}
