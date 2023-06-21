import { Fragment, useEffect, useRef, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Icon } from '@wordpress/icons'
import { Error } from '@chat/components/dialog/Error'
import { useAnswer } from '@chat/hooks/useAnswer'
import { robot, send } from '@chat/svg'
import classnames from 'classnames'

export const Answer = ({
    question,
    reset,
    answerId,
    questionLoading,
    questionError,
}) => {
    const [status, setStatus] = useState(null)
    const [displayedAnswer, setDisplayedAnswer] = useState('')
    const { data, error } = useAnswer(answerId ?? null, status)
    const { answer, loading, status: answerStatus } = data ?? {}
    const scrollRef = useRef(null)

    useEffect(() => setStatus(answerStatus), [answerStatus])

    useEffect(() => {
        if (!answer) return
        const words = answer.slice(displayedAnswer.length).trim().split(' ')
        const nextWord = words[0]
        if (!nextWord) return
        const retryTime = [75, 75, 75, 150, 300].at(
            Math.floor(Math.random() * 5),
        )
        const timer = setTimeout(() => {
            setDisplayedAnswer((prev) => prev + (prev ? ' ' : '') + nextWord)
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth',
                })
            }
        }, retryTime)
        return () => clearTimeout(timer)
    }, [answer, status, displayedAnswer])

    return (
        <>
            <div className="p-6 pb-10 h-80 overflow-scroll" ref={scrollRef}>
                <div className="flex justify-end mb-8 ml-4 relative">
                    {questionError ? (
                        <Error
                            text={__(
                                'Oops! We were unable to send your question.',
                                'extendify',
                            )}
                            reset={reset}
                        />
                    ) : (
                        <p className="m-0 p-5 rounded-lg bg-gray-800 text-design-text text-sm">
                            <span
                                className={classnames({
                                    'animate-pulse': questionLoading,
                                })}>
                                {question}
                            </span>
                        </p>
                    )}
                </div>
                {(status || loading || error) && (
                    <div className="flex justify-start mr-4 relative">
                        <div className="absolute -mt-4 -ml-2 rounded-full bg-design-main p-2 flex items-center">
                            <Icon
                                icon={robot}
                                className="text-design-text fill-current w-4 h-4"
                            />
                        </div>
                        {error ? (
                            <Error
                                text={__(
                                    'Oops! We encountered an error while processing your question.',
                                    'extendify',
                                )}
                                reset={reset}
                            />
                        ) : (
                            <p className="m-0 p-5 rounded-lg bg-gray-100 text-gray-800 text-sm">
                                {displayedAnswer ? (
                                    displayedAnswer
                                        .split('\n')
                                        .map((line, index) => (
                                            <Fragment key={index}>
                                                {line}
                                                <br />
                                            </Fragment>
                                        ))
                                ) : (
                                    <span className="text-gray-600 font-bold animate-pulse">
                                        ...
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="ask-another-question p-6 relative flex justify-center">
                <button
                    type="button"
                    onClick={reset}
                    className="bg-design-main text-design-text border-none py-2 px-4 rounded-sm cursor-pointer text-sm flex items-center gap-2">
                    {__('Ask Another Question', 'extendify')}
                    <Icon
                        icon={send}
                        className="text-design-text fill-current h-6"
                    />
                </button>
            </div>
        </>
    )
}
