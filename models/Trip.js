const sequ=require('sequelize');
const db=require('../util/DB');

const trip=db.define('trips',{
    trip_id:{
        type:sequ.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    date:{
        type:sequ.DATE,
        allowNull:false,        
    },
    availabel_sets:{
        type:sequ.STRING,
        allowNull:false,        
    }
});

module.exports=trip;