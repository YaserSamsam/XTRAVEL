const Sequelize=require('sequelize');

// const con=new Sequelize(
//     "sql9589975",
//     "sql9589975",
//     "ppZKCDxR3j"
//     ,{dialect:'mysql',host:"sql9.freesqldatabase.com",
//     dialectModule: require('mysql2')
// });

const con=new Sequelize("juniorDB","root","",{dialect:'mysql',host:'localhost'});
  
module.exports=con;