const customerModel=require('../../models/Customer');
const trip=require('../../models/Trip');
const location=require('../../models/Location');
const problems=require('../../models/Problems');
const CITY=require('../../models/City');
const Requestemploye=require('../../models/Requestemploye');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

const login = async(req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;
    // validation
    //
    try{
    const costum=await customerModel.findAll({where:{username:username}});
    // check from username and password
    if(costum.length==0){
        const err=new Error('this customer not found');
        err.statusCode=404;
        throw err;
    }
    /*
    const isPasswordTrue=await bcryptjs.compare(password,costum.password);
    if(!isPasswordTrue){
        const err=new Error('password not correct');
        err.statusCode=422;
        throw err;
    }*/
    if(costum[0].password!=password){
        const err=new Error('password not correct');
        err.statusCode=422;
        throw err;
    }
    // send all trips and token
    const trips=await trip.findAll();
    // check date of trip
    var availabelTrips=[];let availabelTripsIndex=0;
    var notAvailabelTrips=[];let notAvailabelTripsIndex=0;
    var dat=new Date().getTime();
    var befor2Houers=dat-7200000;
    for(i=0;i<trips.length;i++){
      let totalTripTimeInSeconds=trips[i].date.getTime();
      if(totalTripTimeInSeconds>befor2Houers) {
           availabelTrips[availabelTripsIndex]=trips[i];
           availabelTripsIndex++;
        } else {
        notAvailabelTrips[notAvailabelTripsIndex]=trips[i];
        notAvailabelTripsIndex++;
       }
    }
    //
    const token=jwt.sign({customer_id:costum[0].customer_id},'juniorToken',{expiresIn:'1h'});
    const customTrips=await costum[0].getTrips();
    ////////////////// get value of city id and destination id in each trip
    // destination
    // start_station
    // busBusNum
    for(i=0;i<availabelTrips.length;i++){
        let desCity=await CITY.findOne({where:{id:availabelTrips[i].destinationID}});
        let startCity=await CITY.findOne({where:{id:availabelTrips[i].cityId}});
        availabelTrips[i]={
                trip_id:availabelTrips[i].trip_id,
                date:availabelTrips[i].date,
                availabel_sets:availabelTrips[i].availabel_sets,
                destination:desCity.name,
                start_station:startCity.name,
                busBusNum:availabelTrips[i].busBusNum,
            };
        }
    
        for(i=0;i<customTrips.length;i++){
            let desCity=await CITY.findOne({where:{id:customTrips[i].destinationID}});
            let startCity=await CITY.findOne({where:{id:customTrips[i].cityId}});
            customTrips[i]={
                    trip_id:customTrips[i].trip_id,
                    date:customTrips[i].date,
                    availabel_sets:customTrips[i].availabel_sets,
                    destination:desCity.name,
                    start_station:startCity.name,
                    busBusNum:customTrips[i].busBusNum,
                };
            }
        ////////////////////////
    res.status(200).json({
            trips:availabelTrips
            ,token:token
            ,customerTrips:customTrips
            ,customer:costum[0]
    });
    //
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
            next(err);
    }
};

const refreashAftereLogin = async(req,res,next)=>{
    const customer_id=req.customer_id;
    // validation
    //
    try{
    const costum=await customerModel.findAll({where:{customer_id:customer_id}});
    // check from username and password
    if(costum.length==0){
        const err=new Error('this customer not found');
        err.statusCode=404;
        throw err;
    }
    /*
    const isPasswordTrue=await bcryptjs.compare(password,costum.password);
    if(!isPasswordTrue){
        const err=new Error('password not correct');
        err.statusCode=422;
        throw err;
    }*/
    // send all trips and token
    const trips=await trip.findAll();
    // check date of trip
    var availabelTrips=[];let availabelTripsIndex=0;
    var notAvailabelTrips=[];let notAvailabelTripsIndex=0;
    var dat=new Date().getTime();
    var befor2Houers=dat-7200000;
    for(i=0;i<trips.length;i++){
      let totalTripTimeInSeconds=trips[i].date.getTime();
      if(totalTripTimeInSeconds>befor2Houers) {
           availabelTrips[availabelTripsIndex]=trips[i];
           availabelTripsIndex++;
        } else {
        notAvailabelTrips[notAvailabelTripsIndex]=trips[i];
        notAvailabelTripsIndex++;
       }
    }
    //
    const customTrips=await costum[0].getTrips();
    ////////////////// get value of city id and destination id in each trip
    // destination
    // start_station
    // busBusNum
    for(i=0;i<availabelTrips.length;i++){
        let desCity=await CITY.findOne({where:{id:availabelTrips[i].destinationID}});
        let startCity=await CITY.findOne({where:{id:availabelTrips[i].cityId}});
        availabelTrips[i]={
                trip_id:availabelTrips[i].trip_id,
                date:availabelTrips[i].date,
                availabel_sets:availabelTrips[i].availabel_sets,
                destination:desCity.name,
                start_station:startCity.name,
                busBusNum:availabelTrips[i].busBusNum,
            };
        }
    
        for(i=0;i<customTrips.length;i++){
            let desCity=await CITY.findOne({where:{id:customTrips[i].destinationID}});
            let startCity=await CITY.findOne({where:{id:customTrips[i].cityId}});
            customTrips[i]={
                    trip_id:customTrips[i].trip_id,
                    date:customTrips[i].date,
                    availabel_sets:customTrips[i].availabel_sets,
                    destination:desCity.name,
                    start_station:startCity.name,
                    busBusNum:customTrips[i].busBusNum,
                };
            }
        ////////////////////////
    res.status(200).json({
            trips:availabelTrips
            ,customerTrips:customTrips
            ,customer:costum[0]
    });
    //
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
            next(err);
    }
};

