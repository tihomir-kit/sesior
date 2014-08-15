// Module dependencies
var express = require('express');

var http = require('http');
var path = require('path');
var io = require('socket.io');

var app = express();
var server = http.createServer(app);
var ioServer = io.listen(server);

// Upon upgrading express to 4.x, connect-redis session handling will need to 
// get some refactoring (session => express-session etc.)
var redis = require('redis');
var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(express);
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
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.sessionSecret));
app.use(express.session({ store: redisStore, key: config.sessionCookieKey, secret: config.sessionSecret }));
app.use(allowCrossDomain);
app.use(app.router);

// Development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

ioServer.configure(function () {
    var parseCookie = express.cookieParser(config.sessionSecret);

    ioServer.set('authorization', function (handshake, callback) {
        parseCookie(handshake, null, function (err, data) {
            sessionService.get(handshake, function (err, session) {
                if (err)
                    return callback(err.message, false);
                if (!session)
                    return callback("Not authorized", false);

                handshake.session = session;
                callback(null, true);
            });
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