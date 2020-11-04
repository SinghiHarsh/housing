var express = require('express');
var router = express.Router();

// ROUTERS

// Authentication module

const authRouter = require('./Authentication/main');
router.use('/auth', authRouter);
// End of authentication module

const propertyRouter = require('./Property/main');
router.use('/property', propertyRouter);

// Booking Module
// IMPORT CONFIG
const verifyToken = require('./utils').verifyToken;

const bookingRouter = require('./Booking/main');
const generateBillRouter = require('./Booking/generateBill');

router.use('/booking',verifyToken, bookingRouter);
router.use('/list', bookingRouter);
router.use('/overview', bookingRouter);
router.use('/coupon', bookingRouter);
router.use('/generate', bookingRouter);
router.use('/payment', bookingRouter);
router.use('/merchant', bookingRouter);
// end of booking module

router.use('/billing', generateBillRouter);

// Student module
const studentRouter = require('./Student/main');
router.use('/student', studentRouter);
router.use('/feedback', verifyToken, studentRouter);
router.use('/admin/feedback', studentRouter);
// end of student module

// Coupons module
const couponRouter = require('./Offers/main');
router.use('/coupon', couponRouter);
router.use('/code', couponRouter);
router.use('/list', couponRouter);
// end of coupon module

// ADMIN ROUTES
const adminRouter = require('./Admin/main');
const adminSideList = require('./Authentication/Merchant/changeStatus');
router.use('/admin', adminRouter);
router.use('/admin',adminSideList);

// Statistics model
const statsRouter = require('./Statistics/main');
router.use('/stats', statsRouter);

// Merchants model
const merchantBookingHistory = require('./Merchant/main');
router.use("/merchant/bookings",merchantBookingHistory);

// END OF ROUTERS

/* GET home page. */
router.get('/', function (req, res, next) {
  //CONSOLE.LOG() HERE(`Reached hereeee####`);
  res.render('index', { title: 'Beta House Application' });
});

module.exports = router;
