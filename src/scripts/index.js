import QRCode from 'qrcode'
import { initGtag } from './utils.js'

function handleDownloadApk() {
  gtag('event', 'conversion', {
    allow_custom_scripts: true,
    u1: window.location.href,
    u2: document.referrer,
    send_to: 'DC-15643385/invmedia/bingo00+standard',
  })
  console.log("✅ download  bingo00+standard")
  fetch('/api/download/apk').then(async (res) => {
    const data = await res.json()
    const a = document.createElement('a')
    // 直接访问 nginx 代理的固定路径
    a.href = data.url
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  })
}

window.onload = function () {
  gtag('event', 'conversion', {
    allow_custom_scripts: true,
    u1: window.location.href,
    u2: document.referrer,
    send_to: 'DC-15643385/invmedia/bingo0+standard',
  })
  console.log("✅ PV  bingo0+standard")
  const canvas = document.getElementById('qrcode')
  QRCode.toCanvas(
    canvas,
    window.location.href,
    {
      margin: 1, // 控制白边宽度（单位是模块数，默认是 4）
    },
    function (error) {
      if (error) console.error(error)
    },
  )
  document.getElementById('download').addEventListener('click', handleDownloadApk)
  QRCode.toCanvas(
    canvas,
    window.location.href,
    {
      margin: 1, // 控制白边宽度（单位是模块数，默认是 4）
    },
    function (error) {
      if (error) console.error(error)
    },
  )
  document.getElementById('download').addEventListener('click', handleDownloadApk)
}
