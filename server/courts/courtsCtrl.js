module.exports = {
    postCourtsToDatabase(req, res) {
        req.app.get('db')
            .run('INSERT INTO courts (court_name, address) values ($1, $2)', [req.body.name, req.body.address])
            .then(suc => res.status(200).json(suc))
            .catch(err => res.status(500).json(err))
    }
};
