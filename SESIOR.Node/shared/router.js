var routes = require('../routes');
var membershipRoute = require('../routes/membership');

module.exports = function (app) {
    // INDEX
    app.get("/", routes.index);

    // MEMBERSHIP
    app.post("/register", membershipRoute.register);
    app.get("/verify-session", membershipRoute.verifySession);
}