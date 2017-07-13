module.exports = {
    postPlayer(req, res) {
        let db = req.app.get('db');
        db.run('select id from courts where google_id = $1', [req.body.google_id])
            .then(courts => {
                if (!courts.length) {
                    return res.status(500).json("No court with that id")
                }
                return courts[0].id;
            })
            .then(court_id => {
                // console.log(court_id);
                if (req.body.user_id)
                    db.run('insert into court_players (user_id, court_id) values ($1, $2);', [req.body.user_id, court_id])
                // .then( response => {
                //     //console.log(response);
                //     return res.status(200).json("Yay")
                // })
            })
    },
    removePlayer(req, res) {
        let db = req.app.get('db');
        db.run('SELECT id from courts WHERE google_id = $1', [req.params.google_id])
            .then(courts => {
                if (!courts.length) {
                    return res.status(500).json('no courts with that id');
                }
                let court_id = courts[0].id;
                return court_id;
            })
            .then( () => {
                if (req.params.user_id) {
                    db.run('DELETE FROM court_players WHERE user_id  = $1', [req.params.user_id])
                        .then(response => {
                            // console.log(response);
                            return res.status(200).json('user was removed from courts+players table');
                        })
                }
            })
    }

};