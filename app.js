const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
const authRoutes = require('./routes/auth-routes')
const profileRoutes = require('./routes/profile-routes')
const passportSetup = require('./config/passport-config')
const cookieSession = require('cookie-session')
const passport = require('passport')

const uri = "mongodb://localhost:27017/music";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, () => {
    console.log("Connected to MongoDB")
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home', { user: req.user })
})

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
}));

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)



app.listen(3000, () => {
    console.log("Running on port 3000");
})