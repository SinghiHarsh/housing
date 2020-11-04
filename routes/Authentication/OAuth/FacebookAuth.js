const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require("passport-facebook");
const url = require('url');
const jwt = require('jsonwebtoken');
var http = require('http');

// UTIL FUNCTIONS

const checkRequiredFields = require('../../utils').checkRequiredFields;
const CLIENT_URL = require('../../utils').CLIENT_URL;
// END OF UTIL FUNCTIONS


// MODELS 
const Student = require('../../../models/Student');
// END OF MODELS


passport.use(new FacebookStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: '/auth/facebook/redirect',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
    const facebookId = profile.id, name = profile.displayName;
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
        methodOfAuthentication: "facebook",
        methodId: facebookId
    })
        .exec((err, student) => {
            if (err) {
                return reject({
                    err: true,
                    msg: err.message
                })
            }
            if (student.length === 0) {
                const student = new Student({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    methodOfAuthentication: "facebook",
                    methodId: facebookId
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


router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));


router.get('/redirect', function (req, res, next) {
    passport.authenticate('facebook', function (err, user, info) {
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