const getAllTrips= async(req,res,next)=>{
   try{
    var trips=await trip.findAll();
    if(trips.length==0){
        const err=new Error('no trips found');
        err.statusCode=404;
        throw err;
    }
    // check date of trip
    var availabelTrips=[];let availabelTripsIndex=0;
    var notAvailabelTrips=[];let notAvailabelTripsIndex=0;
    var dat=new Date().getTime();
    var befor2Houers=dat-7200000;
    for(i=0;i<trips.length;i++){
      let totalTripTimeInSeconds=trips[i].date.getTime();
      if(totalTripTimeInSeconds>befor2Houers) {
           availabelTrips[availabelTripsIndex]=trips[i];
           availabelTripsIndex++;
        } else {
        notAvailabelTrips[notAvailabelTripsIndex]=trips[i];
        notAvailabelTripsIndex++;
       }
    }
    ////////////////// get value of city id and destination id in each trip
    // destination
    // start_station
    // busBusNum
    for(i=0;i<availabelTrips.length;i++){
        let desCity=await CITY.findOne({where:{id:availabelTrips[i].destinationID}});
        let startCity=await CITY.findOne({where:{id:availabelTrips[i].cityId}});
        availabelTrips[i]={
                trip_id:availabelTrips[i].trip_id,
                date:availabelTrips[i].date,
                availabel_sets:availabelTrips[i].availabel_sets,
                destination:desCity.name,
                start_station:startCity.name,
                busBusNum:availabelTrips[i].busBusNum,
            };
        }
    //
    res.status(200).json({trips:availabelTrips});
   }catch(err){
    if(!err.statusCode)
         err.statusCode=500;
    next(err);
   }
};

