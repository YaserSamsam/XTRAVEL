const Sequelize=require('sequelize');

const con=new Sequelize(
    "sql11592870",
    "sql11592870",
    "Tzc1UvbYuC"
    ,{dialect:'mysql',host:"sql11.freesqldatabase.com",
    dialectModule: require('mysql2')
});

// const con=new Sequelize("juniorDB","root","",{dialect:'mysql',host:'localhost'});
  
module.exports=con;