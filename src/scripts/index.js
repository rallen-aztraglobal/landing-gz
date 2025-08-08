


function handleDownloadApk () {
    const a = document.createElement('a');
    a.href = window.downloadUrl;
    // a.download = 'app.apk'; // 下载文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

window.onload = function() {
    new QRious({
        element: document.getElementById("qrcode"),
        value: window.location.href,
        size: 200,
    });
};