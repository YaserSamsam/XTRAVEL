const express=require('express');
const companyController=require('../../../controllers/company/companyController');
const router=express.Router();

router.post('/addCityWithLocations',companyController.addCityWithLocations);

router.get('/getAllCityCoordinates/:cityName',companyController.getAllCityCoordinates);
router.get('/getCities',companyController.getCities);

module.exports=router;