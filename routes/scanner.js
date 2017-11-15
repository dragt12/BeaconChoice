var express = require('express');
var sequelize=require('../config/sequelize');
var Scanner=require('../models/company').Scanner;
var Company=require('../models/company').Company;
var Place=require('../models/company').Place;
var Employee=require('../models/company').Employee;
var router = express.Router();
router.post('/create', function(req,res,next){
    Scanner.findOne({
        where:{
            'companyName':req.body.companyName,
            'scannerName':req.body.scannerName
        }
    }).then(function(scanner){
        if(scanner){
            res.status(600).send();
        } else {
            Company.findOne({
                where:{
                    'name':req.body.companyName,    
                }
            }).then(function(company){
                data={
                    companyId:company.id,
                    companyName:req.body.companyName,
                    scannerName:req.body.scannerName,
                    scannerLevel:req.body.scannerLevel,
                    main:req.body.isMain
                }
                Scanner.create(data).then(function(newCompany){
                    if(newCompany){
                        res.status(200).json({"scannerId":newCompany._id, "companyId":newCompany.companyId, "scannerName":newCompany.scannerName})
                    }
                })
            })
        }
    })
})
router.get('/getUUID/:companyId', function(req,res,next){
    Employee.findAll({
        where:{
            companyId:req.params.companyId
        },
        attributes:["beaconID"]
    }).then(function(id){
        res.status(200).send(id);
    })
})
router.post('/check', function(req,res,next){
    Scanner.findById(req.body.scannerId).then(function(scanner){
        if(scanner){
            var scannerLvl=parseInt(scanner.scannerLevel)
            Employee.findOne({
                where:{
                    beaconID:req.body.beaconId,
                    companyID:req.body.companyId
                }
            }).then(function(employee){
                if(parseInt(employee.accessLevel)<scannerLvl){
                    res.status(200).json({'beaconId':employee.name, "canEnter":"false"});
                } else {
                    if(!employee.active){
                        if(scanner.main){
                            console.log('a');
                            var daysSpliced=employee.days.split(" ");
                            var newDays=employee.days;
                            if(!(daysSpliced.includes((new Date()).toISOString().slice(0,10)))){
                                newDays+=(new Date()).toISOString().slice(0,10);
                            }
                            employee.update({
                                active: true,
                                days:newDays,
                                currentRoom:scanner.scannerName
                            }).then(function(){
                                var data={
                                    employeeId:employee.id,
                                    date:(new Date()).toISOString().slice(0,10),
                                    startTime:(new Date).toTimeString().slice(0,8).toString(),
                                    name:scanner.scannerName,
                                    main:true
                                }
                                Place.create(data).then(function(){
                                    res.status(200).send({'beaconId':employee.name, "canEnter":"true"})
                                })
                            });
                        } else {
                            res.status(600).send();
                        }       
                    } else {
                        Place.find({
                            where:{
                                employeeId:employee.id,
                                date:(new Date()).toISOString().slice(0,10),
                                endTime:null,
                                name:scanner.scannerName
                            }
                        }).then(function(place){
                            console.log((new Date()).toISOString().slice(0,10));
                            if(place){
                                if(scanner.main){
                                    console.log('a');
                                    employee.update({
                                        active:false
                                    }).then(function(){
                                        place.update({
                                            endTime:(new Date).toTimeString().slice(0,8).toString()
                                        }).then(function(){
                                            res.status(200).json({'beaconId':employee.name, "canEnter":"true"});
                                        })
                                    })
                                } else {
                                   Scanner.findOne({
                                        where:{
                                            companyID:req.body.companyId,
                                            main:true
                                        }
                                    }).then(function(scannerMain){
                                         employee.update({currentRoom:scannerMain.scannerName}).then(function(){
                                            place.update({
                                                    endTime:(new Date).toTimeString().slice(0,8).toString()
                                            }).then(function(){
                                                    res.status(200).json({'beaconId':employee.name, "canEnter":"true"});
                                            });
                                        });
                                    });
                                }
                            } else {
                                employee.update({currentRoom:scanner.scannerName}).then(function(){
                                    var data={
                                        employeeId:employee.id,
                                        date:(new Date()).toISOString().slice(0,10),
                                        startTime:(new Date).toTimeString().slice(0,8).toString(),
                                        name:scanner.scannerName,
                                        main:false
                                    }
                                    Place.create(data).then(function(){
                                        res.status(200).json({'beaconId':employee.name, "canEnter":"true"});
                                    })
                                });
                            }
                        })
                    }
                }
            })
        } else {
            res.status(600).send();
        }
    })
})

module.exports=router;