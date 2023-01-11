
const driverController=require('../../controllers/driver/driverController');
const Auth=require('../../middleware/Auth');
const express=require('express');
const router=express.Router();

router.get('/refresh',Auth.driver_auth,driverController.refresh);
router.get('/viewCustomer/:trip_id',Auth.driver_auth,driverController.viewCustomers);

router.post('/login',driverController.login);// need validation

module.exports=router;