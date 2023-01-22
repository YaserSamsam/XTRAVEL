const busModel=require('../../models/Bus');
const jwt=require('jsonwebtoken');
const AI=require('./AI/AI');

const refresh=async(req,res,next)=>{
        const bus_num=req.bus_num;
        try{
            const bus=await busModel.findOne({where:{bus_num:bus_num}});
            let busTrips=await bus.getTrips();
            const tripCustomer=new Array(busTrips.length);
            let custm;
            for(i=0;i<busTrips.length;i++){
                custm=await busTrips[i].getCustomers({attributes: ['customer_id']});    
                custm=custm.map(i=>{
                    let go_from=i.reservations.go_from;
                    let customer_id=i.customer_id;
                    return {"customer_id":customer_id,"go_from":go_from};
                });
                tripCustomer[i]=custm;
            }
            
            // AI
            // for each index in tripCustomer we will do the AI algorithem and override on that index
            
            //
            var i=-1;
            let trips=busTrips.map(item=>{
                 i++;
                 return{
                    trip_id:item.trip_id
                    ,date:item.date
                    ,destination:item.destination
                    ,availabel_sets:item.availabel_sets
                    ,start_station:item.start_station
                    ,customers_location:tripCustomer[i]
                 };
            });
        res.status(200).json({
            trips:trips
        });
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        throw err;
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
        throw err;
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
    const tripCustomer=new Array(busTrips.length);
    let custm;
    for(i=0;i<busTrips.length;i++){
        custm=await busTrips[i].getCustomers({attributes: ['customer_id']});    
        custm=custm.map(i=>{
            let go_from=i.reservations.go_from;
            let customer_id=i.customer_id;
            return {"customer_id":customer_id,"go_from":go_from};
        });
        tripCustomer[i]=custm;
    }
    // AI
    // for each index in tripCustomer we will do the AI algorithem and override on that index

    // 
    var i=-1;
    let trips=busTrips.map(item=>{
         i++;
         return{
            trip_id:item.trip_id
            ,date:item.date
            ,destination:item.destination
            ,availabel_sets:item.availabel_sets
            ,start_station:item.start_station
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
    throw err;
}
};

module.exports={
    refresh,
    viewCustomers,
    login
}