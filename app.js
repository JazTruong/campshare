require("dotenv").config();

const express = require('express');
const app = express();
require('bcrypt');
const port = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const setCurrentUser = require('./milddlewares/set_current_user');
const methodOverride = require('method-override');
const requestLogger = require('./milddlewares/request_loggers');

const homeRouter = require('./routes/home_router');
const campsiteRouter = require('./routes/campsite_router');
const sessionRouter = require('./routes/session_router')

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(requestLogger);
app.use(session({
    secret: process.env.SESSION_SECRET || 'camping',
    resave: false,
    saveUninitialized: true
}));
app.use(setCurrentUser);
app.use(express.urlencoded({ extended: true }));

// ------------------- +++ -------------------- //

app.use(homeRouter);
app.use(campsiteRouter);
app.use(sessionRouter);

app.listen(port, () => {
    console.log(`server is lstening on port${port}`);
})