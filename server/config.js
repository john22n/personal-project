module.exports = {
    session: {
        secret: 'johnN',
        resave: false,
        saveUninitialized: false
    },
    postgres: 'postgres://JohnNoriega22@localhost/personal_project',
    Strategy: {
        clientID: '453867307447-h1h31ucg6cmdtiibdohumkbmkdanvq8v.apps.googleusercontent.com',
        clientSecret: 'mgs00NihP0dBUxu_5SSkGFzZ',
        callbackURL: 'http://localhost:3001/auth/google/callback/',
    }
};