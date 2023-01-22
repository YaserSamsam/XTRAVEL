const express=require('express');
const companyController=require('../../../controllers/company/companyController');
const router=express.Router();

router.get('/getAllBuses',companyController.busGetAllBuses);
router.get('/getBusInfo/:bus_num',companyController.busGetBusInfo);// need validation

router.delete('/removeBus/:bus_num',companyController.busRemoveBus);//need validation

router.put('/updateBus',companyController.busUpdateBus);// need validation

router.post('/addBus',companyController.busAddBus);// need validation

module.exports=router;