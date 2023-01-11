const express=require('express');
const customerUIroute=require('./customer/customerUIRoute');
const companyUIroute=require('./company/companyUIRoute');
const driverUIroute=require('./driver/driverUIRoutes');

const router=express.Router();

// router.get('/',(req,res,next)=>{
//     res.send("<!DOCTYPE html>"+
// '<html lang="en">'+
// "<head>"+
//     '<meta charset="UTF-8">'+
//     '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
//     '<title>Document</title>'+
// '</head>'+
// '<body>'+
// "<h1 style='color:red;'>WELCOME TO XTRAVEL COMPANY </h1><br>"+  
// "<h4 style='color:blue;'>powerd by :</h4><br>"+  
// "<ul style='color:navi;'>"+
// "<li>Yaser Alsamsam</li>"+
// "<li>Moaz Tello</li>"+
// "<li>Wassem Kaskas</li>"+
// "<li>Ahmad Obad</li>"+
// "<li>Massa Alzaied</li>"+
// "</ul><br>"+   
// '</body>'+
// '</html>');
// });
router.use('/companyUI',companyUIroute);
router.use('/customerUI',customerUIroute);
router.use('/driverUI',driverUIroute);

module.exports=router;