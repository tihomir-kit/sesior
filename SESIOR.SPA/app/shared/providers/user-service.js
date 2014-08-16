'use strict';

angular.module("SESIOR.SPA.services")
    .service("UserService", function ($http, SocketIoFactory, RouteService) {
        var self = this;

        this.users = {};
        this.currentUser = {
            userName: ""
        };

        function initializeSocketIo(user) {
            SocketIoFactory.connect();
            registerSocketInitUsers();
            registerSocketUserJoined();
            registerSocketUserRenamed();
            registerSocketUserLeft();
            socketEmitUserConnected(user.userName);
        }

        function initializeCurrentUser(user) {
            self.currentUser.userName = user.userName;
            self.addUser(user);
        }

        this.initializeUsers = function (users) {
            angular.forEach(users, function (user) {
                self.addUser(user);
            });
        };

        this.addUser = function (user) {
            self.users[user.userName] = user;
        };

        this.removeUser = function (userName) {
            delete self.users[userName];
        };

        this.verifySession = function () {
            $http.get(RouteService.node.verifySession, { withCredentials: true })
                .success(function (data) {
                    if (data.sessionVerified) {
                        initializeSocketIo(data.user);
                        initializeCurrentUser(data.user);
                    }
                })
                .error(function () {
                    console.log("An error occured while trying verify session");
                });
        };

        this.registerUser = function (userName) {
            $http.post(RouteService.node.register, { userName: userName }, { withCredentials: true })
                .success(function (data) {
                    if (data.membershipResolved) {
                        initializeSocketIo(data.user);
                        initializeCurrentUser(data.user);
                    }
                    else {
                        console.log(error);
                    }
                })
                .error(function () {
                    console.log("An error occured while trying to register " + userName);
                });
        };

        function socketEmitUserConnected(userName) {
            SocketIoFactory.emit("user:connected", userName, function (error, users) {
                if (!error)
                    self.initializeUsers(users);
                else
                    console.log(error);
            });
        }

        this.socketEmitRenameUser = function (userName) {
            SocketIoFactory.emit("user:rename", userName, function (error, data) {
                if (!error) {
                    initializeCurrentUser(data.user);
                    self.removeUser(data.oldUserName);
                }
                else
                    console.log(error);
            });
        };

        // Socket.IO callback registrations
        function registerSocketInitUsers() {
            SocketIoFactory.on("users:init", function (users) {
                self.initializeUsers(users);
            });
        }

        function registerSocketUserJoined() {
            SocketIoFactory.on("user:joined", function (user) {
                self.addUser(user);
            });
        };

        function registerSocketUserRenamed() {
            SocketIoFactory.on("user:renamed", function (data) {
                self.removeUser(data.oldUserName);
                self.addUser(data.user);
            });
        };

        function registerSocketUserLeft() {
            SocketIoFactory.on("user:left", function (userName) {
                self.removeUser(userName);
            });
        };
    });