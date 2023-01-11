const express=require('express');
const companyController=require('../../../controllers/company/companyController');
const router=express.Router();

router.get('/getAllCustomers',companyController.customerGetAllCustomers);
router.get('/getCustomer/:customer_id',companyController.customerGetCustomer);
router.get('/getCustomerReservations/:customer_id',companyController.customerGetCustomerReservations);

router.delete('/removeCustomerReservation/:customer_id/:trip_id',companyController.customerRemoveCustomerReservation);
router.delete('/deleteCustomer/:customer_id',companyController.customerDeleteCustomer);

router.put('/updateCustomer',companyController.customerUpdateCustomer);// need validation
router.put('/addNewBalanceToCustomer',companyController.customerAddNewBalanceToCustomer);// need validation

router.post('/addCustomer',companyController.customerAddCustomer);// need validation

module.exports=router;