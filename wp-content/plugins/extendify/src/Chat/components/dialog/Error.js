import { __ } from '@wordpress/i18n'

export const Error = ({ text, reset }) => {
    return (
        <div className="p-5 rounded-lg bg-red-100 border border-solid border-red-500">
            <p className="m-0 mb-4 text-gray-800 text-sm">{text}</p>
            <p className="m-0">
                <button
                    type="button"
                    className="bg-transparent border-none p-0 underline cursor-pointer"
                    onClick={reset}>
                    {__('Please try again.', 'extendify')}
                </button>
            </p>
        </div>
    )
}
