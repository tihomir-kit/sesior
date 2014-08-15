var socketService = require('../shared/socket-service');
var sessionService = require('../shared/session-service');

module.exports = function (socket) {
    socket.on("user:authorized", function (userName, callback) {
        socketService.set(userName, socket);

        var user = userProfileService.get(userName)
            .then(function (userProfile) {
                socket.broadcast.emit("user:joined", userProfile);
                return userProfileService.getAll(); // TODO: switch to all available for duel
            })
            .then(function (userProfiles) {
                socket.emit("users:init", { users: userProfiles.item });
                callback(null);
            })
            .fail(callback);
    });

    socket.on("disconnect", function () {
        sessionService.getUserName(socket.handshake, function (currentUserName) {
            // TODO: update userProfile.isAvailableForChallenge
            // TODO: remove duel for challengee
            socket.broadcast.emit("user:left", currentUserName);
        });
    });
};