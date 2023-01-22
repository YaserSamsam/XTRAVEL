const seque=require('sequelize');
const db=require('../util/DB');

const problems=db.define('problems',{
        id:{
           type:seque.INTEGER,
           primaryKey:true,
           autoIncrement:true
        },
        sender:{
            type:seque.STRING,
            allowNull:false
        },
        email:{
        type:seque.STRING,
        allowNull:false
        },
        message:{
            type:seque.TEXT,
            allowNull:false
        }
});

module.exports=problems;