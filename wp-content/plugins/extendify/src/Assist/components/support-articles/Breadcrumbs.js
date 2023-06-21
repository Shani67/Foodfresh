import { __, sprintf } from '@wordpress/i18n'
import { Icon, chevronRightSmall } from '@wordpress/icons'
import { useKnowledgeBaseStore } from '@assist/state/KnowledgeBase'
import { helpIcon } from '@assist/svg'

export const Breadcrumbs = () => {
    const {
        searchTerm,
        setSearchTerm,
        activeCategory,
        articles,
        clearArticles,
        popArticle,
        reset,
    } = useKnowledgeBaseStore()

    if (!activeCategory && !articles) {
        return null
    }

    return (
        <div className="flex items-center py-3 px-8 text-gray-700 bg-white border-l border-r border-gray-300">
            <button
                aria-label={__('Knowledge Base home', 'extendify-sdk')}
                type="button"
                className="flex items-center underline p-0 text-xs bg-transparent text-gray-700 cursor-pointer"
                onClick={reset}>
                <Icon icon={helpIcon} className="fill-current" />
            </button>

            {searchTerm && (
                <>
                    <Icon icon={chevronRightSmall} className="fill-current" />
                    <button
                        type="button"
                        className="p-0 text-s cursor-pointer bg-transparent text-gray-700"
                        onClick={() => {
                            reset()
                            setSearchTerm(searchTerm)
                        }}>
                        {sprintf(
                            __('Search results for "%s"', 'extendify-sdk'),
                            searchTerm,
                        )}
                    </button>
                </>
            )}

            {activeCategory && (
                <>
                    <Icon icon={chevronRightSmall} className="fill-current" />
                    <button
                        aria-label={activeCategory?.title}
                        type="button"
                        className="p-0 text-s cursor-pointer bg-transparent text-gray-700"
                        onClick={clearArticles}>
                        {activeCategory?.title}
                    </button>
                </>
            )}

            {articles?.[1] && (
                <>
                    <Icon icon={chevronRightSmall} className="fill-current" />
                    <button
                        aria-label={articles?.[1]?.title ?? articles?.[1]?.slug}
                        type="button"
                        className="p-0 text-s cursor-pointer bg-transparent text-gray-700"
                        onClick={popArticle}>
                        {articles?.[1]?.title ?? articles?.[1]?.slug}
                    </button>
                </>
            )}

            {articles?.[0] && (
                <>
                    <Icon icon={chevronRightSmall} className="fill-current" />
                    <span>{articles?.[0]?.title ?? articles?.[0]?.slug}</span>
                </>
            )}
        </div>
    )
}
