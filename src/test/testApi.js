
describe('API', function () {

    var callback;

    beforeEach(MockXMLHttpRequest.mock.setUp);
    afterEach(MockXMLHttpRequest.mock.tearDown);

    beforeEach(function () {
        callback = jasmine.createSpy();
    });

    it('exists', function () {
        expect(APP.API).not.toBe(undefined);
        expect(new APP.API().constructor).toBe(APP.API);
    });

    describe('fetching a timeline', function () {
        it('sets the correct item count', function () {
            new APP.API('someScreenName').getTimeLine(400, jasmine.createSpy());

            expect(MockXMLHttpRequest.open).toHaveBeenCalledWith(
                'GET', '/api/1.1/statuses/home_timeline.json?count=400', true
            );
        });

        it('responds to the caller', function () {
            new APP.API('someScreenName').getTimeLine(400, callback);
            expect(callback).not.toHaveBeenCalled();

            MockXMLHttpRequest.respondsWithJson([
                {tweet: 1},
                {tweet: 2}
            ]);
            expect(callback).toHaveBeenCalledWith([
                {tweet: 1},
                {tweet: 2}
            ]);
        });

        it('ignores errors', function () {
            new APP.API('someScreenName').getTimeLine(400, callback);
            expect(callback).not.toHaveBeenCalled();

            MockXMLHttpRequest.respondsWithJson([
                {errors: ['something']}
            ]);
            expect(callback).toHaveBeenCalledWith([]);
        });
    });


    describe('posting a tweet', function () {
        it('sets the correct item count', function () {
            new APP.API('someScreenName').createTweet('tweet content', jasmine.createSpy());

            expect(MockXMLHttpRequest.open).toHaveBeenCalledWith(
                'POST', '/api/1.1/statuses/update.json?status=tweet%20content', true
            );
        });

        it('responds to the caller', function () {
            new APP.API('someScreenName').createTweet('tweet content', callback);
            expect(callback).not.toHaveBeenCalled();

            MockXMLHttpRequest.respondsWithJson({tweet: 1});
            expect(callback).toHaveBeenCalledWith({tweet: 1});
        });
    });




});
