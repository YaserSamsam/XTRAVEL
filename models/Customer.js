const sequ=require('sequelize');
const db=require('../util/DB');

const customer=db.define('customers',{
    customer_id:{
        type:sequ.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:sequ.STRING,
        allowNull:false,        
    },
    fathername:{
        type:sequ.STRING,
        allowNull:false,        
    },
    mothername:{
        type:sequ.STRING,
        allowNull:false,        
    },
    birthdate:{
        type:sequ.STRING,
        allowNull:false,        
    },
    address:{
        type:sequ.STRING,
        allowNull:false,        
    },
    iss:{
        type:sequ.STRING,
        allowNull:false,        
    },
    trip_availabel:{
        type:sequ.STRING,
        allowNull:false,        
    },
    username:{
        type:sequ.STRING,
        unique:true,
        allowNull:false,        
    },
    password:{
        type:sequ.STRING,
        allowNull:false,        
    },
    registration_date:{
        type:sequ.STRING,
        allowNull:false,        
    }
});

module.exports=customer;