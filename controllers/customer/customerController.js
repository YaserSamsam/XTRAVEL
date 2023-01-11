const customer=require('../../models/Customer');
const trip=require('../../models/Trip');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

const login = async(req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;
    // validation
    //
    try{
    const costum=await customer.findAll({where:{username:username}});
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

const getAllTrips= async(req,res,next)=>{
   try{
    const trips=await trip.findAll();
    if(trips.length==0){
        const err=new Error('not trips found');
        err.statusCode=404;
        throw err;
    }
    res.status(200).json({trips:trips});
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
    const custm=await customer.findOne({where:{customer_id:customer_id}});
    const checkTrip=await custm.getTrips({where:{trip_id:trip_id}}); 
    if(checkTrip.length!=0){
        const err=new Error('you already booked in this trip');
        err.statusCode=422;
        throw err;
    }
    if(trip_availabel==0){
        const err=new Error('you do not have trips');
        err.statusCode=422;
        throw err;
    }
    trip_availabel--;
    custm.trip_availabel=trip_availabel;
    const days=[
       "SUN",
       "MON",
       "TUE",
       "WED",
       "THU",
       "FRI",
       "SAT",
    ];
    let reservationDate=new Date();
    reservationDate=
            reservationDate.getFullYear()+"/"+
            (reservationDate.getMonth()+1)+"/"+
            reservationDate.getDate()+" "+
            days[reservationDate.getDay()]+" "+
            reservationDate.getHours()+":"+
            reservationDate.getMinutes()+":"+
            reservationDate.getSeconds();
    await custm.save();
    const Trip=await trip.findOne({where:{trip_id:trip_id}});
    await Trip.addCustomer(custm,{through:{go_from:go_from,reservation_Date:reservationDate}});
    // AI algorithem
    // ...
    //
    const trips=await custm.getTrips();
    res.status(200).json({
        message:"booking success"
        ,trips:trips
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
    const custm=await customer.findOne({where:{customer_id:customer_id}});
    const trip_availabel=custm.trip_availabel;
    res.status(200).json({
                trip_id:trip_id
               ,trip_availabel:trip_availabel
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
   const custm=await customer.findOne({where:{customer_id:customer_id}});
   let custm_trip=await custm.getTrips({where:{trip_id:trip_id}});
   //check date trip if befor now ==>> increse trip availabel of customer else ==>> just remove
   //...
   //
   const removeTrip=await custm_trip[0].reservations.destroy();
   custm_trip=await custm.getTrips();
   res.status(200).json({trips:custm_trip,message:"delete success"});
} catch(err){
    if(!err.statusCode)
       err.statusCode=500;
    next(err);
}
};

const myRservations=async(req,res,next)=>{
    const customer_id=req.customer_id;
    try{
         const custm=await customer.findOne({where:{customer_id:customer_id}});
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
        const custm=await customer.findOne({where:{customer_id:customer_id}});
        res.status(200).json({user:custm});
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
    myProfile
}