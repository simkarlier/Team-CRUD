

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Action = mongoose.model('Action');

module.exports = function (app) {
  app.use('/api/v1/actions', router);
};


/**
 * @api {post} /api/v1/actions Create an action
 * @apiName Create an action
 * @apiGroup Actions
 *
 * @apiParam   {String="comment","statusChange"}   actionType  Type of action(s)
 * @apiParam   {Date}     date Date of the action.
 * @apiParam   {String}   newStatus The new status of the action (for type statusChange only).
 * @apiParam   {String}   comment Comment of the action (for type comment only).
 * @apiParam   {String}   authorId Author ID of the action.
 *
 * @apiSuccess   {String} _id Id of the action created
 * @apiSuccess   {String="comment","statusChange"}   actionType  Type of action(s)
 * @apiSuccess   {Date}     date Date of the action.
 * @apiSuccess   {String}   newStatus The new status of the action (for type statusChange only).
 * @apiSuccess   {String}   comment Comment of the action (for type comment only).
 * @apiSuccess   {String}   authorId Author ID of the action.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  *   {
  *     _id: "56ceccd871335d2d621e5cfc",
  *     type: "comment",
  *     date: "2015-06-21T00:00:00.000Z",
  *     newStatus: "solved",
  *     comment: "Salut c est un beau grafiti",
  *     authorId: "56cc6d3562872f3250733a05"
  *   }
 *
 * @apiError CantCreateAction The action can't be created.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ActionCantBeCreated"
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

/**
 * @api {get} /api/v1/actions Get all actions
 * @apiName Get all actions
 * @apiGroup Actions
 *
 *
 * @apiSuccess   {String} _id Id of the action
 * @apiSuccess   {String="comment","statusChange"}   actionType  Type of action(s)
 * @apiSuccess   {Date}     date Date of the action.
 * @apiSuccess   {String}   newStatus The new status of the action (for type statusChange only).
 * @apiSuccess   {String}   comment Comment of the action (for type comment only).
 * @apiSuccess   {String}   authorId Author ID of the action.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  *   {
  *     _id: "56ceccd871335d2d621e5cfc",
  *     type: "comment",
  *     date: "2015-06-21T00:00:00.000Z",
  *     newStatus: "solved",
  *     comment: "Salut c est un beau grafiti",
  *     authorId: "56cc6d3562872f3250733a05"
  *   }
 *
 * @apiError ActionsNotFound There's no action.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ActionsNotFound"
 *     }
 */
router.get('/', function(req,res,next){

  Action.find(function(err, actions){
    if(err){

      res.status(500).send(err);
      return;
    }
    res.send(actions);

  })

});

// function to find an action by ID
function findAction(req, res, next) {
  Action.findById(req.params.id, function(err, action) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!action) {
      res.status(404).send('Action not found');
      return;
    }

    // Store the book in the request.
    req.action = action;

    next();
  });
}

/**
 * @api {get} /api/v1/actions/:id Get an action by ID
 * @apiName Get an action by ID
 * @apiGroup Actions
 *
 *
 * @apiSuccess   {String} _id Id of the action
 * @apiSuccess   {String="comment","statusChange"}   actionType  Type of action(s)
 * @apiSuccess   {Date}     date Date of the action.
 * @apiSuccess   {String}   newStatus The new status of the action (for type statusChange only).
 * @apiSuccess   {String}   comment Comment of the action (for type comment only).
 * @apiSuccess   {String}   authorId Author ID of the action.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  *   {
  *     _id: "56ceccd871335d2d621e5cfc",
  *     type: "comment",
  *     date: "2015-06-21T00:00:00.000Z",
  *     newStatus: "solved",
  *     comment: "Salut c est un beau grafiti",
  *     authorId: "56cc6d3562872f3250733a05"
  *   }
 *
 * @apiError ActionsNotFound There's no action.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ActionsNotFound"
 *     }
 */
router.get('/:id', findAction, function(req,res,next){

  res.send(req.action);

});

// function to find actions by type
function findActionByType(req, res, next) {
  Action.find({type: req.params.actionType})
    // Do not forget to sort, as pagination makes more sense with sorting.
    .sort('-date')
    .exec(function(err, actionsByType) {
      if (err) {
        console.log('fd')
        res.status(500).send(err);
        return;
      }
      req.actionsByType = actionsByType;

      next();
    });
}

/**
 * @api {get} /api/v1/actions/type/:actionType  Get all actions by type
 * @apiName Get all actions by type
 * @apiGroup Actions
 *
 *
 * @apiSuccess   {String} _id Id of the action
 * @apiSuccess   {String="comment","statusChange"}   actionType  Type of action(s)
 * @apiSuccess   {Date}     date Date of the action.
 * @apiSuccess   {String}   newStatus The new status of the action (for type statusChange only).
 * @apiSuccess   {String}   comment Comment of the action (for type comment only).
 * @apiSuccess   {String}   authorId Author ID of the action.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  *   {
  *     _id: "56ceccd871335d2d621e5cfc",
  *     type: "comment",
  *     date: "2015-06-21T00:00:00.000Z",
  *     newStatus: "solved",
  *     comment: "Salut c est un beau grafiti",
  *     authorId: "56cc6d3562872f3250733a05"
  *   }
 *
 * @apiError ActionsNotFound There's no action.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ActionsNotFound"
 *     }
 */
router.get('/type/:actionType', findActionByType, function(req,res,next){

    res.send(req.actionsByType);

});
