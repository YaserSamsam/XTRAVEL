const Sequelize=require('sequelize');

const con=new Sequelize(
    "sql12592886",
    "sql12592886",
    "3vnRAPZ5DE"
    ,{dialect:'mysql',host:"sql12.freesqldatabase.com",
    dialectModule: require('mysql2')
});
// const con=new Sequelize("juniorDB","root","",{dialect:'mysql',host:process.env.HOSTURL||'localhost'});
   
module.exports=con;

