function ajax({ url, method = 'GET', data = null, headers = {}, timeout = 10000 }) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        method = method.toUpperCase();

        // 处理 GET 请求参数拼接
        if (method === 'GET' && data && typeof data === 'object') {
            const params = new URLSearchParams(data).toString();
            url += (url.includes('?') ? '&' : '?') + params;
            data = null; // GET 请求不需要请求体
        }

        xhr.open(method, url, true);
        xhr.timeout = timeout; // 设置超时时间

        // 设置请求头
        for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        // 监听状态变化
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: xhr.responseText,
                    });
                }
            }
        };

        // 监听错误
        xhr.onerror = function () {
            reject({ status: 0, statusText: 'Network Error' });
        };

        // 监听超时
        xhr.ontimeout = function () {
            reject({ status: 0, statusText: 'Request timed out' });
        };

        // 处理请求体
        if (data) {
            if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                data = new URLSearchParams(data).toString();
            } else if (typeof data === 'object' && !(data instanceof FormData)) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                data = JSON.stringify(data);
            }
        }

        xhr.send(data);
    });
}
//# sourceMappingURL=ajax.js.map
