const express=require('express');
const body_parser=require('body-parser');
const db=require('./util/DB');
const customer=require('./models/Customer');
const trip=require('./models/Trip');
const bus=require('./models/Bus');
const reservation=require('./models/Reservation');
const Route=require('./routes/IndexRoute');
const app=express();
customer.belongsToMany(trip,{through:reservation});
trip.belongsToMany(customer,{through:reservation});
bus.hasMany(trip);
trip.belongsTo(bus,{ constraints:true,onDelete:'CASCADE' });
app.use(body_parser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,PATCH');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
});

// npm install --save body-parser express express-validator jsonwebtoken mysql2 sequelize
app.get('/',(req,res,next)=>{
  res.send("<!DOCTYPE html>"+
'<html lang="en">'+
"<head>"+
  '<meta charset="UTF-8">'+
  '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
  '<title>Document</title>'+
'</head>'+
'<body>'+
"<h1 style='color:red;'>WELCOME TO XTRAVEL COMPANY </h1><br>"+  
"<h4 style='color:blue;'>powerd by :</h4><br>"+  
"<ul style='color:navi;'>"+
"<li>Yaser Alsamsam</li>"+
"<li>Moaz Tello</li>"+
"<li>Wassem Kaskas</li>"+
"<li>Ahmad Obad</li>"+
"<li>Massa Alzaied</li>"+
"</ul><br>"+   
'</body>'+
'</html>');
});

app.use(Route);
app.use((err,req,res,next)=>{res.status(err.statusCode).json({message:err.message});});
(async()=>{
    try{
    await db.sync();
    app.listen(55055);
}catch(err){
  console.log('can not connect to database');    
  err=new Error('can not connect to database');
  err.statusCode=404;
  throw err;
}
})();