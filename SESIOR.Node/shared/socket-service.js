var sockets = {};

module.exports = {
    get: function (userName) {
        return sockets[userName];
    },
    set: function (userName, socket) {
        sockets[userName] = socket;
    },
    remove: function (userName) {
        delete sockets[userName];
    }
};