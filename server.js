const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001;
const massive = require('massive');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const axios = require('axios');
const config = require('./server/config');
const masterRoutes = require('./server/masterRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(session(config.session));
app.use("/", express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());

massive(config.postgres).then(db => {
    db.createUserTable();
    db.createCourtsTable();
    app.set('db', db)
});

masterRoutes(app);


passport.use(new GoogleStrategy( config.Strategy,
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            console.log("PRofil", profile)
            const db = app.get('db')
            db.findUser([profile.id])
                .then(users => {
                    if (users.length) {
                        return done(null, users[0])
                    }
                    let firstName, lastName, email, photo;
                    if (profile.name) {
                        firstName = profile.name.givenName
                        lastName = profile.name.familyName
                    }
                    if (profile.emails && profile.emails.length) {
                        email = profile.emails[0].value
                    }
                    if (profile.photos && profile.photos.length) {
                        photo = profile.photos[0].value
                    }
                    db.createUser([profile.id, profile.displayName, firstName, lastName, email, photo])
                        .then(newUsers => {
                            console.log(newUsers)
                            console.log(newUsers.length)
                            return done(null, newUsers[0])
                        })
                        .catch(err => {
                            return done(err)
                        })
                })
                .catch(err => {
                    return done(err)
                })
        })
    }));

app.get('/auth/google', passport.authenticate('google',
    {
        scope: ['profile', 'email']}
        ));

app.get('/auth/google/callback', passport.authenticate('google',

    {
        successRedirect: '/#!/',
        failureRedirect:' /auth/google'

    }),

    (req, res) => {
        res.redirect('/');
    });

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    // User.findById(id, (err, user) => {
    //     done(err, user);
    // })
    done(null, user)
});

app.get('/api/places', (req, res, next) => {
    axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDHB0MQwNOEwkkn9eq4svRDT2swYz0qPHo&type=park&radius=8000&name=basketball&location=' + req.query.lat + ',' + req.query.lng)
        .then(response => {
            return res.status(200).json(response.data)
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(err)
        })
})

app.get('/api/user', (req, res, next) => {
    return res.status(200).json(req.user)
});
app.listen(port, () => {
    console.log('server listening on port 3001');
});

