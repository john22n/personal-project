
require('dotenv').config();
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001;
const massive = require('massive');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const moment = require('moment');
const config = require('./server/config');
const masterRoutes = require('./server/masterRoutes');

const app = express();
const httpServer = require('http').Server(app); //features
const io = require('socket.io')(httpServer);


app.use(cors());
app.use(bodyParser.json());
app.use(session(config.session));
app.use("/", express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());

massive(process.env.DATABASE_URL).then(db => {
    db.createUserTable();
    db.createCourtsTable();
    db.createCourtPlayers();
    app.set('db', db)
});

masterRoutes(app);


passport.use(new GoogleStrategy(config.Strategy,
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            // console.log("PRofil", profile);
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
                            // console.log(newUsers);
                            // console.log(newUsers.length);
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
        scope: ['profile', 'email']
    }
));

app.get('/auth/google/callback', passport.authenticate('google',

    {
        successRedirect: '/#!/',
        failureRedirect: ' /auth/google'

    }));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user)
});

//coms with socket.io

const users = [];
const messages = [];

io.on('connection', socket => {
    // Receive new socket and give users and messages to socket
    // console.log('New Socket:', socket.id)
    io.sockets.to(socket.id).emit("initialData", {
        users, messages
    });
    socket.on('newUser', username => {
        let newUser = {id: socket.id, username: username};
        users.push(newUser);
        // console.log('New Username:', newUser)
        io.sockets.emit('newUser', newUser)
    });

    socket.on('newMessage', message => {
        message.date = moment().format('MMMM Do, h:mm a');
        messages.push(message);
        console.log('New Message:', message);
        io.sockets.emit('newMessage', message)
    })
});
//listener
httpServer.listen(process.env.PORT, () => {
    console.log(`server listening on port ${port}`);
});

