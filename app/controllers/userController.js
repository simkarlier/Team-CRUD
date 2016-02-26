

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
 * @api {get} /api/v1/users Get Users
 * @apiName Gets Users
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
 * @apiError There no user.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.get('/', function(req,res,next){

  User.find()
      .sort('lastname')
      .exec(function(err, users) {
          if (err) {
            res.status(500).send(err);
            return;
          }

          res.send(users);

      })

});



// function to find a user with his id, given in the url
function findUser(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!user) {
      res.status(404).send('User not found');
      return;
    }

    req.user = user;

    next();
  });
}


/**
 * @api {get} /api/v1/users/:id Get a User by Id
 * @apiName Get User
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
 * @apiError User can't be found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.get('/:id',findUser, function(req,res,next){

    res.send(req.user);

});

// function to find the actions made by a user
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


/**
 * @api {get} /api/v1/users/:id/actions Get a User actions
 * @apiName Get User actions
 * @apiGroup Users
 *
 * @apiParam {String}   _id ID of the action.
 * @apiParam {String}   type Type of the action (comment or statusChange).
 * @apiParam {Date}     date Date of the action.
 * @apiParam {String}   newStatus The new status of the action (for type statusChange only).
 * @apiParam {String}   comment Comment of the action (for type comment only).
 * @apiParam {String}   authorId Author ID of the action.
 *
 *
 * @apiSuccess {String}   _id ID of the action.
 * @apiSuccess   {String}   type Type of the action (comment or statusChange).
 * @apiSuccess   {Date}     date Date of the action.
 * @apiSuccess   {String}   newStatus The new status of the action (for type statusChange only).
 * @apiSuccess   {String}   comment Comment of the action (for type comment only).
 * @apiSuccess   {String}   authorId Author ID of the action.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    _id: "56ceccd871335d2d621e5cfc",
 *    type: "comment",
 *    date: "2015-06-21T00:00:00.000Z",
 *    newStatus: "solved",
 *    comment: "Salut c est un beau grafiti",
 *    authorId: "56cc6d3562872f3250733a05",
 *    __v: 0
 *  }
 *
 * @apiError No action for this user.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
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
