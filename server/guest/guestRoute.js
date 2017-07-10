const guestCtrl = require('./guestCtrl');

module.exports = app => {
    app.post('/api/guest', guestCtrl.getGuest)
};