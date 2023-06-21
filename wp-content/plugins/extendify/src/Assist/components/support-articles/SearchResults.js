import { Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { chevronRightSmall, chevronLeftSmall, Icon } from '@wordpress/icons'
import { useKnowledgeBaseStore } from '@assist/state/KnowledgeBase.js'

export const SearchResults = ({ searchResponse }) => {
    const { data: results, loading, error } = searchResponse
    const { offset, setOffset } = useKnowledgeBaseStore()

    const changeOffset = (action, amount = 10) =>
        action === 'add'
            ? setOffset(offset + amount)
            : setOffset(offset - amount)

    if (loading) {
        return (
            <div className="p-8 text-base text-center">
                <Spinner />
            </div>
        )
    }
    if (error) {
        return (
            <div className="p-8 text-base text-center">
                {__('There was an error loading articles', 'extendify')}
                <br />
                {error}
            </div>
        )
    }

    if (!results?.length) {
        return (
            <div className="p-8 text-base text-center" data-test="no-results">
                {__("Sorry, we couldn't find anything", 'extendify')}
            </div>
        )
    }

    return (
        <div className="flex items-center flex-wrap justify-center">
            <div
                className="max-w-4xl w-full flex flex-col gap-2"
                data-test="search-results">
                {results.map((result) => (
                    <ResultListItem key={result.id} {...result} />
                ))}
            </div>

            <div className="flex items-center justify-between  max-w-4xl w-full">
                {offset > 0 ? (
                    <button
                        className="flex justify-start items-center no-underline hover:underline hover:text-partner-primary-bg bg-transparent mb-3 mt-2 p-0 w-full cursor-pointer font-semibold text-design-main"
                        onClick={() => changeOffset('remove')}>
                        <Icon
                            icon={chevronLeftSmall}
                            className="fill-current"
                        />
                        {__('Previous', 'extendify')}
                    </button>
                ) : (
                    <div className="w-full" />
                )}

                {results.length ? (
                    <button
                        className="flex justify-end items-center no-underline hover:underline hover:text-partner-primary-bg bg-transparent mb-3 mt-2 p-0 w-full cursor-pointer font-semibold text-design-main"
                        onClick={() => changeOffset('add')}>
                        {__('Next', 'extendify')}
                        <Icon
                            icon={chevronRightSmall}
                            className="fill-current"
                        />
                    </button>
                ) : (
                    <div className="w-full" />
                )}
            </div>
        </div>
    )
}

const filterItems = (text) =>
    text
        .replaceAll(__('Go to the list of Blocks', 'extendify'), '')
        .replaceAll(__('Go back to the list of Blocks', 'extendify'), '')
        .replace(/<\/?p>/g, '')

const ResultListItem = ({ link, slug, title, excerpt }) => {
    const { pushArticle } = useKnowledgeBaseStore()
    return (
        <a
            href={link}
            onClick={(event) => {
                event.preventDefault()
                pushArticle({ slug, title: title.rendered })
            }}
            className="p-4 flex flex-col gap-1 no-underline bg-transparent w-full cursor-pointer text-gray-900 hover:bg-gray-100 focus:outline-none ring-design-main focus:ring-wp focus:ring-offset-1 focus:ring-offset-white">
            <h3 className="font-semibold text-lg text-left m-0">
                {title.rendered}
            </h3>
            <div
                className="text-sm text-left"
                dangerouslySetInnerHTML={{
                    __html: filterItems(excerpt.rendered),
                }}
            />
        </a>
    )
}
