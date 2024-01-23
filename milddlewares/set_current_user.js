const db = require('../db')

function setCurrentUser(req, res, next) {
    res.locals.currentUser = null
    res.locals.isLoggedIn = false
    if (!req.session.userId) {
        return next()
    }
    const sql = `SELECT * FROM users WHERE id = $1;`
    db.query(sql, [req.session.userId], (err, result) => {
        res.locals.currentUser = result.rows[0]
        res.locals.isLoggedIn = true
        next()
    })
}

module.exports = setCurrentUser