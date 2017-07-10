module.exports = {
    login(req, res, next) {
        if (req.user) {
            return res.status(200).json(
                {isLoggedin: true}
            )
        } else {
            res.status(200).json({isLoggedin: true})
        }

    }
}