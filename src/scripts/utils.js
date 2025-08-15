export function getQueryParams(key) {
  const params = {}
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

export function initGtag(callback) {
  const trackingId = 'DC-15643385'
  // 如果已经初始化过，直接调用回调
  if (window.gtag && typeof window.gtag === 'function') {
    callback && callback()
    return
  }
  // 动态加载 gtag.js
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`
  script.onload = () => {
    // 初始化 dataLayer 和 gtag
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', trackingId)
    console.log(`✅ gtag init: ${trackingId}`)
    callback && callback()
  }
  script.onerror = () => {
    console.error(`❌ gtag.js loading error: ${trackingId}`)
  }
  document.head.appendChild(script)
}
