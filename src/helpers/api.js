import AppConfig from '@/constants/AppConfig'
import { store } from '../store/store'

export async function call(endpoint, params = {}, method = 'GET', token) {
    let body = null
    let query = ''
    if (method === 'POST' || method === 'PUT') {
        body = JSON.stringify(params)
    } else {
        const parts = []
        for (const k of Object.keys(params)) {
            parts.push(`${k}=${encodeURIComponent(params[k])}`)
        }
        query = parts.join('&')
    }

    const opts = {
        headers: new Headers({
            Authorization: 'Bearer ' + (token || store.getters.token),
            'content-type': 'application/json',
        }),
        method,
        body,
    }

    const url = query ? `${AppConfig.baseURI}${endpoint}?${query}` : `${AppConfig.baseURI}${endpoint}`
    const res = await fetch(url, opts)
    const json = await res.json()
    if (res.status >= 400) {
        if (json && (json.errors && json.errors.length)) {
            throw json.errors[0].message
        } else {
            throw json.message
        }
    }
    return json
}
