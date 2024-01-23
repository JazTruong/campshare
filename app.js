require("dotenv").config();

const express = require('express');
const app = express();
const port = 3000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./db/index')
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const requestLogger = require('./milddlewares/request_loggers');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));

// ------------------- +++ -------------------- //

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campsites', (req, res) => {
    const sql = `SELECT * FROM campsites;`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        let campsites = result.rows;
        res.render('index', { campsites: campsites });
    });
});

app.get('/campsites/new', (req,res) => {
    res.render('new_campsite_form')
})

app.post('/campsites', (req, res) => {
    let name = req.body.name;
    let location = req.body.location;
    let imageUrl = req.body.image_url;
    let description = req.body.description;

    const sql = `
        INSERT INTO campsites 
        (name, location, image_url, description)
        VALUES ($1, $2, $3, $4);
    `
    db.query(sql, [name, location, imageUrl, description], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/campsites');
    });
});

app.get('/campsites/:id', (req, res) => {
    const sql = `
        SELECT * FROM campsites where id = $1;
    `
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        let campsite = result.rows[0]
        res.render('info', { campsite: campsite });
    });
});

app.delete('/campsites/:id', (req, res) => {
    const sql = `
        DELETE FROM campsites WHERE id = $1;
    `
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/campsites')
    })
});

app.get('/campsites/:id/edit', (req, res) => {
    const sql = `
        SELECT * FROM campsites WHERE id = $1; 
    `
    db.query(sql , [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        let campsite = result.rows[0];
        res.render('edit_campsite_form', { campsite: campsite })
    })
});

app.put('/campsites/:id', (req, res) => {
    let name = req.body.name;
    let location = req.body.location;
    let imageUrl = req.body.image_url;
    let description = req.body.description;
    const sql = `
        UPDATE campsites SET 
        name = $1,
        location = $2,
        image_url = $3,
        description = $4
        WHERE id = $5;
    `
    db.query(sql, [name, location, imageUrl, description, req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect(`/campsites/${req.params.id}`)
    })
});

app.get('/signup', (req, res) => {
    res.render('sign_up_user')
});

app.post('/signup', (req, res) => {
    const email = req.body.email;
    const plainTextPass = req.body.password;
    const saltRound = 10;

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
                    console.log('user created');
                }
                res.render('successful_sign_up')
            })
        })
    })
})







app.listen(port, () => {
    console.log(`server is lstening on port${port}`);
})