const saveRservation= async(req,res,next)=>{
     const customer_id=req.customer_id;
     const trip_id=req.body.trip_id;
     const go_from=req.body.go_from;
     let trip_availabel=req.body.trip_availabel;
    //  validation
    //
    try{
        if(trip_availabel==0){
            const err=new Error('you do not have trips');
            err.statusCode=422;
            throw err;
        }
    const custm=await customerModel.findOne({where:{customer_id:customer_id}});
    const checkTrip=await custm.getTrips({where:{trip_id:trip_id}}); 
    if(checkTrip.length!=0){
        const err=new Error('you already booked in this trip');
        err.statusCode=422;
        throw err;
    }
    let Trip=await trip.findOne({where:{trip_id:trip_id}});
    Trip.availabel_sets--;
    await Trip.save();
    trip_availabel--;
    custm.trip_availabel=trip_availabel;
    await custm.save();
    let reservationDate=new Date();
    const LOCATION=await location.findOne({where:{go_from:go_from}});
    await Trip.addCustomer(custm,{through:{reservation_Date:reservationDate,locationId:LOCATION.id}});
    const customTrips=await custm.getTrips();
    const trips=await trip.findAll();
    // check date of trip
    var availabelTrips=[];let availabelTripsIndex=0;
    var notAvailabelTrips=[];let notAvailabelTripsIndex=0;
    var dat=new Date().getTime();
    var befor2Houers=dat-7200000;
    for(i=0;i<trips.length;i++){
      let totalTripTimeInSeconds=trips[i].date.getTime();
      if(totalTripTimeInSeconds>befor2Houers) {
           availabelTrips[availabelTripsIndex]=trips[i];
           availabelTripsIndex++;
        } else {
        notAvailabelTrips[notAvailabelTripsIndex]=trips[i];
        notAvailabelTripsIndex++;
       }
    }
    ////////////////// get value of city id and destination id in each trip
    // destination
    // start_station
    // busBusNum
    for(i=0;i<availabelTrips.length;i++){
        let desCity=await CITY.findOne({where:{id:availabelTrips[i].destinationID}});
        let startCity=await CITY.findOne({where:{id:availabelTrips[i].cityId}});
        availabelTrips[i]={
                trip_id:availabelTrips[i].trip_id,
                date:availabelTrips[i].date,
                availabel_sets:availabelTrips[i].availabel_sets,
                destination:desCity.name,
                start_station:startCity.name,
                busBusNum:availabelTrips[i].busBusNum,
            };
        }
        for(i=0;i<customTrips.length;i++){
            let desCity=await CITY.findOne({where:{id:customTrips[i].destinationID}});
            let startCity=await CITY.findOne({where:{id:customTrips[i].cityId}});
            customTrips[i]={
                    trip_id:customTrips[i].trip_id,
                    date:customTrips[i].date,
                    availabel_sets:customTrips[i].availabel_sets,
                    destination:desCity.name,
                    start_station:startCity.name,
                    busBusNum:customTrips[i].busBusNum,
                };
            }
    //
    ///
    res.status(200).json({
        message:"booking success"
        ,trips:customTrips
        ,trip_availabel:trip_availabel
        ,userTrip:Trip
        ,user:custm
        ,AllTrips:trips
    });
} catch(err){
    if(!err.statusCode)
        err.statusCode=500;
        next(err);
}
};

const viewRservation=async(req,res,next)=>{
    const customer_id=req.customer_id;
    const trip_id=req.params.trip_id;
    // validation to trip_id
    // 
    try{
    const Trrip=await trip.findOne({where:{trip_id:trip_id}});
    const custm=await customerModel.findOne({where:{customer_id:customer_id}});
    // return source city locations
    var sourceCity=await  CITY.findOne({where:{id:Trrip.cityId}});
    let cityLocations=await sourceCity.getLocations();
    cityLocations=cityLocations.map(i=>{
        return{ id:i.id,go_from:i.go_from,coordinate:i.coordinate};
    });
    //
    const trip_availabel=custm.trip_availabel;
    let check_seats=false;
    if(Trrip.availabel_sets>0)
            check_seats=true;
    res.status(200).json({
                trip_id:trip_id
               ,trip_availabel:trip_availabel
               ,check_seats:check_seats
               ,Locations:cityLocations
            });
    } catch(err){
            if(!err.statusCode)
               err.statusCode=500;
               next(err);
    }
};

