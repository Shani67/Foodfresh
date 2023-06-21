import { Spinner } from '@wordpress/components'
import { useEffect, useRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import parse from 'html-react-parser'
import { getArticleRedirect } from '@assist/api/Data'
import { useSupportArticle } from '@assist/hooks/useSupportArticles'
import { useKnowledgeBaseStore } from '@assist/state/KnowledgeBase'

export const SupportArticle = () => {
    const { articles, pushArticle, updateTitle } = useKnowledgeBaseStore()
    const articleRef = useRef()
    const slug = articles?.[0]?.slug
    const { data: article, error, loading } = useSupportArticle(slug)
    const title = article?.title?.rendered

    useEffect(() => {
        if (!slug || !title) return
        updateTitle(slug, title)
    }, [title, updateTitle, slug])

    useEffect(() => {
        if (!articleRef.current) return
        const links = articleRef.current?.querySelectorAll('a')
        const handleInternal = async (e) => {
            e.preventDefault()

            // In that case, event.ctrlKey does the trick.
            if (e.ctrlKey || e.metaKey) {
                e.stopPropagation()
                return window.open(e.target.href, '_blank')
            }

            // Could be the parent element so check both
            const link = e.target?.href ?? e.target?.closest('a')?.href
            const { pathname } = new URL(link)
            const slug = pathname.split('/').filter(Boolean)?.at(-1)

            // Both the new docs site and the old may have redirects
            const { data } = await getArticleRedirect(pathname)
            if (!data) {
                // If nothing useful was returned, it could be the new docs site
                if (pathname.startsWith('/documentation/article/')) {
                    return pushArticle({ slug, title: undefined })
                }
                // But if not then just open the link in a new tab
                return window.open(`https://wordpress.org${pathname}`, '_blank')
            }
            // Finally load the article
            pushArticle({ slug: data.split('/').filter(Boolean)?.at(-1) })
        }

        const handleExternal = (e) => {
            e.preventDefault()
            window.open(e.target.href, '_blank')
        }

        const handleNoOp = (e) => e.preventDefault()

        links.forEach((link) => {
            const { hash, host, pathname } = new URL(link.href)
            // Hash links should be disabled since they don't work properly
            if (
                (hash && host === window.location.host) ||
                pathname.startsWith('/support/category')
            ) {
                link.addEventListener('click', handleNoOp)
                link.setAttribute('aria-disabled', 'true')
                link.classList.add('link-disabled')
                return
            }
            // if link is to an image or a file, remove it
            const pattern =
                /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx)$/
            if (pathname.match(pattern)) {
                link.addEventListener('click', handleNoOp)
                return
            }
            if (
                pathname.startsWith('/documentation/article') ||
                pathname.startsWith('/support/article')
            ) {
                link.addEventListener('click', handleInternal)
                return
            }
            // If the link is something else, then open in a new tab
            link.addEventListener('click', handleExternal)
            const svg =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="components-external-link__icon css-rvs7bx esh4a730" aria-hidden="true" focusable="false"><path d="M18.2 17c0 .7-.6 1.2-1.2 1.2H7c-.7 0-1.2-.6-1.2-1.2V7c0-.7.6-1.2 1.2-1.2h3.2V4.2H7C5.5 4.2 4.2 5.5 4.2 7v10c0 1.5 1.2 2.8 2.8 2.8h10c1.5 0 2.8-1.2 2.8-2.8v-3.6h-1.5V17zM14.9 3v1.5h3.7l-6.4 6.4 1.1 1.1 6.4-6.4v3.7h1.5V3h-6.3z"></path></svg>'
            const svgEl = document.createElement('span')
            svgEl.innerHTML = svg
            link.appendChild(svgEl)
        })
        return () => {
            links.forEach((link) => {
                link?.removeEventListener('click', handleInternal)
                link?.removeEventListener('click', handleExternal)
                link?.removeEventListener('click', handleNoOp)
            })
        }
    }, [article, pushArticle])

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
                {__('There was an error loading this article', 'extendify')}
            </div>
        )
    }

    return (
        <article ref={articleRef} className="extendify-documentation w-full">
            <h1 className="m-0 text-3xl">{title}</h1>
            {article?.content?.rendered && parse(article?.content?.rendered)}
        </article>
    )
}
