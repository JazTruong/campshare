const express = require('express');
const router = express();
const db = require('../db/index');
const bcrypt = require('bcrypt');


router.get('/signup', (req, res) => {
    res.render('sign_up_user')
});

router.post('/signup', (req, res) => {
    const sql = `SELECT * FROM users WHERE email = $1;`
    db.query(sql, [req.body.email], (err, result) => {
        if (err) {
            console.log(err);
            res.render('/signup')
            return
        }

        if (result.rows.length === 0) {
            const email = req.body.email;
            const plainTextPass = req.body.password;
            const saltRound = 10;
            console.log(email);
            bcrypt.genSalt(saltRound, (err, salt) => {
                bcrypt.hash(plainTextPass, salt, (err, hashedPass) => {
                    const sql = `
                        INSERT INTO users 
                        (email, password_digest)
                        VALUES ($1, $2);
                        `
                    db.query(sql , [email, hashedPass], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('user created!');
                            console.log(result.rows);
                        }
                            res.render('successful_sign_up')
                    });
                });
    
            });
        } else {
            res.render('email_existed')
        };
    });
    
});

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', (req, res) => {
    const sql = `
        SELECT * FROM users WHERE email = $1;
    `
    db.query(sql, [req.body.email], (err, result) => {
        if (err) {
            console.log(err);
            res.render('login')
            return
        }

        if (result.rows.length === 0) {
            console.log('user not found');
            res.render('user_not_found')
            return
        }

        const plainTextPass = req.body.password;
        const hashedPass = result.rows[0].password_digest;

        bcrypt.compare(plainTextPass, hashedPass, (err, isCorrect) => {
            if (!isCorrect) {
                console.log('wrong password');
                res.render('incorrect_pass')
                return
            }
            req.session.userId = result.rows[0].id
            res.redirect('/')
        });
    });
});

router.delete('/logout', (req, res) => {
    req.session.userId = null;
    res.redirect('login')
});

module.exports = router