const express=require('express');
const trip=require('./trip/tripRoute');
const bus=require('./bus/busRoute');
const customer=require('./customer/customerRoute');
const city=require('./city/cityRoute');
const router=express.Router();

router.use('/trip',trip);
router.use('/customer',customer);
router.use('/bus',bus);
router.use('/city',city);

module.exports=router;