const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const url = require('url');
const jwt = require('jsonwebtoken');

// UTIL FUNCTIONS

const checkRequiredFields = require('../../utils').checkRequiredFields;
const CLIENT_URL = require('../../utils').CLIENT_URL;

// END OF UTIL FUNCTIONS


// Models 
const Student = require('../../../models/Student');
// End of Models

passport.use(new GoogleStrategy({
    // Options for the google strategy
    callbackURL: '/auth/google/redirect',
    clientID: '',
    clientSecret: ''
}, (accessToken, refreshToken, profile, done) => {
    const googleId = profile.id, name = profile.displayName;
    const email = profile.emails[0].value;
    let firstName, lastName;
    if (name.split(" ").length > 1) {
        firstName = name.split(" ")[0];
        lastName = name.split(" ")[1];
    }
    else {
        firstName = name;
    }
    Student.find({
        methodOfAuthentication: "google",
        methodId: googleId
    })
        .exec((err, student) => {
            if (err) {
                return reject({
                    err: true,
                    msg: err.message
                })
            }
            console.log(`Student length ${student.length}`);
            if (student.length === 0) {
                const student = new Student({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    methodOfAuthentication: "google",
                    methodId: googleId
                });
                student.save((err, student) => {
                    if (err) {
                        console.log("error");
                        console.log(err);
                        done(null, false, err.message);
                    } else {
                        done(null, student);
                    }
                });
            }
            else {
                done(null, student[0]);
            }
        });
}));

/**
 * LOGIN FOR GOOGLE AUTH
 */

router.get('/login', (req, res) => {
    try {
        res.send("Logging in with google");
    }
    catch (e) {
        res.json(e);
    }
});


/**
 * END OF LOGIN FOR GOOGLE AUTH
 */


router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'phone', 'address']
}));
// }));

router.get('/redirect', function (req, res, next) {
    passport.authenticate('google', function (err, user, info) {
        console.log(`Inside redirect`);
        if (!user) {
            res.redirect(url.format({
                pathname: `${CLIENT_URL}/user/login`,
                query: {
                    err: true,
                    msg: info
                },
            }));
        }
        else {
            let id = user._id;
            console.log(id);
            id = encodeURI(id);
            res.redirect(url.format({
                pathname: `${CLIENT_URL}`,
                query: {
                    a: id
                },
            }));
        }
    })(req, res, next);
});

module.exports = router;