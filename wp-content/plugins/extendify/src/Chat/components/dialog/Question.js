import { useEffect, useRef, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Icon } from '@wordpress/icons'
import { send } from '@chat/svg'
import classnames from 'classnames'

export const Question = ({ setQuestion }) => {
    const queryInput = useRef(null)
    const [inputValue, setInputValue] = useState('')

    const submit = (e) => {
        e.preventDefault()

        if (!inputValue) {
            return
        }

        setQuestion(inputValue)
    }

    useEffect(() => {
        // Focus the input when the component mounts
        queryInput.current.focus()
    }, [])

    return (
        <form onSubmit={submit} className="py-20">
            <p className="text-lg font-medium m-0 mb-1 opacity-80">
                {__('Hi there!', 'extendify')}
            </p>
            <p className="text-2xl font-medium m-0 mb-6">
                {__('Ask me any questions about WordPress.', 'extendify')}
            </p>
            <div className="relative">
                <input
                    type="text"
                    className="w-full py-4 pl-3 pr-10 placeholder-gray-600 rounded border shadow border-gray-300 bg-white outline-none disabled:border-gray-300 disabled:cursor-default"
                    placeholder={__(
                        'Ask your WordPress question…',
                        'extendify',
                    )}
                    value={inputValue}
                    maxLength={255}
                    onChange={(e) => setInputValue(e.target.value)}
                    ref={queryInput}
                />
                <button
                    type="submit"
                    className={classnames(
                        'absolute top-0 right-1.5 h-full bg-transparent border-none fill-current flex items-center cursor-pointer text-gray-700 hover:text-gray-900',
                    )}
                    disabled={!inputValue}>
                    <Icon icon={send} className="w-4 h-4" />
                </button>
            </div>
            <input type="submit" className="hidden" />
        </form>
    )
}
