const playerCtrl = require('./playerCtrl');

module.exports = app => {
    app.post('/api/court_player', playerCtrl.postPlayer);
    app.delete('/api/remove_player/:google_id/:user_id', playerCtrl.removePlayer);
};