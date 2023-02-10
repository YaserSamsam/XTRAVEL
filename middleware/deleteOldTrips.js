const Trip=require('../models/Trip');

const trigerDeleteOldTrips=async(req,res,next)=>{
try{
    const trips=await Trip.findAll();
    if(trips.length!=0){
        var dateNow=new Date();
        var beforYear=dateNow.getTime()-(1*360*24*60*60*1000);
        var deleteTrips=[];let deleteTripsIndex=0;
        for(i=0;i<trips.length;i++){
            if(trips[i].date.getTime()<=beforYear){
                  deleteTrips[deleteTripsIndex]=trips[i];
                  deleteTripsIndex++;
                }
        }
        // delete
        if(deleteTrips.length!=0){
            deleteTrips.forEach(async(trp) => {
                 await Trip.destroy({where:{trip_id:trp.trip_id}});
            });
        }
    }
    next();
    } catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

module.exports={
    trigerDeleteOldTrips
};