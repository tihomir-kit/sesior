'use strict';

angular.module("SESIOR.SPA.controllers")
    .controller("MainCtrl", function ($scope, UserService) {
        $scope.currentUser = UserService.currentUser;
    });
