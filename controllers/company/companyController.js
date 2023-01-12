const customers=require('../../models/Customer');
const trip=require('../../models/Trip');
const bus=require('../../models/Bus');

const customerGetAllCustomers=async(req,res,next)=>{
    try{
       const users=await customers.findAll();
       if(users.length==0){
        const err=new Error('no users');
        err.statusCode=404;
        throw err;
       }
       const allUsers=users.map(i=>{
        return{
            "customer_id":i.customer_id
            ,"name":i.name
            ,"trip_availabel":i.trip_availabel
            ,"username":i.username
            
        }
       });
       res.status(200).json({
        users:allUsers
       });
    } catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

const customerGetCustomer=async(req,res,next)=>{
      const customer_id=req.params.customer_id;// need validation
      try{
            const user=await customers.findOne({where:{customer_id:customer_id}});
            res.status(200).json({
                user:user
            });
      }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
      }
};

const customerGetCustomerReservations=async(req,res,next)=>{
    const customer_id=req.params.customer_id;// need validation
    try{
    const user=await customers.findOne({where:{customer_id:customer_id}});
    let customerTrips=await user.getTrips();
    if(customerTrips.length==0){
        const err=new Error('no reservations');
        err.statusCode=404;
        throw err;
     }
    customerTrips=customerTrips.map(i=>{
        return{
            "trip_id":i.trip_id
            ,"date":i.date
            ,"availabel_sets":i.availabel_sets
            ,"destination":i.destination
            ,"start_station":i.start_station               
        }
    });
    res.status(200).json({
        trips:customerTrips
    });
    } catch(err){
      if(!err.statusCode)
         err.statusCode=500;
      next(err);
    }
};

const customerRemoveCustomerReservation=async(req,res,next)=>{
      const customer_id=req.params.customer_id;// need validation
      const trip_id=req.params.trip_id;// need validation
      try{
           const customer=await customers.findOne({where:{customer_id:customer_id}});
           const TripDelete=await customer.getTrips({where:{trip_id:trip_id}});
           const deleteCustomTrip=await TripDelete[0].reservations.destroy();
           let customerTrips=await customer.getTrips();
           if(customerTrips.length==0){
              const err=new Error('no reservations');
              err.statusCode=404;
              throw err;
           }
           customerTrips=customerTrips.map(i=>{
            return{
                "trip_id":i.trip_id
                ,"date":i.date
                ,"availabel_sets":i.availabel_sets
                ,"destination":i.destination
                ,"start_station":i.start_station               
            }
        });
           res.status(200).json({
              trips:customerTrips
           });
      } catch(err){
        if(!err.statusCode)
              err.statusCode=500;
        next(err);
      }
};

const customerDeleteCustomer=async(req,res,next)=>{
    const customer_id=req.params.customer_id;// need validation
    try{
        const costm=await customers.findOne({where:{customer_id:customer_id}});
        await costm.destroy();
        res.status(200).json({
           message:"delete success ! "
       });
    }catch(err){
       if(!err.statusCode)
       err.statusCode=500;
       throw err;
    }
};

const customerUpdateCustomer=async(req,res,next)=>{
        const customer=req.body.user;
        // validation
        // ...
        //
        try{
        let custm=await customers.findOne({where:{customer_id:customer.customer_id}});
        custm.name=customer.name;
        custm.fathername=customer.fathername;
        custm.mothername=customer.mothername;
        custm.birthdate=customer.birthdate;
        custm.address=customer.address;
        custm.iss=customer.iss;
        custm.trip_availabel=customer.trip_availabel;
        custm.username=customer.username;
        custm.password=customer.password;
        custm.registration_date=customer.registration_date;
        custm.save();
        res.status(200).json({
            message:"update success !! "
        });
    } catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};

const customerAddNewBalanceToCustomer=async(req,res,next)=>{
    const username=req.body.username;
    const trip_availabel=req.body.trip_availabel;
    // validation
    //
     try{
       let custm=await customers.findAll({where:{username:username}});
       if(custm.length==0){
         const err=new Error('this customer not found');
         err.statusCode=404;
         throw err;
       }
       custm[0].trip_availabel=trip_availabel;
       custm[0].save();
       custm=custm.map(i=>{
        return {
            "customer_id":i.customer_id
            ,"name":i.name
            ,"fathername":i.fathername
            ,"mothername":i.mothername
            ,"birthdate":i.birthdate
            ,"address":i.address
            ,"iss":i.iss
            ,"username":i.username
            ,"trip_availabel":i.trip_availabel
        };
       });
       res.status(200).json({
        user:custm[0]
       });
     } catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
     }
};

