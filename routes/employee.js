var express=require('express');
var Employee=require('../models/company').Employee;
var Place=require('../models/company').Place;
var router=express.Router();
router.post('/register', function(req,res,next){
   var data={
       companyId:req.body.companyId,
       name:req.body.name,
       beaconID:req.body.beaconId,
       accessLevel:req.body.accessLevel
   }
   Employee.create(data).then(function(employee){
       if(!employee){
           res.status(600).send();
       } else {
           res.status(200).send();
       }
   })
})
router.get('/manage', isLoggedIn, function(req,res,next){
    Employee.findAll({
        where:{
            companyId:req.user.id
        },
        raw : true
    }).then(function(result){
        var goodRes=result.dataValues;
        console.log(result.dataValues);
        res.render('manage', {'employee':{result}})
    })
})
router.get('/working', isLoggedIn, function(req,res,next){
    Employee.findAll({
        where:{
            companyId:req.user.id,
            active:true
        }
    }).then(function(result){
        console.log(result);
        res.render('working', {'working':{result}})
    })
});
router.get('/analysis', isLoggedIn, function(req,res,next){
    Employee.findAll({
        where:{
            companyId:req.user.id
        },
        attributes:["daysAtWork","totalTimeWorked"]
    }).then(function(result){
        res.render('analysis', {'data':{result}});
    })
})
router.get('/lookup/:id', function(req,res,next){
    Place.findAll({
        where:{
            employeeId:req.params.id
        }
    }).then(function(place){
        var places=[];
        var startTime=null;
        var endTime=null;
        var placesAtWork=[];
        place.forEach(function(place) {
            var time = place.dataValues.endTime.split(':');
            var d = new Date(); // creates a Date Object using the clients current time
            d.setHours  ( time[0]); // set Time accordingly, using implicit type coercion
            d.setMinutes( time[1]); // you can pass Number or String, it doesn't matter
            d.setSeconds( time[2]);
            if(endTime!=null && d<endTime){
                placesAtWork.push({"name":place.dataValues.name, "startTime":place.dataValues.startTime, "endTime":place.dataValues.endTime});
            }
            if(endTime<d){
                if(startTime!=null && endTime!=null){
                    places.push({
                        "startTime":startTime,
                        "places":placesAtWork,
                        "endTime":endTime
                    });
                    placesAtWork=[];
                }
            }
            if(place.dataValues.main){
                console.log('a');
                var time = place.dataValues.startTime.split(':');
                var d = new Date(); // creates a Date Object using the clients current time
                d.setHours  ( time[0]); // set Time accordingly, using implicit type coercion
                d.setMinutes( time[1]); // you can pass Number or String, it doesn't matter
                d.setSeconds( time[2]);
                var time = place.dataValues.endTime.split(':');
                var d2 = new Date(); // creates a Date Object using the clients current time
                d2.setHours  ( time[0]); // set Time accordingly, using implicit type coercion
                d2.setMinutes( time[1]); // you can pass Number or String, it doesn't matter
                d2.setSeconds( time[2]);
                startTime=d;
                endTime=d2;
            }
        }, this);
        if(startTime!=null && endTime!=null){
           places.push({
                "startTime":startTime,
                "places":placesAtWork,
                "endTime":endTime
           });
        }
        console.log(places);
        res.render('lookup', {places:places});
    })
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/');
    }
}
module.exports=router;