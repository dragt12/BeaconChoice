var express = require('express');
var passport=require('passport');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/register', function(req,res, next){
  res.render('register');
})
router.post('/webLogin', passport.authenticate('local.signin', { successRedirect: '/',
                                                                 failureRedirect: '/users/login' }))
router.post('/register', passport.authenticate('local.signup'), function(req,res,next){
  res.status(200).json({
    'id':req.user.id,
    'name':req.user.name
  });
});
router.post('/login', passport.authenticate('local.signin'), function(req,res,next){
  res.status(200).json({
      'id':req.user.id,
      'name':req.user.name
  });
})
module.exports = router;
