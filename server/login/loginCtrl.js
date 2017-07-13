module.exports = {
    login(req, res) {
        if (req.user) {
            return res.status(200).json(
                {isLoggedin: true}
            )
        } else {
            res.status(200).json({isLoggedin: false})
        }

    },

    getUser(req, res) {
        return res.status(200).json(req.user)
    }
}