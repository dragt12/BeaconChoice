var passport=require('passport');
var sequelize=require('../config/sequelize');
var Company=require('../models/company').Company;
var LocalStrategy=require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var randomstring=require('randomstring');
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    Company.findById(id).then(function(user) {
        if (Company) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});
passport.use('local.signup', new LocalStrategy({
    usernameField:"email",
    passwordField:"password",
    passReqToCallback:true
}, function(req,email,password,done){
    Company.findOne({
        where: {
            email:email
        }
    }).then(function(cpn){
        console.log('a');
        if(cpn){
            return done(null, false, {message:"email"});
        } else {
            var userPassword=generateHash(password);
            var data = {
                email:email, 
                password:userPassword,
                name:req.body.name
            }
            console.log(data);
            Company.create(data).then(function(newUser, created){
                if(!newUser){
                    return done(null,false);
                } if(newUser){
                    return done(null, newUser);
                }
            })
        }
    })
}))
passport.use('local.signin', new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
}, function(email, password, done){
    Company.findOne({
        where: {
            'email':email
        }
    }).then(function(company){
        if(!company){
            return done(null, false, {message:"bad email/pass"});
        } 
        if(!validPassword(password, company.password)) {
			return done(null,false,{message:'Wrong password.'});
        }
        else {
            return done(null, company);
        }
    })
}))
function generateHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(5), null);
}
function validPassword(password, goodPass){
    return bCrypt.compareSync(password, goodPass);
}