'use strict';

angular.module("SESIOR.SPA.services")
    .service("RouteService", function (CONFIG) {
        var self = this;

        function nodeUrl(route) {
            return CONFIG.NODE_URL + route;
        }

        this.node = {
            base: CONFIG.NODE_URL,
            verifySession: nodeUrl("verify-session"),
            register: nodeUrl("register")
        };
    });