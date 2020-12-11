const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/user-model')


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        // Options for the google strat
        callbackURL: '/auth/google/redirect',
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
    }, (accessToken, refreshToken, profile, done) => {

        //Check if already present

        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                console.log("Already present: " + currentUser)
                done(null, currentUser)
            }
            else {
                // Create new user
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                }).save().then((newUser) => {
                    console.log("NEW USER CREATED: " + newUser)
                    done(null, newUser)
                })
            }
        })


    })
)