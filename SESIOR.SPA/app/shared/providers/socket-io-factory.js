'use strict';

angular.module("SESIOR.SPA.services")
    .factory("SocketIoFactory", function ($rootScope, RouteService) {
        var socket = null;
        var listeners = [];

        function listenerExists(eventName) {
            return socket.hasOwnProperty("$events") && socket.$events.hasOwnProperty(eventName);
        }

        return {
            connect: function () {
                socket = io.connect(RouteService.node.base);
            },
            connected: function () {
                return socket != null;
            },
            on: function (eventName, callback) {
                if (!listenerExists(eventName)) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                }
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
            // TODO: handle destroy
            // http://stackoverflow.com/questions/14389049/improve-this-angularjs-factory-to-use-with-socket-io
        };
    });