const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * MODELS
 */
const Property = require('../../models/Property');
const Booking = require('../../models/Booking');
const PeopleCount = require('../../models/PeopleCount');

/**
 * END OF MODELS
 */

/**
 * UTILS 
 */
const checkRequiredFields = require('../utils').checkRequiredFields;

/**
 * END OF UTILS 
 */

router.get('/', (req, res) => {
    res.send("Overall Stats page");
})

/**
 * REVENUE COMPARISON BETWEEN THEIR OWN PROPERTIES
 */

const getTotalRevenueForProperty = (propertyId, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        Booking.aggregate([
            {
                $match: {
                    propertyId: mongoose.Types.ObjectId(propertyId),
                    created_at: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $group: {
                    _id: "$propertyId",
                    totalAmount: {
                        $sum: "$afterDiscountCost"
                    }
                }
            },
            {
                $lookup: {
                    from: "properties",
                    localField: "_id",
                    foreignField: "_id",
                    as: "propertyDetails"
                }
            }
        ])
            .exec((err, bookings) => {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    })
                }
                //CONSOLE.LOG() HERE(bookings);
                return resolve({
                    totalAmount: bookings[0].totalAmount,
                    propertyName: bookings[0].propertyDetails[0].propertyName
                });
            })
    });
}

router.post('/revenuecomparison',
    checkRequiredFields(['propertyIds', 'fromDate', 'toDate']),
    async (req, res) => {
        try {
            const fromDate = new Date(req.body.fromDate);
            const toDate = new Date(req.body.toDate);
            let result = [];
            const propertyIds = req.body.propertyIds;
            for (let i = 0; i < propertyIds.length; i++) {
                const individualResult =
                    await getTotalRevenueForProperty(propertyIds[i], fromDate, toDate);
                result.push(individualResult);
            }
            res.json({
                err: false,
                msg: "Got the revenue comparison results",
                result: result
            });
        }
        catch (err) {
            res.json(err);
        }
    }
)

/**
 * END OF REVENUE COMPARISON BETWEEN THEIR OWN PROPERTIES
 */

/**
 * Get custom revenue for a merchant
 */

const getTotalRevenueForMerchant = (merchantId, fromDate, toDate, search) => {
    return new Promise((resolve, reject) => {
        //CONSOLE.LOG() HERE(merchantId, fromDate, toDate)
        Booking.aggregate([
            {
                $match: {
                    merchantId: mongoose.Types.ObjectId(merchantId),
                    created_at: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $group: {
                    _id: JSON.parse(search),
                    totalAmount: {
                        $sum: "$afterDiscountCost"
                    }
                }
            }
        ])
            .exec((err, bookings) => {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    })
                }
                if (bookings.length === 0) {
                    return reject({
                        err: true,
                        msg: "No bookings found"
                    })
                }
                return resolve({
                    err: false,
                    msg: "Got the revenue",
                    totalAmount: bookings
                });
            })
    });
}

router.post('/revenuecustom',
    checkRequiredFields(['fromDate', 'toDate', 'merchantId']),
    async (req, res) => {
        try {
            const fromDate = new Date(req.body.fromDate);
            const toDate = new Date(req.body.toDate);
            const result = await
                getTotalRevenueForMerchant(req.body.merchantId, fromDate, toDate, `null`);
            res.json(result);
        }
        catch (err) {
            res.json(err);
        }
    })

/**
 * END OF Get custom revenue for a merchant
 */

/**
 * Get revenue for a merchant (weekly)
 */

router.post('/revenueweekly',
    checkRequiredFields(['merchantId']),
    async (req, res) => {
        try {
            const currentDate = new Date();
            // //CONSOLE.LOG() HERE(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
            let fromDate;
            if (currentDate.getDay() == 0) {
                fromDate = new Date(new Date(currentDate.getFullYear(),
                    currentDate.getMonth(), currentDate.getDate()).getTime()
                    - (1000 * 60 * 60 * 24 * 6));
            }
            else {
                fromDate = new Date(new Date(currentDate.getFullYear(),
                    currentDate.getMonth(), currentDate.getDate()).getTime()
                    - (1000 * 60 * 60 * 24 * (currentDate.getDay() - 1)));
            }
            let toDate = currentDate;
            const body = `{
                "$dayOfWeek": "$created_at"
            }`;
            const result = await
                getTotalRevenueForMerchant(req.body.merchantId, fromDate, toDate, body);
            res.json(result);
        }
        catch (e) {
            res.json(e);
        }
    }
)


/**
 * END OF Get revenue for a merchant (weekly)
 */

/**
 * Get revenue for a merchant(monthly)
 */

const getTotalRevenueForPropertyByMonthHelper = (merchantId, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        Booking.aggregate([
            {
                $match: {
                    merchantId: mongoose.Types.ObjectId(merchantId),
                    created_at: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$afterDiscountCost"
                    }
                }
            }
        ])
            .exec((err, bookings) => {
                if (err) {
                    return reject({
                        err: true,
                        msg: err.message
                    })
                }
                if (bookings.length === 0) {
                    return resolve(0);
                }
                return resolve(bookings[0].totalAmount);
            })
    });
}

const getTotalRevenueForPropertyByMonth = (merchantId, fromDate, toDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const finalResult = [];
            while (fromDate.getTime() < toDate.getTime()) {
                let dayOfWeek = fromDate.getDay();
                let tempToDate;
                if (dayOfWeek === 0) {
                    tempToDate = new Date(fromDate.getFullYear(), fromDate.getMonth(),
                        fromDate.getDate() + 1);
                } else {
                    tempToDate = new Date(fromDate.getFullYear(), fromDate.getMonth(),
                        fromDate.getDate() + (8 - fromDate.getDay()));
                }
                const result = await
                    getTotalRevenueForPropertyByMonthHelper(merchantId, fromDate, tempToDate);
                finalResult.push(result);
                fromDate = tempToDate;
            }
            return resolve({
                err: false,
                msg: "Got the values",
                result: finalResult
            });
        }
        catch (e) {
            return reject(e);
        }
    });
}


router.post('/revenuemonthly',
    checkRequiredFields(['merchantId']),
    async (req, res) => {
        try {
            const currentDate = new Date();
            const fromDate = new
                Date(new Date(currentDate.getFullYear(), currentDate.getMonth(),
                    currentDate.getDate()).getTime() - (1000 * 60 * 60 * 24 * (currentDate.getDate() - 1)));
            const toDate = currentDate;
            const result = await
                getTotalRevenueForPropertyByMonth(req.body.merchantId, fromDate, toDate);
            res.json(result);
        }
        catch (e) {
            res.json(e);
        }
    }
)

/**
 * END OF Get revenue for a merchant(monthly)
 */

module.exports = router;