const removeRservation=async(req,res,next)=>{
   const trip_id=req.params.trip_id;
   const customer_id=req.customer_id;
   // validation to trip_id
   // 
   try{
   let custm=await customerModel.findOne({where:{customer_id:customer_id}});
   let changeSeatsNum=await trip.findOne({where:{trip_id:trip_id}});
   changeSeatsNum.availabel_sets++;
   await changeSeatsNum.save();
   //check date trip if befor now ==>> increse trip availabel of customer else ==>> just remove
   dat=new Date();
   var dateAfter12Houers=dat.getTime()+(12*60*60*1000);
   var tripDate=changeSeatsNum.date.getTime();
   if(dateAfter12Houers<tripDate){
    custm.trip_availabel++;
    await custm.save();
   }
   //
   let custm_trip=await custm.getTrips({where:{trip_id:trip_id}});
   await custm_trip[0].reservations.destroy();
   const customTrips=await custm.getTrips();
   const trips=await trip.findAll();
   //
   // check date of trip
   var availabelTrips=[];let availabelTripsIndex=0;
   var notAvailabelTrips=[];let notAvailabelTripsIndex=0;
   var dat=new Date().getTime();
   var befor2Houers=dat-7200000;
   for(i=0;i<trips.length;i++){
     let totalTripTimeInSeconds=trips[i].date.getTime();
     if(totalTripTimeInSeconds>befor2Houers) {
          availabelTrips[availabelTripsIndex]=trips[i];
          availabelTripsIndex++;
       } else {
       notAvailabelTrips[notAvailabelTripsIndex]=trips[i];
       notAvailabelTripsIndex++;
      }
   }
   ////////////////// get value of city id and destination id in each trip
   // destination
   // start_station
   // busBusNum
   for(i=0;i<availabelTrips.length;i++){
       let desCity=await CITY.findOne({where:{id:availabelTrips[i].destinationID}});
       let startCity=await CITY.findOne({where:{id:availabelTrips[i].cityId}});
       availabelTrips[i]={
               trip_id:availabelTrips[i].trip_id,
               date:availabelTrips[i].date,
               availabel_sets:availabelTrips[i].availabel_sets,
               destination:desCity.name,
               start_station:startCity.name,
               busBusNum:availabelTrips[i].busBusNum,
           };
       }
       for(i=0;i<customTrips.length;i++){
           let desCity=await CITY.findOne({where:{id:customTrips[i].destinationID}});
           let startCity=await CITY.findOne({where:{id:customTrips[i].cityId}});
           customTrips[i]={
                   trip_id:customTrips[i].trip_id,
                   date:customTrips[i].date,
                   availabel_sets:customTrips[i].availabel_sets,
                   destination:desCity.name,
                   start_station:startCity.name,
                   busBusNum:customTrips[i].busBusNum,
               };
           }
   //
   custm={
        customer_id:      custm.customer_id     ,   
        name:             custm.name            ,
        fathername:       custm.fathername      ,
        mothername:       custm.mothername      ,
        birthdate:        custm.birthdate       ,
        address:          custm.address         ,
        iss:              custm.iss             ,
        trip_availabel:   custm.trip_availabel  ,
        username:         custm.username        ,
        password:         custm.password        ,
        registration_date:custm.registration_date
   };
   res.status(200).json({trips:customTrips,message:"delete success",user:custm,AllTrips:availabelTrips});
} catch(err){
    if(!err.statusCode)
       err.statusCode=500;
       next(err);
}
};

const myRservations=async(req,res,next)=>{
    const customer_id=req.customer_id;
    try{
         const custm=await customerModel.findOne({where:{customer_id:customer_id}});
         const customTrips=await custm.getTrips();
         if(customTrips.length==0){
            const err=new Error('No reservations found');
            err.statusCode=404;
            throw err;
         }
         ////////////////// get value of city id and destination id in each trip
         // destination
         // start_station
         // busBusNum
         for(i=0;i<customTrips.length;i++){
            let desCity=await CITY.findOne({where:{id:customTrips[i].destinationID}});
            let startCity=await CITY.findOne({where:{id:customTrips[i].cityId}});
            customTrips[i]={
                    trip_id:customTrips[i].trip_id,
                    date:customTrips[i].date,
                    availabel_sets:customTrips[i].availabel_sets,
                    destination:desCity.name,
                    start_station:startCity.name,
                    busBusNum:customTrips[i].busBusNum,
                };
            }
        /////////
         res.status(200).json({trips:customTrips});
    } catch(err){
         if(!err.statusCode)
              err.statusCode=500;
              next(err);
    }
};

const myProfile=async(req,res,next)=>{
    const customer_id=req.customer_id;
    try{
        const custm=await customerModel.findOne({where:{customer_id:customer_id}});
        res.status(200).json({user:custm});
    }catch(err){
        if(!err.statusCode)
          err.statusCode=500;
          next(err);
    }
};

const snedProblem=async(req,res,next)=>{
       const sender=req.body.sender;
       const email=req.body.email;
       const message=req.body.message;
       try{
            await problems.create({
                sender:sender,
                email:email,
                message:message
            });
            res.status(201).json({message:"problem sent successful"});
       }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
            next(err);
       }
}

const snedEmployeRequest=async(req,res,next)=>{
       const senderFirstName=req.body.senderFirstName;
       const senderLaststName=req.body.senderLaststName;
       const email=req.body.email;
       const request=req.body.request;
       try{
            await Requestemploye.create({
                senderFirstName:senderFirstName,
                senderLaststName:senderLaststName,
                email:email,
                request:request
            });
            res.status(201).json({message:"request sent successful"});
       }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
            next(err);
       }
};

module.exports={
    login,
    getAllTrips,
    saveRservation,
    viewRservation,
    removeRservation,
    myRservations,
    myProfile,
    refreashAftereLogin,
    snedProblem,
    snedEmployeRequest
}