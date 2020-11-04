const express = require('express');
const router = express.Router();
const debug = require('debug')('beta-house-backend:*');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

// TOKEN SECRET
const key = require('../../../config/config');

// UTIL FUNCTIONS

const checkRequiredFields = require('../../utils').checkRequiredFields;
const sendEmail = require('../../AWS/main').sendEmail;
const hashPassword = require('../../utils').hashPassword;
const comparePasswords = require('../../utils').comparePasswords;
const sendOTP = require('../../AWS/main').sendOTP;

// END OF UTIL FUNCTIONS

// Models 

const Student = require('../../../models/Student');
const ForgetPassword = require('../../../models/ForgetPassword');
const Merchant = require('../../../models/Merchant');
const OTP = require('../../../models/OTP');
const MerchantForgotPassword = require('../../../models/MerchantForgotPassword');

// End of Models



const checkEmailId = (email) => {
    // console.log(email);
    return new Promise((resolve, reject) => {
        Student.find({
            email: email
        })
            .exec((err, student) => {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    });
                }
                if (student.length === 0) {
                    return resolve({
                        err: true,
                        msg: "Email does not exist"
                    });
                }
                return reject({ err: true, msg: "Email already exist" });
            })
    });
}

const checkPhoneNumber = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        Student.find({
            phoneNumber: phoneNumber
        })
            .exec((err, student) => {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    });
                }
                if (student.length === 0) {
                    return resolve({
                        err: false,
                        msg: "Phone number does not already exist"
                    });
                }
                return reject({
                    err: true,
                    msg: "Phone number already exists"
                });
            })
    });
}

generateVerificationCode = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const createStudent = (details, fields) => {
    return new Promise(async (resolve, reject) => {
        try {
            let obj = {};
            fields.forEach(el => {
                if (details[el]) {
                    obj[el] = details[el];
                }
            });
            // Hashing the password
            const student = new Student(obj);
            let verificationCode = generateVerificationCode(1000, 9999);
            let message = `Hi ${student.firstName}, Your 
            OTP for registation is ${verificationCode}\n. Use this 
            password to validate your registration process. 
            THIS OTP IS VALID ONLY FOR 5 MINUTES`;
            let getOtpDetails = await sendOTP(student.phoneNumber,
                student.countryCode, message);

            let otpObject = {
                studentId: student._id,
                verificationCode: verificationCode,
                verified: false,
                created_at: new Date()
            }

            if (getOtpDetails.err == false) {
                let otp = new OTP(otpObject);
                otp.save(async (err, data) => {
                    if (err) {
                        return reject({
                            err: true,
                            msg: err.message
                        })
                    }
                    else {
                        async function checkIfOtpVerified(data) {
                            let id = data._id;
                            let found = await OTP.findOne({ _id: id });
                            if (found.verified == false) {
                                await OTP.deleteOne({ _id: id });
                            }
                            else {
                                console.log("USER VERIFIED");
                            }
                        }
                        setTimeout(checkIfOtpVerified, 1000 * 60 * 5, data);

                        return resolve({
                            err: false,
                            msg: "otp has been sent to the registered mobile number",
                            details: student,
                            otp: data
                        })
                    }
                });
            }
            else {
                return reject({ err: true, msg: "OTP has not been sent to the user" });
            }
        }
        catch (e) {
            return reject(e);
        }
    });
}

/**
 * 
 * CREATE A NEW STUDENT
 * 
 * This route creates a new student with the given data.
 * 
 */

router.post('/',
    checkRequiredFields(['firstName', 'email', 'phoneNumber', 'password', 'dob', 'countryCode']),
    async (req, res) => {
        try {
            const fields = ["firstName", "lastName", "email", "phoneNumber",
                "password", "dob", "address", "gender", "countryCode"];
            let checkMail = await checkEmailId(req.body.email);
            let checkPhone = await checkPhoneNumber(req.body.phoneNumber);
            await Promise.all([checkMail, checkPhone]);
            let result = await createStudent(req.body, fields);
            res.json(result);
        }
        catch (e) {
            console.log(e)
            return res.json(e);
        }
    }
);

const generateUniqueCode = (studentId, type) => {
    return new Promise((resolve, reject) => {
        if (type === "STUDENT") {
            let uniqueCode = "";
            for (let i = 0; i < 6; i++) {
                const code = Math.floor(Math.random() * 26) + 65;
                uniqueCode += String.fromCharCode(code);
            }

            const forgetPassword = new ForgetPassword({
                studentId: studentId,
                uniqueCode: uniqueCode,
                timestamp: new Date()
            });

            forgetPassword.save((err, data) => {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    })
                }
                return resolve(uniqueCode);
            })
        }
        else if (type === "MERCHANT") {
            let uniqueCode = "";
            for (let i = 0; i < 6; i++) {
                const code = Math.floor(Math.random() * 26) + 65;
                uniqueCode += String.fromCharCode(code);
            }

            const forgetPasswordMerchant = new MerchantForgotPassword({
                merchantId: studentId,
                uniqueCode: uniqueCode,
                timestamp: new Date()
            });

            forgetPasswordMerchant.save((err, data) => {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    })
                }
                return resolve(uniqueCode);
            })
        }
        else {
            return reject({ err: true, msg: "Invalid type!" });
        }
    });
}

const forgotPasswordEmail = (email, uniqueCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const htmlBody = `
            <h2>Beta House Password reset</h2>
            <p>The unique code is ${uniqueCode}</p>
        `;

            const subject = `
            Beta House Password reset
        `;

            const result = await sendEmail(
                email,
                email,
                htmlBody,
                subject
            );
            return resolve(result);
        }
        catch (e) {
            return reject(e);
        }
    });
}

module.exports = router;