

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/api/v1/users', router);
};


/**
 * @api {post} /api/v1/users Create User information
 * @apiName Create User
 * @apiGroup Developper
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.post('/', function (req, res, next) {

  var user = new User(req.body);

  user.save(function(err, createdUser){

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
