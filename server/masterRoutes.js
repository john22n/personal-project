const loginRoute = require('./login/loginRoute');
const courtsRoute = require('./courts/courtsRoute');

module.exports = app => {
    loginRoute(app);
    courtsRoute(app);
};

