var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('api/v1/users', router);
};

router.post('/', function (req, res, next) {

  var user = new User(req.body);

  person.save(function(err, createdUser){

    if(err){
      res.status(500).send(err);
      return;
    }

    res.send(createdUser);

  });
});

router.get('/', function(req,res,next){

  User.find(function(err, users){
    if(err){

      res.status(500).send(err);
      return;
    }
    res.send(users);

  })

});
