const trip=require('../../../models/Trip');
const bus=require('../../../models/Bus');

const tripGetAllTrips=async(req,res,next)=>{
    try{
      const trips=await trip.findAll();
      if(trips.length==0){
        const err=new Error('there are no trips availabel');
        err.statusCode=404;
        throw err;
      }
      res.status(200).json({
        trips:trips
      });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    } 
};

const tripGetBusesId=async(req,res,next)=>{
    try{
      let buses=await bus.findAll();
      if(buses.length==0){
        const err=new Error('no buses found');
        err.statusCode=404;
        throw err;
      }
      buses=buses.map(i=>{
        return {
            "bus_num":i.bus_num
        };
      });
      res.status(200).json({
        buses:buses
      });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

const tripAddTrip=async(req,res,next)=>{
    const date=req.body.date;
    const bus_num=req.body.bus_num;
    const destination=req.body.destination;
    const start_station=req.body.start_station;

        // validation
        // 
    try{
        const busTrip=await bus.findOne({where:{bus_num:bus_num}});
        const addTripToBus=await busTrip.createTrip({
                date:date,
                availabel_sets:busTrip.sets_num,
                destination:destination,
                start_station:start_station
        });
        res.status(201).json({
            message:"create success"
        });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

const tripGetTripInfo=async(req,res,next)=>{
    const trip_id=req.params.trip_id;
    // nedd validation for trip_id
    //
    try{
        const Trip=await trip.findOne({where:{trip_id:trip_id}});
        let customersTrip=await Trip.getCustomers();
        if(customersTrip.length==0){
            const err=new Error('no customers in this trip');
            err.statusCode=404;
            throw err;
        }
        customersTrip=customersTrip.map(i=>{
            return {
                customer_id:i.customer_id
                ,name:i.name
                ,birthdate:i.birthdate
                ,iss:i.iss
                ,username:i.username
            };
        });
        res.status(200).json({
            users:customersTrip
        });
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};

const tripRemoveCostumerFromTrip=async(req,res,next)=>{
    const trip_id=req.params.trip_id;
    const customer_id=req.params.customer_id;
    // need validation for trip_id and customer_id
    //
    try{
        const Trip=await trip.findOne({where:{trip_id:trip_id}});
        const CustmReservation=await Trip.getCustomers({where:{customer_id:customer_id}});
        await CustmReservation[0].reservations.destroy();
        let customersTrip=await Trip.getCustomers();
        if(customersTrip.length==0){
            const err=new Error('no customers in this trip');
            err.statusCode=404;
            throw err;
        }
        customersTrip=customersTrip.map(i=>{
            return {
                customer_id:i.customer_id
                ,name:i.name
                ,birthdate:i.birthdate
                ,iss:i.iss
                ,username:i.username
            };
        });
        res.status(200).json({
            users:customersTrip
        });
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};

const tripGetTripInfoGetBusInfo=async(req,res,next)=>{
        const trip_id=req.params.trip_id;
        // need validation for trip_id
        //
        try{
            const Trip=await trip.findOne({where:{trip_id:trip_id}});
            let Bus=await Trip.getBus();
            let BUS={};
            BUS.bus_num=Bus.bus_num;
            BUS.driver_name=Bus.driver_name;
            BUS.availabel_sets=Bus.sets_num;
            BUS.password=Bus.password;
            res.status(200).json({
                bus:BUS
            });
        }catch(err){
            if(!err.statusCode)
               err.statusCode=500;
            next(err);
        }
};

const tripDeleteTrip=async(req,res,next)=>{
    const trip_id=req.params.trip_id;
    // need validation for trip_id
    // 
    try{
        const Trip=await trip.findOne({where:{trip_id:trip_id}});
        await Trip.destroy();
        const trips=await trip.findAll();
        if(trips.length==0){
            const err=new Error('no trips');
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({
            trips:trips        
        });
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};

module.exports={
    tripGetAllTrips,
    tripGetBusesId,
    tripAddTrip,
    tripGetTripInfo,
    tripRemoveCostumerFromTrip,
    tripGetTripInfoGetBusInfo,
    tripDeleteTrip
}