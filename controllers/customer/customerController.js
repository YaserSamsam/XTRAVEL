const customerModel=require('../../models/Customer');
const trip=require('../../models/Trip');
const location=require('../../models/Location');
const problems=require('../../models/Problems');
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
    const token=jwt.sign({customer_id:costum[0].customer_id},'juniorToken',{expiresIn:'1h'});
    const customTrips=await costum[0].getTrips();
    res.status(200).json({
            trips:trips
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
    const customTrips=await costum[0].getTrips();
    res.status(200).json({
            trips:trips
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
    var dat=new Date();
    var totalNowTimeInSeconds=dat.getTime()-7200000;//take time before 2 houres
    for(i=0;i<trips.length;i++){
      let totalTripTimeInSeconds=trips[i].date.getTime();
      if(totalTripTimeInSeconds>totalNowTimeInSeconds) {
           availabelTrips[availabelTripsIndex]=trips[i];
           availabelTripsIndex++;
        } else {
        notAvailabelTrips[notAvailabelTripsIndex]=trips[i];
        notAvailabelTripsIndex++;
       }
    }
    //
    res.status(200).json({trips:availabelTrips,oldTrips:notAvailabelTripsIndex});
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
    let changeSeatsNum=await trip.findOne({where:{trip_id:trip_id}});
    changeSeatsNum.availabel_sets--;
    await changeSeatsNum.save();
    trip_availabel--;
    custm.trip_availabel=trip_availabel;
    let reservationDate=new Date();
    await custm.save();
    const Trip=await trip.findOne({where:{trip_id:trip_id}});
    const LOCATION=await location.findOne({where:{go_from:go_from}});
    await Trip.addCustomer(custm,{through:{go_from:go_from,coordinate:LOCATION.coordinate,reservation_Date:reservationDate}});
    const trips=await custm.getTrips();
    const AllTrips=await trip.findAll();
    res.status(200).json({
        message:"booking success"
        ,trips:trips
        ,trip_availabel:trip_availabel
        ,userTrip:Trip
        ,user:custm
        ,AllTrips:AllTrips
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
    let Locations=await location.findAll();
    Locations=Locations.map(i=>{return{id:i.id,go_from:i.go_from}});
    const trip_availabel=custm.trip_availabel;
    let check_seats=false;
    if(Trrip.availabel_sets>0)
            check_seats=true;
    res.status(200).json({
                trip_id:trip_id
               ,trip_availabel:trip_availabel
               ,check_seats:check_seats
               ,Locations:Locations
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
   const custm=await customerModel.findOne({where:{customer_id:customer_id}});
   let custm_trip=await custm.getTrips({where:{trip_id:trip_id}});
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
   await custm_trip[0].reservations.destroy();
   custm_trip=await custm.getTrips();
   const AllTrips=await trip.findAll();
   res.status(200).json({trips:custm_trip,message:"delete success",user:custm,AllTrips:AllTrips});
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
         const custm_trips=await custm.getTrips();
         if(custm_trips.length==0){
            const err=new Error('No reservations found');
            err.statusCode=404;
            throw err;
         }
         res.status(200).json({trips:custm_trips});
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