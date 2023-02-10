const City=require('../../../models/City');
//await modelName.bulkCreate(); add multi row
const addCityWithLocations=async(req,res,next)=>{
    //   json form ==>> {city:---,locations:[{go_from:---,coordinate:---}, ... ]}
    const city=req.body.city;
    const locations=req.body.locations;
    try{
        // check if added pefore now
        const isCityHere=await City.findOne({where:{name:city}});
        if(isCityHere!=null){
                let cityLocatin=await isCityHere.getLocations();
                var newLoc=[];
                let newLocIndex=0;
                let isLocationHere=false;

                for(i=0;i<locations.length;i++){
                    for(j=0;j<cityLocatin.length;j++){
                        if(locations[i].go_from==cityLocatin[j].go_from){
                            isLocationHere=true;
                            break;
                        }
                    }
                    if(!isLocationHere){
                        newLoc[newLocIndex]=locations[i];
                        newLocIndex++;
                    }
                    isLocationHere=false;
                }
                if(newLoc.length!=0){
                    for(j=0;j<newLoc.length;j++){
                        await isCityHere.createLocation(newLoc[j]);
                    }
                }
        }else{
                let newCity=await City.create({name:city});
                for(j=0;j<locations.length;j++){
                    await newCity.createLocation(locations[j]);
                }     
        }   
        res.status(201).json({
            message:"added success !!"
        });
    }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};

const getAllCityCoordinates=async(req,res,next)=>{
    const cityName=req.params.cityName;
    try{
    // validation city name
    // ...
    // 
    const city=await City.findOne({where:{name:cityName}});
    if(city.length==0){
        const err=new Error('this city not found');
        err.statusCode=404;
        throw err;
    }
    var cityLocations=await city.getLocations();
    cityLocations=cityLocations.map(i=>{
             return{
                coordinate:i.coordinate
             };
    });
    res.status(200).json({locationCoordinates:cityLocations});
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
        }
};

const getCities=async(req,res,next)=>{
    try{
        var cities=await City.findAll();
        if(cities.length==0){
            const err=new Error('no cities found');
            err.statusCode=404;
            throw err;
        }
        cities=cities.map(i=>{
            return{
                id:i.id,
                name:i.name
            };
        });
        res.status(200).json({
            cities:cities
        });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

module.exports={
    addCityWithLocations,
    getAllCityCoordinates,
    getCities
};