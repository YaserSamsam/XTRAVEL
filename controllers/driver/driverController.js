const busModel=require('../../models/Bus');
const TRIP=require('../../models/Trip');
const jwt=require('jsonwebtoken');
const AI=require('./AI/AI');

const refresh=async(req,res,next)=>{
        const bus_num=req.bus_num;
        try{
            const bus=await busModel.findOne({where:{bus_num:bus_num}});
            let busTrips=await bus.getTrips();
            // check date of trip
            var availabelTrips=[];let availabelTripsIndex=0;
            var notAvailabelTrips=[];let notAvailabelTripsIndex=0;
            var dat=new Date().getTime();
            var befor2Houers=dat-7200000;
            for(i=0;i<busTrips.length;i++){
              let totalTripTimeInSeconds=busTrips[i].date.getTime();
              if(totalTripTimeInSeconds>befor2Houers) {
                   availabelTrips[availabelTripsIndex]=busTrips[i];
                   availabelTripsIndex++;
                } else {
                notAvailabelTrips[notAvailabelTripsIndex]=busTrips[i];
                notAvailabelTripsIndex++;
               }
            }
            //
            const tripCustomer=new Array(availabelTrips.length);
            let custm;
            for(i=0;i<availabelTrips.length;i++){
                custm=await availabelTrips[i].getCustomers({attributes: ['customer_id']});
                let locatn=[];
                for(j=0;j<custm.length;j++){
                    let go_from=await custm[j].reservations.getLocation();
                    locatn[j]={customer_id:custm[j].customer_id,location:{
                                                                             id:go_from.id,
                                                                             coordinate:go_from.coordinate
                                                                         }};
                }
                tripCustomer[i]=locatn;
            }
            // AI
            // for each index in tripCustomer we will do the AI algorithem and override on that index
            // work with tripCustomer[].location.id coordinate cost
            // 
            var i=-1;
            let trips=availabelTrips.map(item=>{
                i++;
                return{
                    trip_id:item.trip_id
                    ,date:item.date
                    ,destination:item.destinationID
                    ,availabel_sets:item.availabel_sets
                    ,start_station:item.cityId
                    ,customers_location:tripCustomer[i]
                };
            });
        res.status(200).json({
            trips:trips
        });
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
           next(err);
    }  
};

const viewCustomers=async(req,res,next)=>{
       const bus_num=req.bus_num;
       const trip_id=req.params.trip_id;
       //  need validation for trip_id
       //
       try{
       const bus=await busModel.findOne({where:{bus_num:bus_num}}); 
       const trip=await bus.getTrips({where:{trip_id:trip_id}});
       if(trip.length==0){
        const err=new Error('this trip no found');
        err.statusCode=404;
        throw err;
       }
    
       var customers=await trip[0].getCustomers();
       if(customers.length==0){
        const err=new Error('there are no customers');
        err.statusCode=404;
        throw err;
       }
       // remove resevation column and get specific columns
       customers=customers.map(i=>{return{
         'customer_id':i.customer_id
        ,'name':i.name
        ,'birthdate':i.birthdate
        ,'iss':i.iss
        ,'username':i.username
       }});
        res.status(200).json({
            customers:customers
        });
       }catch(err){
        if(!err.statusCode)
              err.statusCode=500;
              next(err);
       }
};

const login=async(req,res,next)=>{
    const bus_num=req.body.bus_num;
    const password=req.body.password;
    try{
    const bus=await busModel.findAll({where:{bus_num:bus_num}});
    if(bus.length==0){
        const err=new Error('this bus not found');
        err.statusCode=404;
        throw err;
    }
    if(bus[0].password!=password){
        const err=new Error('password not correct');
        err.statusCode=404;
        throw err;
    }
    let busTrips=await bus[0].getTrips();   
     // check date of trip
     var availabelTrips=[];let availabelTripsIndex=0;
     var notAvailabelTrips=[];let notAvailabelTripsIndex=0;
     var dat=new Date().getTime();
     var befor2Houers=dat-7200000;
     for(i=0;i<busTrips.length;i++){
       let totalTripTimeInSeconds=busTrips[i].date.getTime();
       if(totalTripTimeInSeconds>befor2Houers) {
            availabelTrips[availabelTripsIndex]=busTrips[i];
            availabelTripsIndex++;
         } else {
         notAvailabelTrips[notAvailabelTripsIndex]=busTrips[i];
         notAvailabelTripsIndex++;
        }
     }
     //
    const tripCustomer=new Array(availabelTrips.length);
    let custm;
    for(i=0;i<availabelTrips.length;i++){
        custm=await availabelTrips[i].getCustomers({attributes: ['customer_id']});
        let locatn=[];
        for(j=0;j<custm.length;j++){
            let go_from=await custm[j].reservations.getLocation();
            locatn[j]={customer_id:custm[j].customer_id,location:{
                                                                     id:go_from.id,
                                                                     coordinate:go_from.coordinate
                                                                 }};
        }
        tripCustomer[i]=locatn;
    }
    // AI
    // for each index in tripCustomer we will do the AI algorithem and override on that index
    // work with tripCustomer[].location.id coordinate cost
    // 
    var i=-1;
    let trips=availabelTrips.map(item=>{
         i++;
         return{
            trip_id:item.trip_id
            ,date:item.date
            ,destination:item.destinationID
            ,availabel_sets:item.availabel_sets
            ,start_station:item.cityId
            ,customers_location:tripCustomer[i]
         };
    });
    const token=jwt.sign({bus_num:bus[0].bus_num},'juniorToken',{expiresIn:'5h'});
    res.status(200).json({
        token:token
        ,trips:trips
    });       
}catch(err){
    if(!err.statusCode)
       err.statusCode=500;
       next(err);
}
};

const getTripLocations=async(req,res,next)=>{
    const tripId=req.params.trip_id;
    try{
        const trip=await TRIP.findOne({where:{trip_id:tripId}});
        const custm=await trip.getCustomers();
        let locatn=[];
        for(j=0;j<custm.length;j++){
            let coordinates=await custm[j].reservations.getLocation();
            locatn[j]={coordinate:coordinates.coordinate};    
        }
        // AI
        
        //
        res.status(200).json({
            coordinates:locatn
        });
    } catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};

module.exports={
    refresh,
    viewCustomers,
    login,
    getTripLocations
}