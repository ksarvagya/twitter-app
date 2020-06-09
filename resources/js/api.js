(function (APP) {

    function API (screenName) {
        this._screenName = screenName;
    }

    API.prototype.getTimeLine = function (count, then) {
        this._request(
            'GET',
            '/api/1.1/statuses/home_timeline.json?count=' + count,
            null,
            function (err, result) {
                then(result || []);
            }
        );
    };

    API.prototype.createTweet = function (status, then) {
        this._request(
            'POST',
            '/api/1.1/statuses/update.json?status=' + encodeURIComponent(status),
            null,
            function (err, result) {
                then(result || []);
            }
        );
    };

    API.prototype._request = function (method, url, data, then) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var body = null;
                var success = xhr.status === 200;
                if (success) {
                    body = xhr.responseText;
                    if (xhr.getResponseHeader('Content-Type').indexOf('json') > 0) {
                        body = JSON.parse(body);
                    }
                    if (Array.isArray(body) && body.length === 1 && body[0].errors) {
                        success = body[0];
                        body = null;
                    }
                }
                else {
                    success = xhr.statusText;
                }

                then(success === true ? null : success, body);
            }
        };
        if (data) {
            data = JSON.stringify(data);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Content-Length', data.length);
        }
        xhr.send(data);
    };

    APP.API = API;

}(window.APP = window.APP || {}));
