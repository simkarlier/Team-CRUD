

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Action = mongoose.model('Action');

module.exports = function (app) {
  app.use('/api/v1/users', router);
};


/**
 * @api {post} /api/v1/users Create User
 * @apiName Create User
 * @apiGroup Users
 *
 * @apiParam {String}   firstname user firstname.
 * @apiParam {String}   lastname user lastname.
 * @apiParam {[String]} role user role(s).
 * @apiParam {String}   password user password.
 * @apiParam {String}   email user email.
 *
 *
 * @apiSuccess {String}   _id ID of the user.
 * @apiSuccess {String}   firstname user firstname.
 * @apiSuccess {String}   lastname user lastname.
 * @apiSuccess {[String]} role user role(s).
 * @apiSuccess {String}   password user password.
 * @apiSuccess {String}   email user email.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  *   {
  *     "_id": "56cc7a626957ab2c56ae6570",
  *     "firstname": "Marcel",
  *     "lastname": "Bimbo",
  *     "password": "lechrist",
  *     "email": "sdsdsdsds@sfsf.cdsfs",
  *     "__v": 0,
  *     "role": [
  *       "user"
  *     ]
  *   }
 *
 * @apiError User can't be created.
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



/**
 * @api {get} /api/v1/users Get User
 * @apiName Create User
 * @apiGroup Users
 *
 * @apiParam {String}   _id ID of the user.
 * @apiParam {String}   firstname user firstname.
 * @apiParam {String}   lastname user lastname.
 * @apiParam {[String]} role user role(s).
 * @apiParam {String}   password user password.
 * @apiParam {String}   email user email.
 *
 *
 * @apiSuccess {String}   _id ID of the user.
 * @apiSuccess {String}   firstname user firstname.
 * @apiSuccess {String}   lastname user lastname.
 * @apiSuccess {[String]} role user role(s).
 * @apiSuccess {String}   password user password.
 * @apiSuccess {String}   email user email.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  *   {
  *     "_id": "56cc7a626957ab2c56ae6570",
  *     "firstname": "Marcel",
  *     "lastname": "Bimbo",
  *     "password": "lechrist",
  *     "email": "sdsdsdsds@sfsf.cdsfs",
  *     "__v": 0,
  *     "role": [
  *       "user"
  *     ]
  *   }
 *
 * @apiError User can't be created.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.get('/', function(req,res,next){

  User.find(function(err, users){
    if(err){

      res.status(500).send(err);
      return;
    }
    res.send(users);

  })

});

function findUser(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!user) {
      res.status(404).send('User not found');
      return;
    }

    // Store the book in the request.
    req.user = user;

    next();
  });
}

router.get('/:id',findUser, function(req,res,next){

    res.send(req.user);

});

function findAction(req, res, next) {
  Action.find({authorId: req.user._id})
    // Do not forget to sort, as pagination makes more sense with sorting.
    .sort('date')
    .exec(function(err, actions) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      req.actions = actions;

      next();
    });
}

router.get('/:id/actions', findUser, findAction, function(req,res,next){
  res.send(req.actions);
});

function findActionByType(req, res, next) {
  Action.find({type: req.params.actionType})
    // Do not forget to sort, as pagination makes more sense with sorting.
    .sort('date')
    .exec(function(err, actionsByType) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      req.actionsByType = actionsByType;

      next();
    });
}

router.get('/:id/actions/:actionType', findUser, findActionByType, function(req,res,next){
  res.send(req.actionsByType);
});
