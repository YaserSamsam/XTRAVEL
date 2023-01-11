const db=require('../util/DB');
const sequelize=require('sequelize');

const bus=db.define('buses',{
    bus_num:{
        type:sequelize.INTEGER,
        primaryKey:true,
    },
    driver_name:{
        type:sequelize.STRING,
        allowNull:false
    },
    sets_num:{
        type:sequelize.STRING,
        allowNull:false
    },
    password:{
        type:sequelize.STRING,
        allowNull:false
    }
});

module.exports=bus;