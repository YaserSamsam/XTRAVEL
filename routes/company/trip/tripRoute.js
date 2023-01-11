const express=require('express');
const companyController=require('../../../controllers/company/companyController');
const router=express.Router();

router.get('/getAllTrips',companyController.tripGetAllTrips);
router.get('/getBusesId',companyController.tripGetBusesId);
router.get('/getTripInfo/:trip_id',companyController.tripGetTripInfo);
router.get('/getTripInfo/getBusInfo/:trip_id',companyController.tripGetTripInfoGetBusInfo);

router.delete('/removeCostumerFromTrip/:trip_id/:customer_id',companyController.tripRemoveCostumerFromTrip);
router.delete('/deleteTrip/:trip_id',companyController.tripDeleteTrip)

router.post('/addTrip',companyController.tripAddTrip);// need validation


router.put('/updateTrip/:trip_id',companyController.updateTrip);// need validation

module.exports=router;