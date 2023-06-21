import { Axios as api } from './axios'

export const getTasks = () => api.get('assist/tasks')

export const getTaskData = () => api.get('assist/task-data')
export const saveTaskData = (data) => api.post('assist/task-data', { data })
export const completedDependency = (taskName) =>
    api.get('assist/tasks/dependency-completed', {
        params: { taskName },
    })

export const getTours = () => api.get('assist/tours')

export const getTourData = () => api.get('assist/tour-data')
export const saveTourData = (data) => api.post('assist/tour-data', { data })

export const getRouterData = () => api.get('assist/router-data')
export const saveRouterData = (data) => api.post('assist/router-data', { data })

export const getGlobalData = () => api.get('assist/global-data')
export const saveGlobalData = (data) => api.post('assist/global-data', { data })

export const getUserSelectionData = () => api.get('assist/user-selection-data')
export const saveUserSelectionData = (data) =>
    api.post('assist/user-selection-data', { data })

export const getQuickLinks = () => api.get('assist/quicklinks')

export const getRecommendations = () => api.get('assist/recommendations')

export const getRecommendationData = () => api.get('assist/recommendation-data')
export const saveRecommendationData = (data) =>
    api.post('assist/recommendation-data', { data })

export const getSupportArticlesData = () =>
    api.get('assist/support-articles-data')
export const saveSupportArticlesData = (data) =>
    api.post('assist/support-articles-data', { data })

export const getSupportArticles = () => api.get('assist/support-articles')

export const getSupportArticleCategories = () =>
    api.get('assist/support-article-categories')

export const getSupportArticle = (slug) =>
    api.get('assist/support-article', { params: { slug } })

export const getArticleRedirect = (path) =>
    api.get('assist/get-redirect', { params: { path } })

export const getRecommendationsBanner = () =>
    api.get('assist/recommendations-banner')

export const getSearchResults = (search, per_page = 10, offset = 0) =>
    api.get('assist/support-articles-search', {
        params: { search, per_page, offset },
    })
