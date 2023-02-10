const express=require('express');
const body_parser=require('body-parser');
const db=require('./util/DB');
const triggerDeleteOldTrips=require('./middleware/deleteOldTrips');
const customer=require('./models/Customer');
const trip=require('./models/Trip');
const bus=require('./models/Bus');
const reservation=require('./models/Reservation');
const Location=require('./models/Location');
const city=require('./models/City');
const Route=require('./routes/IndexRoute');
const app=express();
// relations of tables
customer.belongsToMany(trip,{through:reservation});
trip.belongsToMany(customer,{through:reservation});
bus.hasMany(trip);
trip.belongsTo(bus,{ constraints:true,onDelete:'CASCADE' });
city.hasMany(trip);
trip.belongsTo(city,{ constraints:true,onDelete:'CASCADE' });
trip.belongsTo(city,{ constraints:true,onDelete:'CASCADE',as:'destination',foreignKey:'destinationID' });
Location.hasMany(reservation);
reservation.belongsTo(Location,{ constraints:true,onDelete:'CASCADE' });
city.hasMany(Location);
Location.belongsTo(city,{ constraints:true,onDelete:'CASCADE' });

app.use(body_parser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,PATCH');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
});
app.use(triggerDeleteOldTrips.trigerDeleteOldTrips);
app.use(Route);
app.use((err,req,res,next)=>{res.status(err.statusCode).json({message:err.message});});
(async()=>{
    try{
    // await db.sync({alter:true});
    await db.sync();
    
}catch(err){
  console.log(err);   
  console.log('can not connect to database');    
  err=new Error('can not connect to database');
  err.statusCode=404;
  throw err;
}
})();
module.exports =app;
