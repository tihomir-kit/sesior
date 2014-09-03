// Module dependencies
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');

var http = require('http');
var path = require('path');
var io = require('socket.io');

var app = express();
var server = http.createServer(app);
var ioServer = io.listen(server);

var redis = require('redis');
var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(session);
var redisStore = new RedisStore({ client: redisClient });

// Other
var config = require('./config');
var sessionService = require('./shared/session-service');
sessionService.initializeRedis(redisClient, redisStore);

// Socket route dependencies
var usersSocketRoute = require('./routes/users-socket');

// Enable CORS
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", config.allowedCORSOrigins);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
};

// All environments
app.set('port', process.env.PORT || config.serverPort);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.sessionSecret));
app.use(session({ store: redisStore, key: config.sessionCookieKey, secret: config.sessionSecret, resave: true, saveUninitialized: true }));
app.use(allowCrossDomain);

// Development only
if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler())
}

ioServer.use(function (socket, next) {
    var parseCookie = cookieParser(config.sessionSecret);
    var handshake = socket.request;

    parseCookie(handshake, null, function (err, data) {
        sessionService.get(handshake, function (err, session) {
            if (err)
                next(new Error(err.message));
            if (!session)
                next(new Error("Not authorized"));

            handshake.session = session;
            next();
        });
    });
});

// Initialize REST rotues
require('./shared/router')(app);

ioServer.sockets.on('connection', function (socket) {
    usersSocketRoute(socket);
});

server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
