const Sequelize=require('sequelize');

const con=new Sequelize(
    "sql9589975",
    "sql9589975",
    "ppZKCDxR3j"
    ,{dialect:'mysql',host:"sql9.freesqldatabase.com",
    dialectModule: require('mysql2')});
   
module.exports=con;

/*
Sequeliz(process.env.DATABASE_NAME||"juniorDB",process.env.USERNAME||"root",process.env.PASSWORD||"",{dialect:'mysql',host:process.env.HOSTURL||'localhost'});
*/