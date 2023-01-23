const Sequelize=require('sequelize');

const con=new Sequelize(
    "sql12592886",
    "sql12592886",
    "3vnRAPZ5DE"
    ,{dialect:'mysql',host:"sql12.freesqldatabase.com",
    dialectModule: require('mysql2')
});
   
module.exports=con;

/*
Sequeliz(process.env.DATABASE_NAME||"juniorDB",process.env.USERNAME||"root",process.env.PASSWORD||"",{dialect:'mysql',host:process.env.HOSTURL||'localhost'});
*/