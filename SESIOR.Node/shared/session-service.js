var redisClient = null;
var redisStore = null;

module.exports = {
    initializeRedis: function (client, store) {
        redisClient = client;
        redisStore = store;
    },
    getSessionId: function (handshake) {
        return handshake.signedCookies["connect.sid"];
    },
    get: function (handshake, callback) {
        var sessionId = this.getSessionId(handshake);

        this.getSessionBySessionID(sessionId, function (err, session) {
            if (err) callback(err);
            if (callback != undefined)
                callback(null, session);
        });
    },
    getSessionBySessionID: function (sessionId, callback) {
        redisStore.load(sessionId, function (err, session) {
            if (err) callback(err);
            if (callback != undefined)
                callback(null, session);
        });
    },
    getUserName: function (handshake, callback) {
        this.get(handshake, function (err, session) {
            if (err) callback(err);
            if (session)
                callback(session.userName);
            else
                callback(null);
        });
    },
    updateSession: function (session, callback) {
        try {
            session.reload(function () {
                session.touch().save();
                callback(null, session);
            });
        }
        catch (err) {
            callback(err);
        }
    },
    setSessionProperty: function (session, propertyName, propertyValue, callback) {
        session[propertyName] = propertyValue;
        this.updateSession(session, callback);
    }
};