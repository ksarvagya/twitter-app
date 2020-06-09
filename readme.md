
## Example usage of the Twitter rest API.
 
Features of the application:

* Sign-in
* View home timeline (up to 20 tweets), each tweet in the home timeline displays: 
  * the tweet contents (links, Twitter handles and hashtags not clickable)
  * the name, profile image and Twitter handle of the user who posted the tweet
  * the age of the post
* Refresh home timeline (again limiting subsequent results to 20 tweets)
* Post a status update (tweet) with text 
* After posting a tweet, the home timeline should be displayed to the user and the tweet should immediately appear.


## How to run it

* Clone the repo
* Create a `properties.json` file at the root of the repo that contains values for:
  * `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET` from the [apps.twitter.com](https://apps.twitter.com/) site
  * `TWITTER_CALLBACK_URL` the absolute URL to use when twitter redirects after a successful authentication
  * `SERVER_PORT` the numeric port number to run the server on
* Install the [npm](http://npmjs.org) dependencies with `npm install` from the root of the project 
* Run with `node src/main/server` or from the root of the project as `npm start`

## Notes

This is a development project and does not account for many error cases, the session management doesn't account for
running more than one process or clearing memory as sessions expire and exceptions will kill the process.

The angular.js based tests duplicate the content of the main page, which should be refactored to use
[grunt-angular-templates](https://www.npmjs.com/package/grunt-angular-templates) to prevent duplication.

## Licence

MIT
