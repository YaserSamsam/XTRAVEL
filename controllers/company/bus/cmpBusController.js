const bus=require('../../../models/Bus');

//bus
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
        throw err;
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
        throw err;
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
        throw err;
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
        throw err;
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
        throw err
    }
   };

module.exports={
    busGetAllBuses,
    busGetBusInfo,
    busUpdateBus,
    busRemoveBus,
    busAddBus
}