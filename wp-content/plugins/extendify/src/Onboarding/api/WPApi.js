import { __, sprintf } from '@wordpress/i18n'
import { Axios as api } from './axios'

export const parseThemeJson = (themeJson) =>
    api.post('onboarding/parse-theme-json', { themeJson })

export const updateOption = (option, value) =>
    api.post('onboarding/options', { option, value })

export const getOption = async (option) => {
    const { data } = await api.get('onboarding/options', {
        params: { option },
    })
    return data
}

export const createPage = (pageData) =>
    api.post(`${window.extOnbData.wpRoot}wp/v2/pages`, pageData)

export const getPageById = (pageId) =>
    api.get(`${window.extOnbData.wpRoot}wp/v2/pages/${pageId}`)

export const installPlugin = async (plugin) => {
    // Fail silently if no slug is provided
    if (!plugin?.wordpressSlug) return

    try {
        // Install plugin and try to activate it.
        const response = await api.post(
            `${window.extOnbData.wpRoot}wp/v2/plugins`,
            {
                slug: plugin.wordpressSlug,
                status: 'active',
            },
        )
        if (!response.ok) return response
    } catch (e) {
        // Fail gracefully for now
    }

    try {
        // Try and activate it if the above fails
        return await activatePlugin(plugin)
    } catch (e) {
        // Fail gracefully for now
    }
}

export const activatePlugin = async (plugin) => {
    const endpoint = `${window.extOnbData.wpRoot}wp/v2/plugins`
    const response = await api.get(`${endpoint}?search=${plugin.wordpressSlug}`)
    const pluginSlug = response?.[0]?.plugin
    if (!pluginSlug) {
        throw new Error('Plugin not found')
    }
    // Attempt to activate the plugin with the slug we found
    return await api.post(`${endpoint}/${pluginSlug}`, { status: 'active' })
}

export const updateTemplatePart = (part, content) =>
    api.post(`${window.extOnbData.wpRoot}wp/v2/template-parts/${part}`, {
        slug: `${part}`,
        theme: 'extendable',
        type: 'wp_template_part',
        status: 'publish',
        description: sprintf(
            // translators: %s is the name of the product, Extendify Launch
            __('Added by %s', 'extendify'),
            'Extendify Launch',
        ),
        content,
    })

export const getHeadersAndFooters = async () => {
    let patterns = await getTemplateParts()
    patterns = patterns?.filter((p) => p.theme === 'extendable')
    const headers = patterns?.filter((p) => p?.slug?.includes('header'))
    const footers = patterns?.filter((p) => p?.slug?.includes('footer'))
    return { headers, footers }
}

const getTemplateParts = () =>
    api.get(window.extOnbData.wpRoot + 'wp/v2/template-parts')

export const getThemeVariations = async () => {
    const variations = await api.get(
        window.extOnbData.wpRoot +
            'wp/v2/global-styles/themes/extendable/variations',
    )
    if (!Array.isArray(variations)) {
        throw new Error('Could not get theme variations')
    }
    return { data: variations }
}

export const updateThemeVariation = (id, variation) =>
    api.post(`${window.extOnbData.wpRoot}wp/v2/global-styles/${id}`, {
        id,
        settings: variation.settings,
        styles: variation.styles,
    })

export const addLaunchPagesToNav = (
    pages,
    pageIds,
    rawCode,
    replace = null,
) => {
    if (!replace)
        replace =
            /(<!--\s*wp:navigation\b[^>]*>)([^]*?)(<!--\s*\/wp:navigation\s*-->)/gi
    const pageListItems = pages
        .filter((page) => Boolean(pageIds[page.slug]?.id))
        .filter(({ slug }) => slug !== 'home')
        .map((page) => {
            const { id, title, link, type } = pageIds[page.slug]
            return `<!-- wp:navigation-link { "label":"${title.rendered}", "type":"${type}", "id":"${id}", "url":"${link}", "kind":"post-type", "isTopLevelLink":true } /-->`
        })
        .join('')
    return rawCode.replace(replace, `$1${pageListItems}$3`)
}

export const getActivePlugins = () => api.get('onboarding/active-plugins')
