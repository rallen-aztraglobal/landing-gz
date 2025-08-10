import QRCode from 'qrcode'

function handleDownloadApk() {
  const a = document.createElement('a')
  a.href = window.downloadUrl
  // a.download = 'app.apk'; // 下载文件名
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

window.onload = function () {
  const canvas = document.getElementById('qrcode')
  QRCode.toCanvas(canvas, window.location.href,    {
    margin: 1 // 控制白边宽度（单位是模块数，默认是 4）
  },function (error) {
    if (error) console.error(error)
  })
  document.getElementById('download').addEventListener('click', handleDownloadApk)
}
