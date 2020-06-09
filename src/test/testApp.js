describe('Application', function () {

    var rootScope, scope, element, twitterApi;

    beforeEach(MockXMLHttpRequest.mock.setUp);
    afterEach(MockXMLHttpRequest.mock.tearDown);

    beforeEach(function () {
        spyOn(APP.API.prototype, 'getTimeLine').and.callThrough();
    });

    describe('logged out', function () {
        angular.module('test.twitter.logged.out', ['twitter'])
            .constant('username', '');

        beforeEach(module('test.twitter.logged.out'));
        beforeEach(inject(applicationInjector));

        it('recognises the user is not logged in', function () {
            expect(scope.loggedIn).toBe(false);
        });

        it('has not requested a timeline', function () {
            expect(twitterApi.getTimeLine).not.toHaveBeenCalled();
        });
    });

    describe('logged in', function () {
        angular.module('test.twitter.logged.in', ['twitter'])
            .constant('username', 'someUser');

        beforeEach(module('test.twitter.logged.in'));
        beforeEach(inject(applicationInjector));

        it('recognises the user is logged in', function () {
            expect(scope.loggedIn).toBe(true);
        });

        it('requested a timeline', function () {
            expect(twitterApi.getTimeLine).toHaveBeenCalled();
            expect(twitterApi.getTimeLine).toHaveBeenCalledWith(20, jasmine.any(Function));
            expect(scope.tweets).toBe(undefined);

            MockXMLHttpRequest.respondsWithJson([new Tweet('message')]);
            expect(scope.tweets.length).toBe(1);
            expect(scope.tweets[0]).toEqual(jasmine.objectContaining({text: 'message'}));
        });

        it('saves new tweets', function () {
            MockXMLHttpRequest.respondsWithJson([new Tweet('message')]);
            rootScope.$emit('tweet.new', new Tweet('another'));

            expect(scope.tweets).toEqual([
                jasmine.objectContaining({text: 'another'}),
                jasmine.objectContaining({text: 'message'})
            ]);
        });

        describe('timeline', function () {
            beforeEach(function () {
                MockXMLHttpRequest.respondsWithJson([
                    new Tweet('aaa aaa', 'FirstUser'),
                    new Tweet('bbb bbb', 'SecondUser')
                ]);
            });

            it('lists all tweets', function () {
                var tweets = element[0].querySelectorAll('.tweet');

                expect(tweets.length).toBe(2);
                expect(tweets[0].querySelector('[data-twitter-profile-link]').innerHTML).toBe('FirstUser');
                expect(tweets[1].querySelector('[data-twitter-profile-link]').innerHTML).toBe('SecondUser');
            });
        })
    });

    function applicationInjector ($rootScope, $compile, api) {
        rootScope = $rootScope;
        element = $compile('<div ng-controller="app">' +
                                '<section data-ng-if="loggedIn">' +
                                '<form data-update-status>' +
                                '<textarea maxlength="139" data-ng-model="status"></textarea>' +
                                '<button id="send-tweet" data-ng-click="send()">Tweet</button>' +
                                '<button data-ng-click="refreshTimeline()">Refresh Timeline</button>' +
                                '<em data-ng-if="refreshing">updating</em>' +
                                '</form>' +
                                '' +
                                '<ul class="timeline">' +
                                '<li data-ng-repeat="tweet in tweets" data-tweet-content class="tweet">' +
                                '<span class="" data-twitter-profile-picture></span>' +
                                '<span class="tweet-heading">' +
                                '<a data-twitter-profile-link data-ng-bind="tweet | screenNameFilter"></a>' +
                                '<em class="tweet-created-at" data-ng-bind="tweet.created_at | recencyFilter"></em>' +
                                '</span>' +
                                '<span class="tweet-content" data-ng-bind-html="content"></span>' +
                                '</li>' +
                                '</ul>' +
                                '</section>' +
                                '' +
                                '<div data-ng-if="!loggedIn">' +
                                '<a class="log-in" href="/auth/twitter">Sign In With Twitter</a>' +
                                '</div></div>'
                            )(rootScope);
        scope = angular.element(element).scope();
        twitterApi = api;
    }

    function Tweet (content, screenName) {
        this.text = content;
        this.user = {
            screen_name: screenName || 'screenName',
            profile_image_url: ''
        }
    }
});
