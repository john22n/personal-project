const axios = require('axios');

module.exports  = {
    getPlaces(req, res) {
        axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDHB0MQwNOEwkkn9eq4svRDT2sw' +
            'Yz0qPHo&type=park&radius=8047&name=basketball&location=' + req.query.lat + ',' + req.query.lng)
            .then(response => {
                let db = req.app.get('db');

                return Promise.all(response.data.results.map( result => {
                    return db.run('SELECT id FROM courts WHERE google_id = $1', [result.id])
                        .then (existingCourts => {
                            if (!existingCourts.length) {
                                result.count = 0;
                                return db.run('INSERT INTO courts (google_id, court_name, address) VALUES ($1, $2, $3);'
                                    , [result.id, result.name, result.vicinity])
                                    .then(results => {
                                        // console.log(results)
                                        return results;
                                    })

                            } else {
                                // console.log(existingCourts[0])
                                return db.run('select count(distinct user_id) from court_players where court_id = $1'
                                    , [existingCourts[0].id])
                                    .then(results => {
                                        // console.log(results)
                                        result.count = results[0].count;
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
                //console.log(err);
                return res.status(500).json(err)
            })

    },

};