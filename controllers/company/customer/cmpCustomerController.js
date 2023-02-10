const customers=require('../../../models/Customer');
const problemss=require('../../../models/Problems');
const Requestemploye=require('../../../models/Requestemploye');
const CITY=require('../../../models/City');

const customerAddCustomer=async(req,res,next)=>{
    const name = req.body.name;
    const fathername=req.body.fathername;
    const mothername=req.body.mothername;
    const birthdate=req.body.birthdate;
    const address=req.body.address;
    const iss=req.body.iss;
    const trip_availabel=req.body.trip_availabel;
    const username=req.body.username;
    const password=req.body.password;
    const registration_date=new Date().toString();
    // validation
    // 
    try{
        await customers.create({
            name:name
            ,fathername:fathername
            ,mothername:mothername
            ,birthdate:birthdate
            ,address:address
            ,iss:iss
            ,trip_availabel:trip_availabel
            ,username:username
            ,password:password
            ,registration_date:registration_date
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
    const customer_id=req.params.customer_id;
    ////////// customer_id validation //////////
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
        let customTrips=await user.getTrips();
        if(customTrips.length==0){
            const err=new Error('no reservations');
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
        ////////
        res.status(200).json({
            trips:customTrips
        });
    }catch(err){
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
           await TripDelete[0].reservations.destroy();
           let customTrips=await customer.getTrips();
           if(customTrips.length==0){
              const err=new Error('no reservations');
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
         ////////
        res.status(200).json({
              trips:customTrips
           });
      }catch(err){
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
           message:"delete success !! "
       });
    }catch(err){
       if(!err.statusCode)
          err.statusCode=500;
       next(err);
    }
};

const customerUpdateCustomer=async(req,res,next)=>{
        const id_=req.body.Id_;
        const name=req.body.name;
        const fathername=req.body.fathername;
        const mothername=req.body.mothername;
        const birthdate=req.body.birthdate;
        const address=req.body.address;
        const iss=req.body.iss;
        const trip_availabel=req.body.trip_availabel;
        const username=req.body.username;
        const password=req.body.password;
        // validation
        // ...
        //
        try{
        let custm=await customers.findOne({where:{customer_id:id_}});
        custm.name=name;
        custm.fathername=fathername;
        custm.mothername=mothername;
        custm.birthdate=birthdate;
        custm.address=address;
        custm.iss=iss;
        custm.trip_availabel=trip_availabel;
        custm.username=username;
        custm.password=password;
        custm.registration_date=custm.registration_date;
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
     }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
     }
};

const viewProblems=async(req,res,next)=>{
    try{    
        var allProblems=await problemss.findAll();
        if(allProblems.length==0){
            const err=new Error("no message found");
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({problems:allProblems});
    } catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
}

const viewEmployeRequest=async(req,res,next)=>{
    try{    
        var allRequestemploye=await Requestemploye.findAll();
        if(allRequestemploye.length==0){
            const err=new Error("no request found");
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({requests:allRequestemploye});
    } catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
}

module.exports={
    customerGetAllCustomers,
    customerGetCustomer,
    customerGetCustomerReservations,
    customerRemoveCustomerReservation,
    customerDeleteCustomer,
    customerUpdateCustomer,
    customerAddNewBalanceToCustomer,
    customerAddCustomer,
    viewProblems,
    viewEmployeRequest
}