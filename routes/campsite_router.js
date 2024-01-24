const express = require('express');
const router = express();
const db = require('../db/index');
const ensureLoggedIn = require('../milddlewares/ensure_logged_in');

router.get('/campsites', (req, res) => {
    const sql = `SELECT * FROM campsites;`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        let campsites = result.rows;
        res.render('index', { campsites: campsites });
    })
});

router.get('/campsites/new', ensureLoggedIn, (req,res) => {
    res.render('new_campsite_form')
})

router.post('/campsites', (req, res) => {
    let name = req.body.name;
    let location = req.body.location;
    let imageUrl = req.body.image_url;
    let imageUrlOne = req.body.image_url_1;
    let imageUrlTwo = req.body.image_url_2;
    let thingToDo = req.body.thing_to_do;
    let description = req.body.description;
    let userId = req.session.userId;

    const sql = `
        INSERT INTO campsites 
        (name, location, image_url, image_url_1, image_url_2, thing_to_do, description, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `
    db.query(sql, [name, location, imageUrl, imageUrlOne, imageUrlTwo, thingToDo, description, userId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/campsites');
    })
});

router.get('/campsites/:id', (req, res) => {
    const sql = `
        SELECT * FROM campsites where id = $1;
        `
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        let campsite = result.rows[0]
        
        const sql = `
        SELECT * FROM comments WHERE campsite_id = $1;
        `
        db.query(sql, [req.params.id], (err, result) => {
            if (err) {
            console.log(err);
            }
            let comments = result.rows

            res.render('info', { campsite: campsite, comments: comments });
        });
    });
});

router.delete('/campsites/:id', ensureLoggedIn, (req, res) => {
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

router.get('/campsites/:id/edit', ensureLoggedIn, (req, res) => {
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

router.put('/campsites/:id', (req, res) => {
    let name = req.body.name;
    let location = req.body.location;
    let imageUrl = req.body.image_url;
    let imageUrlOne = req.body.image_url_1;
    let imageUrlTwo = req.body.image_url_2;
    let thingToDo = req.body.thing_to_do;
    let description = req.body.description;

    const sql = `
        UPDATE campsites SET 
        name = $1,
        location = $2,
        image_url = $3,
        image_url_1 = $4,
        image_url_2 = $5,
        thing_to_do = $6,
        description = $7
        WHERE id = $8;
    `
    db.query(sql, [name, location, imageUrl, imageUrlOne, imageUrlTwo, thingToDo, description, req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect(`/campsites/${req.params.id}`)
    })
});

// ------------- COMMENTS ------------- //

router.post('/comments/:id', ensureLoggedIn, (req, res) => {
    let name = req.body.name;
    let comment = req.body.comment;
    let userId = req.session.userId;
    let campsiteId = req.params.id
    console.log(req.params);
    const sql = `
        INSERT INTO comments
        (name, comment, user_id, campsite_id)
        VALUES ($1, $2, $3, $4);
    `
    db.query(sql, [name, comment, userId, campsiteId], (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log();
        res.redirect(`/campsites/${req.params.id}`)
    })
});

module.exports = router