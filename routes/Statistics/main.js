const express = require('express');
const router = express.Router();

/**
 * MODELS
 */
const PeopleCount = require('../../models/PeopleCount');
const Booking = require('../../models/Booking');
/**
 * END OF MODELS
 */
router.get('/', (req, res) => {
    res.json("Stats page");
})

/**
 * ROUTES
 */
const propertyRouter = require('./property');
router.use('/property', propertyRouter);

const overallRouter = require('./overall');
router.use('/overall', overallRouter);

/**
 * END OF ROUTES
 */

router.post('/reset', (req, res) => {
    Booking.updateMany({},
        {
            paymentStatus: "RESOLVED",
            moneyTransferedToMerchant: false
        })
        .exec((err, details) => {
            if (err) {
                return res.json(err);
            }
            return res.json(details);
        })
})

module.exports = router;