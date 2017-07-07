const courtCtrl = require('./courtsCtrl');

module.exports = app => {
    app.post('api/courts', courtCtrl.postCourtsToDatabase)
};