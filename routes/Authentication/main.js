const express = require('express');
const router = express.Router();

// Student authentication

const studentAuthRouter = require('./Student/main');
router.use('/student', studentAuthRouter);

// Google Auth
const googleAuth = require('./OAuth/GoogleAuth');
router.use('/google', googleAuth);

// Facebook Auth
const facebookAuth = require('./OAuth/FacebookAuth');
router.use('/facebook', facebookAuth);


// Admin authentication
const adminAuthRouter = require('./Admin/main');
const adminAuthRouterForLogin = require('./Admin/adminLogin');

router.use('/admin', adminAuthRouter);
router.use('/admin', adminAuthRouterForLogin);

// Merchant authentication
const merchantAuthRouter = require('./Merchant/main');
const merchantChangeStatus = require('./Merchant/changeStatus');
const merchantLogin = require('./Merchant/merchantLogin');

router.use('/merchant', merchantAuthRouter);
router.use('/merchant/changeStatus', merchantChangeStatus);
router.use('/merchant/login', merchantLogin);

router.get('/', async (req, res) => {
    res.json({
        err: false,
        msg: "Reached the auth router"
    })
});


module.exports = router;