const seque=require('sequelize');
const db=require('../util/DB');

const locations=db.define('locations',{
        id:{
           type:seque.INTEGER,
           primaryKey:true,
           autoIncrement:true
        },
        go_from:{
            type:seque.STRING,
            allowNull:false
        },
        coordinate:{
            type:seque.STRING,
            allowNull:false
        }
});

module.exports=locations;