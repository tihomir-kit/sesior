var routes = require('../routes');

module.exports = function (app) {
    // INDEX
    app.get("/", routes.index);
}