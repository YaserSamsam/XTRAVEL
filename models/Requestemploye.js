const seque=require('sequelize');
const db=require('../util/DB');

const requestemploye=db.define('requestemploye',{
        id:{
           type:seque.INTEGER,
           primaryKey:true,
           autoIncrement:true
        },
        senderFirstName:{
            type:seque.STRING,
            allowNull:false
        },
        senderLaststName:{
            type:seque.STRING,
            allowNull:false
        },
        email:{
        type:seque.STRING,
        allowNull:false
        },
        request:{
            type:seque.TEXT,
            allowNull:false
        }
});

module.exports=requestemploye;