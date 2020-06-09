
angular.module('twitter', ['ngSanitize']);

angular.module('twitter').factory('api', function (username) {
    return new APP.API(username);
});

angular.module('twitter').config(function () {
});

angular.module('twitter').controller('app', function (api, username, $scope, $element) {
    if ($scope.loggedIn = !!username) {

        $scope.$root.$on('tweet.new', function (e, tweet) {
            $scope.tweets.unshift(tweet);
            $scope.$digest();
        });

        $scope.refreshTimeline = function () {
            $scope.refreshing = true;

            api.getTimeLine(20, function (tweets) {
                $scope.refreshing = false;
                $scope.tweets = tweets;
                $scope.$digest();
            });
        };

        $scope.refreshTimeline();
    }
});

angular.module('twitter').filter('screenNameFilter', function () {
    return function (tweet) {
      return tweet.user.screen_name
    };
});

angular.module('twitter').filter('recencyFilter', function () {
    return function (date) {
      return moment(new Date(date)).fromNow();
    };
});

angular.module('twitter').directive('tweetContent', function ($sanitize) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope) {
            scope.content = $sanitize(scope.tweet.text);
            scope.profileUrl = '//twitter.com/' + scope.tweet.user.screen_name;
        }
    };
});

angular.module('twitter').directive('twitterProfileLink', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr, controller) {
            element
                .attr('href', '//twitter.com/' + scope.tweet.user.screen_name)
                .attr('title', '@' + scope.tweet.user.screen_name);
        }
    };
});

angular.module('twitter').directive('twitterProfilePicture', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr, controller) {
            element
                .addClass('profile-picture')
                .css('background-image', 'url(' + scope.tweet.user.profile_image_url + ')');
        }
    };
});

angular.module('twitter').directive('updateStatus', function (api) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, e, a) {
            scope.send = function () {
                if (scope.status) {
                    api.createTweet(scope.status, function (tweet) {
                        scope.status = '';
                        scope.$root.$emit('tweet.new', tweet);
                    });
                }
            }
        }
    };
});

