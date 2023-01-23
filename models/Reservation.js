const seque=require('sequelize');
const db=require('../util/DB');

const reservation=db.define('reservations',{
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
        },
        reservation_Date:{
            type:seque.DATE,
            allowNull:false
        }
});

module.exports=reservation;