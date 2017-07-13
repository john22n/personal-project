module.exports = {
    getGuest(req, res) {
        req.app.get('db')
            .run(
                'INSERT INTO users (username, first_name, last_name, email, picture) values ($1, $2, $3, $4, $5) RETURNING *',
                ['guest_user', 'guest', 'user', 'guest@gmail.com', 'home.jpg']
            )
            .then(suc => res.status(200).json(suc))
            .catch(err => {
                res.status(500).json(err)
            })
    }
};