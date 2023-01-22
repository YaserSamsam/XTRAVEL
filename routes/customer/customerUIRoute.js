const express=require('express');
const customerController=require('../../controllers/customer/customerController');
const Auth=require('../../middleware/Auth');
const router=express.Router();

router.post('/login',customerController.login);//need validation
router.post('/saveRservation',Auth.customer_auth,customerController.saveRservation);//need validation

router.get('/refreashAftereLogin',Auth.customer_auth,customerController.refreashAftereLogin);
router.get('/trip/getAllTrips',customerController.getAllTrips);
router.get('/viewRservation/:trip_id',Auth.customer_auth,customerController.viewRservation);
router.get('/myRservations',Auth.customer_auth,customerController.myRservations);
router.get('/myProfile',Auth.customer_auth,customerController.myProfile);
router.post('/snedProblem',customerController.snedProblem);

router.delete('/removeRservation/:trip_id',Auth.customer_auth,customerController.removeRservation);

module.exports=router;