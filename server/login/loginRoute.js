const loginCtrl = require('./loginCtrl');

module.exports = app => {
    app.get('/api/isLoggedin', loginCtrl.login);
};