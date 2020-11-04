const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// MODELS
const Student = require('../models/Student');

const findStudentId = (id) => {
    return new Promise((resolve, reject) => {
        console.log("ID VALIDATION", id);
        Student.findOne({ _id: id })
            .exec((err, student) => {
                if (err) return reject({ err: true, msg: err.message });
                if (student) return resolve({ err: false, msg: "student validated" });
                else return reject({ err: true, msg: "Invalid Student" });
            })
    })

}
module.exports = {
    CLIENT_URL: "https://betahouse.co.in",
    checkRequiredFields: (fields) => {
        return (req, res, next) => {
            for (let i = 0; i < fields.length; i++) {
                if (req.body[fields[i]] === undefined || req.body[fields[i]] === "") {
                    return res.json({
                        err: true,
                        msg: fields[i] + " field is missing in the body."
                    });
                }
            }
            next();
        }
    },


    hashPassword: (plainTextPassword) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    })
                }
                return resolve(hash);
            })
        });
    },

    comparePasswords: (plainTextPassword, hashedPassword) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainTextPassword, hashedPassword, function (err, result) {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    })
                }
                if (result == false) {
                    return reject({
                        err: true,
                        msg: "Passwords do not match."
                    })
                }
                else {
                    return resolve({
                        err: false,
                        msg: "Passwords match."
                    })
                }
            })
        });
    },

    verifyToken: async (req, res, next) => {
        const token = req.header('x-auth-token');
        if (!token)
            return res.json({
                err: true,
                msg: "No token, authorization denied"
            })
        try {
            const decode = jwt.verify(token, config.jwtSecret.secret);
            req.userId = decode.id;
            let type = decode.type;
            if (type === "STUDENT") {
                console.log("HERE");
                try {
                    let getStudent = await findStudentId(req.userId);
                    if (!getStudent.err) next();
                }
                catch (e) {
                    return res.json(e);
                }
            }
            else {
                return res.json({
                    err: true,
                    msg: "Invalid token"
                })
            }
        }
        catch (e) {
            return res.json({
                err: true,
                msg: "Invalid token"
            })
        }
    }
}