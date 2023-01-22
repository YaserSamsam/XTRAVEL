const express=require('express');
const companyController=require('../../../controllers/company/companyController');
// const companyValidation=require('../../../validation/company/companyValidation');
const router=express.Router();

router.get('/getAllCustomers',companyController.customerGetAllCustomers);
router.get('/getCustomer/:customer_id',companyController.customerGetCustomer);// need validation
router.get('/getCustomerReservations/:customer_id',companyController.customerGetCustomerReservations);// need validation

router.delete('/removeCustomerReservation/:customer_id/:trip_id',companyController.customerRemoveCustomerReservation);// need validation
router.delete('/deleteCustomer/:customer_id',companyController.customerDeleteCustomer);// need validation

router.put('/updateCustomer',companyController.customerUpdateCustomer);// need validation
router.put('/addNewBalanceToCustomer',companyController.customerAddNewBalanceToCustomer);// need validation

router.post('/addCustomer',companyController.customerAddCustomer);// need validation

module.exports=router;