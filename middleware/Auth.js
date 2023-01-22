const jwt=require('jsonwebtoken');

const customer_auth=(req,res,next)=>{
   const token=req.get('Authorization');
    if(!token){
        const err=new Error('you are not authenticated');
        err.statusCode=403;
        throw err;
    }
    let decodedToken;
    try{
            decodedToken=jwt.verify(token,'juniorToken');
    }catch(err){
            if(!err.statusCode)
                 err.statusCode=500;
            throw err;   
    }    
    if(!decodedToken){
            const err=new Error('you are not authenticated');
            err.statusCode=403;
            throw err;
    }
    req.customer_id=decodedToken.customer_id;
    next();
};

const driver_auth=(req,res,next)=>{
        const token=req.get('Authorization');
         if(!token){
             const err=new Error('you are not authenticated');
             err.statusCode=403;
             throw err;
         }
         let decodedToken;
         try{
                 decodedToken=jwt.verify(token,'juniorToken');
         }catch(err){
                 if(!err.statusCode)
                      err.statusCode=500;
                 throw err;  
         }    
         if(!decodedToken){
                 const err=new Error('you are not authenticated');
                 err.statusCode=403;
                 throw err;
         }
         req.bus_num=decodedToken.bus_num;
         next();
     };

module.exports={
        customer_auth,
        driver_auth
};