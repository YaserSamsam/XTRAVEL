const seque=require('sequelize');
const db=require('../util/DB');

const city=db.define('cities',{
        id:{
           type:seque.INTEGER,
           primaryKey:true,
           autoIncrement:true
        },
        name:{
            type:seque.STRING,
            allowNull:false
        }
});

module.exports=city;