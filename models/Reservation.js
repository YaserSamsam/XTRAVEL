const seque=require('sequelize');
const db=require('../util/DB');

const reservation=db.define('reservations',{
        id:{
           type:seque.INTEGER,
           primaryKey:true,
           autoIncrement:true
        },
        reservation_Date:{
            type:seque.DATE,
            allowNull:false
        }
});

module.exports=reservation;