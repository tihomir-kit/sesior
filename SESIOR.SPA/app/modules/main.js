'use strict';

angular.module("SESIOR.SPA.controllers")
    .controller("MainCtrl", function ($scope, UserService) {
        $scope.currentUser = UserService.currentUser;
        $scope.users = UserService.users;
        $scope.userName = "";

        $scope.register = function () {
            if ($scope.userName)
                UserService.registerUser($scope.userName);
            else
                console.log("Username must be entered");
        };

        $scope.rename = function () {
            if ($scope.userName)
                UserService.socketEmitRenameUser($scope.userName);
            else
                console.log("Username must be entered");
        };
    });
