import { __ } from '@wordpress/i18n'
import { search, Icon, closeSmall } from '@wordpress/icons'
import classNames from 'classnames'
import { useKnowledgeBaseStore } from '@assist/state/KnowledgeBase.js'

export const SearchForm = ({ handleSubmission }) => {
    const { searchTerm, clearSearchTerm, reset } = useKnowledgeBaseStore()

    const onSubmit = (e) => {
        e.preventDefault()
        handleSubmission(searchTerm)
    }

    const clearFormAndReset = () => {
        reset()
        clearSearchTerm()
    }

    return (
        <form
            method="get"
            onSubmit={onSubmit}
            className="relative w-full max-w-xs h-8">
            <label htmlFor="s" className="sr-only">
                {__('Search for articles', 'extendify')}
            </label>
            <input
                name="s"
                id="s"
                type="text"
                value={searchTerm ?? ''}
                onChange={(e) => handleSubmission(e.target.value)}
                placeholder={__('Search...', 'extendify')}
                className="input w-full placeholder-gray-400 text-sm pr-16 h-full"
            />
            <div className="absolute right-0 text-gray-400 flex items-center justify-center inset-y-0">
                <Icon
                    icon={!searchTerm ? search : closeSmall}
                    className={classNames('fill-current', {
                        'cursor-pointer': searchTerm,
                    })}
                    onClick={clearFormAndReset}
                    size={30}
                />
            </div>
        </form>
    )
}
