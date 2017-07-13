const googleCtrl = require('./googleCtrl');

module.exports = app => {
    app.get('/api/places', googleCtrl.getPlaces);
}