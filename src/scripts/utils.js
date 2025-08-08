
function getQueryParams(key) {
    const params= {}
    const queryString = window.location.href.split('?')[1] || ''
    const pairs = queryString.split('&')
    pairs.forEach((pair) => {
        const [key, value] = pair.split('=')
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '')
        }
    })
    return params[key] || ''
}