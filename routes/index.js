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
      Employee.create({
        companyId:company.id,
        name:"Marcin Michno",
        beaconID:"48bc27e5262d17a4d50fad1867fe3007",
        accessLevel:3
      })
      Employee.create({
        companyId:company.id,
        name:"Arek Slowik",
        beaconID:"86b89d2815db3275a4dd9b0a7ee37f32",
        accessLevel:5
      })
      Employee.create({
        companyId:company.id,
        name:"Hubert Kleczek",
        beaconID:"3835b0be3ca5c1924658a5c7f623d219",
        accessLevel:997
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
