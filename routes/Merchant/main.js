const express = require('express');
const router = express.Router();

// Models
const Booking = require('../../models/Booking');
const Merchant = require('../../models/Merchant');
const mongoose = require('mongoose');

// CONFIG
const checkRequiredFields = require('../utils').checkRequiredFields;
const sendEmail = require('../AWS/main').sendEmail;


router.post("/issues/query", checkRequiredFields(['message']), (req, res) => {
    try {
        const { message } = req.body;

        let address = "help@betahouse.co.in";
        let ccAddress = "betahouse.accom@gmail.com";
        let body = `<p>${message}</p>`
        let subject = "Merchant Issue";

        sendEmail(address, ccAddress, body, subject);
        return res.json({ err: false, msg: "Mail has been sent to the support" });

    }
    catch (e) {
        return res.json({ err: true, msg: e.message });
    }
})

const updateMerchantCommission = (id, newCommissionValue) => {
    return new Promise((resolve, reject) => {
        Merchant.find({ _id: id })
            .exec(async (err, merchant) => {
                if (err) return resolve({ err: false, msg: err.message });
                if (merchant.length > 0) {
                    merchant[0].commission = newCommissionValue / 100;
                    await merchant[0].save();
                    return resolve({ err: false, msg: "Merchant commission updated!" })
                }
                else return reject({ err: true, msg: "Merchant is not available" });
            })
    })
}

router.post("/edit/commission", checkRequiredFields(['newCommissionValue']), async (req, res) => {
    try {
        const { merchantId, newCommissionValue } = req.body;
        let updated = await updateMerchantCommission(merchantId, parseInt(newCommissionValue));
        return res.json(updated);
    }
    catch (e) {
        return res.json(e);
    }
})


module.exports = router;
