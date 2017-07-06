const courtCtr = require('./courtsCtrl');

module.exports = app => {
    app.post('api/emails', courtCtr.postCourtsToDatabase)
}