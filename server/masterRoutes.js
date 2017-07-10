const loginRoute = require('./login/loginRoute');
const courtsRoute = require('./courts/courtsRoute');
const guestRoute = require('./guest/guestRoute');

module.exports = app => {
    loginRoute(app);
    courtsRoute(app);
    guestRoute(app);
};

