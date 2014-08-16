var socketService = require('../shared/socket-service');
var sessionService = require('../shared/session-service');
var membershipRoute = require('../routes/membership');

module.exports = function (socket) {
    socket.on("user:connected", function (userName, callback) {
        socketService.set(userName, socket);
        var user = membershipRoute.getUser(userName);
        socket.broadcast.emit("user:joined", user);
        var users = membershipRoute.getAllUsers();
        callback(null, users);
    });

    socket.on("user:rename", function (userName, callback) {
        sessionService.getUserName(socket.handshake, function (err, oldUserName) {
            sessionService.setSessionProperty(socket.handshake.session, "userName", userName, function (err, data) {
                if (err) {
                    callback(err);
                    return;
                }

                sessionService.getUserName(socket.handshake, function (err, newUserName) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    membershipRoute.renameUser(oldUserName, newUserName);
                    var user = membershipRoute.getUser(newUserName);
                    var data = { oldUserName: oldUserName, user: user };

                    socket.broadcast.emit("user:renamed", data);
                    callback(null, data);
                });
            });
        });
    });

    socket.on("disconnect", function () {
        sessionService.getUserName(socket.handshake, function (err, currentUserName) {
            if (!err) {
                socket.broadcast.emit("user:left", currentUserName);
                membershipRoute.unregister(currentUserName);
                socketService.remove(currentUserName);
            }
            else
                console.log(err);
        });
    });
};