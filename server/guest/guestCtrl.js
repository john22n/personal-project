module.exports = {
    getGuest(req, res) {
        req.app.get('db')
            .run('INSERT INTO users (google_id, username, first_name, last_name, email) values ($1, $2, $3, $4, $5)', ['guest_user', 'guest', 'user', 'guest@gmail.com', 'home.jpg'])
            .then(suc => res.status(200).json(suc))
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }
};