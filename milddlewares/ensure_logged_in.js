function ensureLoggedIn(req,res, next) {
    if (req.session.userId) {
        next()
    } else {
        res.render('ensure_logged_in')
    }
}

module.exports = ensureLoggedIn