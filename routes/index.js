var express = require('express');
var sequelize=require('../config/sequelize');
var Scanner=require('../models/company').Scanner;
var Employee=require('../models/company').Employee;
var Company=require('../models/company').Company;

var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/testData', function(req,res,next){
  Company.findOne({
  }).then(function(company){
      Scanner.create({
          companyId:company.id,
          companyName:company.name,
          scannerName:"test",
          scannerLevel:2,
          main:true
      })
      Scanner.create({
          companyId:company.id,
          companyName:company.name,
          scannerName:"testcant",
          scannerLevel:4,
          main:false
      })
      Scanner.create({
          companyId:company.id,
          companyName:company.name,
          scannerName:"testcan",
          scannerLevel:2,
          main:false
      })
      Employee.create({
        companyId:company.id,
        name:"Marcin Michno",
        beaconID:"abcdefg",
        accessLevel:3
      })  
  })
  
})
router.get('/showData', function(req,res,next){
  Company.find({}).then(function(companies){
    Scanner.find({}).then(function(scanner){
      Employee.find({}).then(function(employees){
        console.log(companies + employees + scanner)
      })
    })
  })
})
module.exports = router;
