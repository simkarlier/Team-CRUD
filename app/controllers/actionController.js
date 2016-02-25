

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Action = mongoose.model('Action');

module.exports = function (app) {
  app.use('/api/v1/actions', router);
};


/**
 * @api {post} /api/v1/users Create User
 * @apiName Create User
 * @apiGroup Users
 *
 * @apiParam {String} firstname User firstname.
 * @apiParam {String} lastname User lastname.
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

  var action = new Action(req.body);

  action.save(function(err, createdAction){

    if(err){
      res.status(500).send(err);
      return;
    }

    res.send(createdAction);

  });
});


router.get('/', function(req,res,next){

  Action.find(function(err, actions){
    if(err){

      res.status(500).send(err);
      return;
    }
    res.send(actions);

  })

});
