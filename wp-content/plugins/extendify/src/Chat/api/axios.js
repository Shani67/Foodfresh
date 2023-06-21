import axios from 'axios'

const Axios = axios.create({
    baseURL: window.extChatData.root,
    headers: {
        'X-WP-Nonce': window.extChatData.nonce,
        'X-Requested-With': 'XMLHttpRequest',
        'X-Extendify-Chat': true,
        'X-Extendify': true,
    },
})

Axios.interceptors.response.use((response) =>
    Object.prototype.hasOwnProperty.call(response, 'data')
        ? response.data
        : response,
)

export { Axios }