const customerAddCustomer=async(req,res,next)=>{
    const user=req.body.user;
    // validation
    // 
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
    try{
        await customers.create({
           name:user.name
           ,fathername:user.fathername
           ,mothername:user.mothername
           ,birthdate:user.birthdate
           ,address:user.address
           ,iss:user.iss
           ,trip_availabel:user.trip_availabel
           ,username:user.username
           ,password:user.password
           ,registration_date:reservationDate
        });
        res.status(201).json({
           message:"customer added success"
        });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

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
        const destination=req.body.destination;
        const start_station=req.body.start_station;
        const bus_num=req.body.bus_num;
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
        console.log(err);
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

const busGetAllBuses=async(req,res,next)=>{
    try{
        const buses=await bus.findAll();
        if(buses.length==0){
            const err=new Error('no buses');
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({
            buses:buses
        });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

const busGetBusInfo=async(req,res,next)=>{
    const bus_num=req.params.bus_num;
    //  need validation for bus_num
    //
    try{
        const BUS=await bus.findOne({where:{bus_num:bus_num}});
        res.status(200).json({
            bus:BUS        
        });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    } 
};

const busUpdateBus=async(req,res,next)=>{
    const bus_num=req.body.bus_num;
    const driver_name=req.body.driver_name;
    const sets_num=req.body.sets_num;
    const password=req.body.password;
    // validation
    //   
    try{
        let BUS=await bus.findOne({where:{bus_num:bus_num}});
        BUS.driver_name=driver_name;
        BUS.sets_num=sets_num;
        BUS.password=password;
        BUS.save();
        res.status(200).json({
            message:"update success",
            bus:BUS
        });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

const busRemoveBus=async(req,res,next)=>{
    const bus_num=req.params.bus_num;
    // need validation for bus_num
    // 
    try{
        const BUS=await bus.findOne({where:{bus_num:bus_num}});
        const busTrip= await BUS.getTrips();
        for(i=0;i<busTrip.length;i++){
               await busTrip[i].destroy();
        }
        await BUS.destroy();
        const buses=await bus.findAll();
        if(buses.length==0){
            const err=new Error("no buses");
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({
            buses:buses
        });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

const busAddBus=async(req,res,next)=>{
    const bus_num=req.body.bus_num;
    const driver_name=req.body.driver_name;
    const sets_num=req.body.sets_num;
    const password=req.body.password;
    // validation
    //   
    try{
        const BUS=await bus.create({ 
              bus_num:bus_num,
              driver_name:driver_name,
              sets_num:sets_num,
              password:password
        });
        res.status(200).json({
            message:"create success",
            bus:BUS
        });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
   };

const updateTrip=async(req,res,next)=>{

    const trip_id=req.params.trip_id;
    const date=req.body.date;
    const destination=req.body.destination;
    const start_station=req.body.start_station;
    const bus_num=req.body.bus_num;
    // validation
    // 
try{
    const Trip=await trip.findOne({where:{trip_id:trip_id}});
    if(Trip==null){
        const err=new Error('no trip with this id');
        err.statusCode=404;
        throw err;
    }
    busTrip=await bus.findOne({where:{bus_num:bus_num}});
        Trip.date=date,
        Trip.availabel_sets=busTrip.sets_num,
        Trip.destination=destination,
        Trip.start_station=start_station,
        Trip.busBusNum=bus_num;
        await Trip.save();
    res.status(201).json({
        message:"upddate success"
    });
}catch(err){
    if(!err.statusCode)
        err.statusCode=500;
    console.log(err);
    next(err);
}
};

module.exports={
    customerGetAllCustomers,
    customerGetCustomer,
    customerGetCustomerReservations,
    customerRemoveCustomerReservation,
    customerDeleteCustomer,
    customerUpdateCustomer,
    customerAddNewBalanceToCustomer,
    tripGetAllTrips,
    tripGetBusesId,
    tripAddTrip,
    tripGetTripInfo,
    tripRemoveCostumerFromTrip,
    tripGetTripInfoGetBusInfo,
    tripDeleteTrip,
    customerAddCustomer,
    busGetAllBuses,
    busGetBusInfo,
    busUpdateBus,
    busRemoveBus,
    busAddBus,
    updateTrip
}