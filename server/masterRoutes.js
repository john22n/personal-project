const loginRoute = require('./login/loginRoute');
module.exports = app => {
    loginRoute(app);
};

