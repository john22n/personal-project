const loginRoute = require('./login/loginRoute');
const courtsRoute = require('./courts/courtsRoute');
const guestRoute = require('./guest/guestRoute');
const googleRoute = require('./googleMaps/googleRoutes');
const playerRoute = require('./courtPlayers/playerRoute');

module.exports = app => {
    loginRoute(app);
    courtsRoute(app);
    guestRoute(app);
    googleRoute(app);
    playerRoute(app);
};

