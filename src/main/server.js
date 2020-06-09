
var properties = require('../../properties.json');

var users = {};
var express = require('express');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var TWITTER_CONSUMER_KEY = properties.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = properties.TWITTER_CONSUMER_SECRET;

var app = express();

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    rolling: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, users[id]);
});
passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: properties.TWITTER_CALLBACK_URL
    },
    function(token, tokenSecret, profile, done) {
        var user = users[profile.id] || (users[profile.id] = {id: profile.id});
        user.token = token;
        user.token_secret = tokenSecret;
        user.username = profile.username;
        user.displayName = profile.displayName;

        console.log('Logged In', user);
        done(null, user);
    }
));

app.set('views', require('path').join(__dirname, '../../resources'));
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);

app.use(require('morgan')('dev'));
app.use(require('errorhandler')({log: true}));
app.use(require('less-middleware')(app.get('views')));
app.use(express.static(app.get('views'), {} ));

app.use(function (req, res, next) {
    var user = req.user;

    res.locals.user = user;
    res.locals.loggedIn = !!user;

    if (user) {
        var request = require('request');
        var oauth = {
            consumer_key: TWITTER_CONSUMER_KEY,
            consumer_secret: TWITTER_CONSUMER_SECRET,
            token: user.token,
            token_secret: user.token_secret
        };
        var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
        var qs = {
            screen_name: user.username,
            user_id: user.id,
            count: 20
        };

        request.get({url:url, oauth:oauth, qs:qs, json:true}, function (error, response, body) {
            res.locals.tweets = body;
            next();
        });
    }
    else {
        next();
    }
});

function render(viewName) {
    return function (req, res) {
        res.render(viewName);
    };
}

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/?login-failed' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/', render('index'));
app.get('/login', render('login'));

app.use('/api', require('body-parser').json({}), function (req, res, next) {
    var user = req.user;
    var method = req.method;

    var request = require('request');
    var oauth = {
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET,
        token: user.token,
        token_secret: user.token_secret
    };
    var url = 'https://api.twitter.com' + req.url;

    var options = {
        method: method,
        url: url,
        oauth: oauth,
        qs: method === 'GET' ? req.body : null,
        data: method !== 'GET' ? req.body : null,
        json: true
    };

    console.log(options);

    request(options, function (error, response, body) {
        res.send(body);
    });
});

app.listen(properties.SERVER_PORT);

