
function MockXMLHttpRequest () {
    this.__headers = {};

    this.open = jasmine.createSpy();
    this.setRequestHeader = jasmine.createSpy();
    this.send = jasmine.createSpy();

    spyOn(this, 'getResponseHeader').and.callThrough();
}

MockXMLHttpRequest.prototype.getResponseHeader = function (name) {
    return this.__headers[name];
};

MockXMLHttpRequest.setResponseHeader = function (header, value) {
    MockXMLHttpRequest.mock.instance.__headers[header] = value;
};

MockXMLHttpRequest.respondsWith = function (status, data) {
    var xhr = MockXMLHttpRequest.mock.instance;

    if (!xhr.onreadystatechange) {
        throw "XMLHttpRequest has no readyState handler";
    }

    xhr.readyState = 4;
    xhr.statusCode = xhr.status = status;
    xhr.statusText = 'status: ' + status;
    xhr.responseText = data;

    xhr.onreadystatechange()
};

MockXMLHttpRequest.respondsWithJson = function (data) {
    var instance = MockXMLHttpRequest.mock.instance;

    instance.__headers['Content-Type'] = instance.__headers['Content-Type'] || 'application/json';
    MockXMLHttpRequest.respondsWith(200, JSON.stringify(data));
};

MockXMLHttpRequest.mock = function () {
    var XMLHttpRequest;
    var bound = 'open send getResponseHeader setRequestHeader'.split(' ');

    return {
        setUp: function () {
            XMLHttpRequest = window.XMLHttpRequest;
            window.XMLHttpRequest = jasmine.createSpy().and.callFake(function () {
                var instance = MockXMLHttpRequest.mock.instance = new MockXMLHttpRequest;
                bound.forEach(function (func) {
                    MockXMLHttpRequest[func] = instance[func];
                });
                return instance;
            });
        },
        tearDown: function () {
            bound.forEach(function (func) {
                delete MockXMLHttpRequest[func];
            });
            delete MockXMLHttpRequest.mock.instance;
            window.XMLHttpRequest = XMLHttpRequest;
        }
    }
}();
