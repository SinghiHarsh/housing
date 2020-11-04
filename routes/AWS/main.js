// Load the AWS SDK for Node.js
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const s3Storage = require('multer-sharp-s3');

const s3 = new AWS.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
}

const contentType = (req, file, cb) => {
    cb(null, file.mimetype);
}

const storage2 = s3Storage({
    s3,
    Bucket: 'bucket-name//do not want to disclose the actual name',
    ACL: 'public-read',
    resize: {
        width: null,
        height: 720
    },
    max: true,
    Key: function (req, file, cb) {
        cb(null, Date.now().toString() + "." + file.mimetype.split('/')[1])
    },
});

const upload2 = multer({ storage: storage2 });

module.exports = {

    sendEmail: (toAddress, ccAddress, htmlBody, subject) => {
        return new Promise(async (resolve, reject) => {
            const params = {
                Destination: {
                    CcAddresses: [
                        ccAddress,
                    ],
                    ToAddresses: [
                        toAddress,
                    ]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: htmlBody
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: subject
                    }
                },
                Source: 'betahouse.accom@gmail.com', /* required */
                ReplyToAddresses: [
                    'betahouse.accom@gmail.com',
                    /* more items */
                ],
            };
            const sendPromise = new AWS.SES({
                apiVersion: '',
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
            }).sendEmail(params).promise();
            sendPromise.then((data) => {
                return resolve({
                    err: false,
                    msg: "Sent the email successfully",
                    emailUniqueId: data.MessageId
                })
            })
                .catch(e => {
                    return reject({
                        err: true,
                        msg: e.message
                    })
                })
        });

    },

    upload: upload2,

    deleteFile: (fileName) => {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: 'betahouse-images-storage',
                Key: fileName
            };
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    })
                }
                return resolve("Successfully deleted the image");
            })
        });
    },

    sendOTP: (mobileNumber, countryCode, message) => {
        return new Promise((resolve, reject) => {
            mobileNumber = "+" + countryCode + mobileNumber;

            const params = {
                Message: message,
                PhoneNumber: mobileNumber
            }
            let publishNewPromise = new AWS.SNS({
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
                apiVersion: '2010–03–31',
            }).publish(params).promise();

            publishNewPromise.then(message => {
                return resolve({
                    err: false,
                    message,
                    msg: "OTP has been sent successfully"
                })
            })
                .catch(err => {
                    console.log(err);
                    return reject({
                        err: true,
                        msg: err.message
                    })
                })
        })
    }
}

