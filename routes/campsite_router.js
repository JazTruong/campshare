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
    let thingToDo = req.body.thing_to_do;
    let description = req.body.description;

    const sql = `
        INSERT INTO campsites 
        (name, location, image_url, thing_to_do, description)
        VALUES ($1, $2, $3, $4, $5);
    `
    db.query(sql, [name, location, imageUrl, thingToDo, description], (err, result) => {
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
        res.render('info', { campsite: campsite });
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
    let thingToDo = req.body.thing_to_do;
    let description = req.body.description;
    const sql = `
        UPDATE campsites SET 
        name = $1,
        location = $2,
        image_url = $3,
        thing_to_do = $4,
        description = $5
        WHERE id = $6;
    `
    db.query(sql, [name, location, imageUrl, thingToDo, description, req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect(`/campsites/${req.params.id}`)
    })
});

module.exports = router