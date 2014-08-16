var socketService = require('../shared/socket-service');

var users = {};

var self = module.exports = {
    verifySession: function (req, res) {
        var userName = req.session.userName;

        if (userName && !users[userName]) {
            users[userName] = { userName: userName };
            res.send({ sessionVerified: true, user: users[userName] });
        }
        else {
            if (users[userName])
                req.session.UserName = "";
            res.send({ sessionVerified: false });
        }
    },
    register: function (req, res) {
        var userName = req.body.userName;

        if (users[userName])
            res.send({ membershipResolved: false, error: "User already exists" });;

        users[userName] = { userName: userName };
        req.session.userName = userName;
        res.send({ membershipResolved: true, user: users[userName] });
    },
    unregister: function (userName) {
        delete users[userName];
    },
    getUser: function (userName) {
        return users[userName];
    },
    getAllUsers: function () {
        return users;
    },
    renameUser: function (oldUserName, newUserName) {
        var user = self.getUser(oldUserName);
        user.userName = newUserName;
        users[newUserName] = user;
        self.unregister(oldUserName);
    }
};