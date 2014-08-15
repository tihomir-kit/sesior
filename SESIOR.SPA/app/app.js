'use strict';

angular.module("SESIOR.SPA", [
    "ngCookies",
    "ngResource",
    "ngSanitize",
    "ngRoute",
    "btford.socket-io",
    "SESIOR.SPA.services",
    "SESIOR.SPA.controllers"
]);

angular.module("SESIOR.SPA.services", []);
angular.module("SESIOR.SPA.controllers", []);

angular.module("SESIOR.SPA").config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./modules/main.tpl.html"
        })
        .otherwise({
            redirectTo: "/"
        });
});