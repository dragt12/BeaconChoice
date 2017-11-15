var sequelize=require('sequelize');
sequelize=new sequelize('main','hackyeah', 'Racjonalnytraktor2,',{
  host: 'hackyeah.database.windows.net',
  dialect: 'mssql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  dialectOptions: {
    encrypt: true
  },
  define:{
    raw:true
  }
});
module.exports=sequelize;