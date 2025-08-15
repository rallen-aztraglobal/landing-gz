import { initGtag } from './utils.js'

let downloadUrl = ''

function getDownloadUrl() {
  fetch('/api/download/apk').then(async (res) => {
    const data = await res.json()
    downloadUrl = data.url
    if (downloadUrl.includes('gpgzmkk046')) {
      initGtag(() => {
        gtag('event', 'conversion', {
          allow_custom_scripts: true,
          u1: window.location.href,
          u2: document.referrer,
          send_to: 'DC-15643385/invmedia/bingo0+standard',
        })
      })
    }
    if (downloadUrl.includes('bpom3405')) {
      initGtag(() => {
        gtag('event', 'conversion', {
          allow_custom_scripts: true,
          u1: window.location.href,
          u2: document.referrer,
          send_to: 'DC-15643385/invmedia/bingo000+standard',
        })
      })
    }
  })
}

function handleDownloadApk() {
  if (downloadUrl.includes('gpgzmkk046')) {
    gtag('event', 'conversion', {
      allow_custom_scripts: true,
      u1: window.location.href,
      u2: document.referrer,
      send_to: 'DC-15643385/invmedia/bingo00+standard',
    })
  }
  if (downloadUrl.includes('bpom3405')) {
    gtag('event', 'conversion', {
      allow_custom_scripts: true,
      u1: window.location.href,
      u2: document.referrer,
      send_to: 'DC-15643385/invmedia/bingo001+standard',
    })
  }
  const a = document.createElement('a')
  // 直接访问 nginx 代理的固定路径
  a.href = downloadUrl
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
getDownloadUrl()
window.onload = function () {
  document.getElementById('download').addEventListener('click', handleDownloadApk)
}
