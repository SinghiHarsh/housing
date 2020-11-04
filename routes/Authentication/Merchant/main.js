const express = require('express');
const router = express.Router();

const debug = require('debug')('beta-house-backend:*');
const Promise = require('bluebird');

// Model
const Merchant = require('../../../models/Merchant');
const { hashPassword } = require('../../utils');

// UTILS FUNCTIONS
const checkRequiredFields = require('../../utils').checkRequiredFields;

const createMerchant = (data) => {
    return new Promise(async(resolve, reject) => {

        let object = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: await hashPassword(data.password),
            dob: data.dob,
            address: data.address,
            gender: data.gender,
            status: "pending"
        }

        let merchant = new Merchant(object);

        merchant.save((err, record) => {
            if (err)
                return reject({
                    err: true,
                    msg: err.message
                })
            return resolve({
                err: false,
                msg: "Merchant created successfully",
                merchantRecord: record
            })
        })
    })

}

router.post('/',
    checkRequiredFields(['firstName', 'email', 'phoneNumber', 'password']),
    async (req, res) => {
        try {
            let merchant = await createMerchant(req.body);
            return res.json(merchant);
        }
        catch (e) {
            return res.json(e);
        }
    })

module.exports = router;
