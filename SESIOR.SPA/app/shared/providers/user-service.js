'use strict';

angular.module("SESIOR.SPA.services")
    .service("UserService", function ($http, SocketIoFactory, RouteService) {
        // TODO: make "withCredentials" generic for all calls
        var self = this;

        this.userCredentials = {
            userName: "",
            password: ""
        };

        this.currentUser = {
            userName: "",
            isAvailableForDuel: false
        };

        this.users = {};
        this.userCount = { value: 0 };

        function initializeCurrentUser(user) {
            self.currentUser.userName = user.id;
            self.currentUser.isAvailableForDuel = user.isAvailableForDuel;
            self.addUser(user);
        }

        function initializeSocketIo(user) {
            SocketIoFactory.connect();
            //registerSocketOnError();
            //registerSocketInitUsers();
            //registerSocketUserJoined();
            //registerSocketUserLeft();
            //socketEmitAuthorizedUser(user.id);
        }

        this.initializeUsers = function (users) {
            angular.forEach(users, function (user, index) {
                self.addUser(user);
            });
        };

        this.addUser = function (user) {
            self.users[user.userName] = user;
            self.userCount.value++;
        };

        this.removeUser = function (userName) {
            delete self.users[userName];
        };

        this.verifySession = function () {
            $http.get(RouteService.node.verifySession, { withCredentials: true })
                .success(function (data) {
                    if (data.sessionVerified) {
                        initializeCurrentUser(data.user);
                        initializeSocketIo(data.user);
                    }
                });

                // TODO: handle onError on all http calls
        };

        this.loginUser = function (callback) {
            resolveMembership(RouteService.node.login, callback);
        };

        this.registerUser = function (callback) {
            resolveMembership(RouteService.node.register, callback);
        };

        this.logoutUser = function (callback) {
            $http.post(RouteService.node.logout, { userName: self.currentUser.userName }, { withCredentials: true })
                .success(function (loggedOut) {
                    console.log(loggedOut);
                    if (loggedOut) {
                        resetCurrentUser();
                    }
                    else {
                        ErrorService.addError("Could not log out, please try again");
                    }
                    callback(loggedOut);
                })
                .error(function (error) {
                    console.log(error);
                });;
        };

        function resolveMembership(route, callback) {
            ErrorService.clearErrors();

            $http.post(route, { credentials: self.userCredentials }, { withCredentials: true })
                .success(function (data) {
                    if (data.membershipResolved) {
                        initializeCurrentUser(data.user);
                        initializeSocketIo(data.user);
                        resetUserCredentials();
                    }
                    else {
                        ErrorService.addError(data.error);
                    }

                    callback(data.membershipResolved);
                });
        }

        function resetUserCredentials() {
            self.userCredentials = {
                userName: "",
                password: ""
            }
        }

        function resetCurrentUser() {
            self.currentUser.userName = "";
            self.currentUser.isAvailableForDuel = false;
        }

        function socketEmitAuthorizedUser(userName) {
            SocketIoFactory.emit("user:authorized", userName, function (error) {
                if (error)
                    ErrorService.addError(error);
            });
        }

        this.toggleAvailability = function () {
            $http.get(RouteService.node.toggleAvailability, { withCredentials: true })
                .success(function (data) {
                    if (data.error)
                        ErrorService.addError(data.error);
                    else
                        self.currentUser.isAvailableForDuel = data.isAvailableForDuel;
                });
        };


        // Socket.IO callback registrations
        function registerSocketOnError() {
            SocketIoFactory.on('error', function (error) {
                ErrorService.addError(error);
            });
        }

        function registerSocketInitUsers() {
            SocketIoFactory.on("users:init", function (data) {
                self.initializeUsers(data.users);
            });
        }

        function registerSocketUserJoined() {
            SocketIoFactory.on("user:joined", function (user) {
                self.addUser(user);
            });
        };

        function registerSocketUserLeft() {
            SocketIoFactory.on("user:left", function (userName) {
                self.removeUser(userName);
            });
        };
    });