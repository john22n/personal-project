module.exports = {
    login(req, res, next) {
        if (req.app.get('user')) {
            return res.status(200).json(
                {isLoggedin: true}
            )
        }
        return res.status(200).json({isLoggedin: false})

    }
}