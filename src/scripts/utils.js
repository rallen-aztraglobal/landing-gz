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
    // 把初始化脚本插入到 body 最前面
    const inlineScript = document.createElement('script')
    inlineScript.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${trackingId}');
    `
    document.body.insertBefore(inlineScript, document.body.firstChild)

    console.log(`✅ gtag init injected: ${trackingId}`)
    callback && callback()
  }
  script.onerror = () => {
    console.error(`❌ gtag.js loading error: ${trackingId}`)
  }
  document.head.appendChild(script)
}
