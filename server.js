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
    db.createCourtPlayers();
    app.set('db', db)
});

masterRoutes(app);


passport.use(new GoogleStrategy( config.Strategy,
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            console.log("PRofil", profile);
            const db = app.get('db');
            db.findUser([profile.id])
                .then(users => {
                    if (users.length) {
                        return done(null, users[0])
                    }
                    let firstName, lastName, email, photo;
                    if (profile.name) {
                        firstName = profile.name.givenName;
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
                            console.log(newUsers);
                            console.log(newUsers.length);
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
    done(null, user)
});


app.get('/api/places', (req, res) => {
    axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDHB0MQwNOEwkkn9eq4svRDT2swYz0qPHo&type=park&radius=8000&name=basketball&location=' + req.query.lat + ',' + req.query.lng)
        .then(response => {
            var db = req.app.get('db')

            return Promise.all(response.data.results.map(result => {
                return db.run('SELECT id FROM courts WHERE google_id = $1', [result.id])
                    .then (existingCourts => {
                        if (!existingCourts.length) {
                            result.count = 0
                            return db.run('INSERT INTO courts (google_id, court_name, address) VALUES ($1, $2, $3);', [result.id, result.name, result.vicinity])
                                .then(results => {
                                    console.log(results)
                                    return result
                                })

                        } else {
                            console.log(existingCourts[0])
                            return db.run('select count(distinct user_id) from court_players where court_id = $1', [existingCourts[0].id])
                                .then(results => {
                                    console.log(results)
                                    result.count = results[0].count
                                    return result
                                })
                        }
                    })

            }))
            .then(results => {
                return res.status(200).json(results)
            })

        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(err)
        })
});

app.get('/api/user', (req, res) => {
    return res.status(200).json(req.user)
});

app.post('/api/court_player', (req, res) => {

    var db = req.app.get('db')
    db.run('select id from courts where google_id = $1', [req.body.google_id])
        .then(courts => {
            if (!courts.length) {
               return res.status(500).json("No court with that id")
            }
            var court_id = courts[0].id;
            return court_id
        })
        .then(court_id => {
            console.log(court_id);
            if (req.body.user_id)
            db.run('insert into court_players (user_id, court_id) values ($1, $2);', [req.body.user_id, court_id])
                .then(response => {
                    console.log(response);
                    return res.status(200).json("Yay")
                })
        })
    // To do all of this, you need a court_players table (id, user_id, court_id)
    // When a user clicks on a court, pass the user id and the court_id to this endpoint (as req.body)
    // Look for the id of the court by court_id (SELECT id from courts where court_id = req.body.court_id)
    // Insert the user into the court_players table with the court_id

});

app.delete('/api/remove_player/:google_id/:user_id', (req, res) => {
    console.log(req.params.google_id)
    let db = req.app.get('db');
    db.run('SELECT id from courts WHERE google_id = $1', [req.params.google_id])
        .then(courts => {
            if (!courts.length) {
                return res.status(500).json('no courts with that id');
            }
            let court_id = courts[0].id;
            return court_id;
        })
        .then(() => {
            if (req.params.user_id){
                db.run('DELETE FROM court_players WHERE user_id  = $1', [req.params.user_id])
                    .then(response => {
                        console.log(response);
                        return res.status(200).json('user was removed from courts+players table');
                    })
            }
        })

});


app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});

