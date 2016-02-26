var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Action = mongoose.model('Action'),
Issue = mongoose.model('Issue');


module.exports = function (app) {
  app.use('/api/v1/issues', router);
};


/**
 * @api {post} /api/v1/issues Create an issue
 * @apiName Create an issue
 * @apiGroup Issues
 *
 * @apiParam {String} name name of the issue
 * @apiParam {Id} author author's id
 * @apiParam {String} description description of the issue
 * @apiParam {String[]} tags an array of tags
 * @apiParam {Number[]} geometry.coordinates the coordinates of the issue (lat,long)
 * @apiParam {String="created", "acknowledged", "assigned", "in_progress", "solved", "rejected"} status status of the issue
 * @apiParam {Id} responsible_user responsible user's id
 * @apiParam {Action[]} actions the actions of the issue
 * @apiParam {Date} creation_date date of creation
 *
 * @apiSuccess {Id} _id id of the issue
 * @apiSuccess {String} name name of the issue
 * @apiSuccess {Id} author author's id
 * @apiSuccess {String} description description of the issue
 * @apiSuccess {String[]} tags an array of tags
 * @apiSuccess {Number[]} geometry.coordinates the coordinates of the issue (lat,long)
 * @apiSuccess {String="created", "acknowledged", "assigned", "in_progress", "solved", "rejected"} status status of the issue
 * @apiSuccess {Id} responsible_user responsible user's id
 * @apiSuccess {Action[]} actions the actions of the issue
 * @apiSuccess{Date} creation_date date of creation
 *
 * @apiParamExample {json} Request-Example:
 *  {
  *  "name":"Incendie",
   * "author": "56cec2b5310859ee16a3ec59",
    *"type": "Incendie",
    *"tags":["ny","yverdon","oups"],
    *"description":"Graffiti spotted at the train station",
    *"geometry":{
    *    "coordinates":[46.2,7.34]
    *  },
    *"status" : "created",
    *"responsible_user" : "56cec2b5310859ee16a3ec59",
    *"actions":[],
    *"creation_date" :"2016-02-25"
    *}
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500
 */
router.post('/', function (req, res, next) {

  var issue = new Issue(req.body);

  issue.save(function(err, createdIssue){

    if(err){
      res.status(500).send(err);
      return;
    }

    res.send(createdIssue);

  });
});



/**
 * @api {get} /api/v1/issues List the issues
 * @apiName List the issues
 * @apiGroup Issues
 *
 * @apiParam {String} status
 * @apiParam {String[]} tags
 * @apiParam {Date} start the start date
 * @apiParam {Date} end the end date
 * @apiParam {String} sort=creation_date the sort field
 * @apiParam {Number} page page number
 * @apiParam {Number} pageSize page size
 *
 * @apiSuccessExample Success-Response:
 [
  {
    "_id": "56ced41fdb8b53091c1b9712",
    "name": "Incendie",
    "author": {
      "firstname": "Simon",
      "lastname": "Carlier",
      "email": "admin@simka.ch",
      "role": [
        "staff"
      ]
    },
    "type": "Incendie",
    "description": "Graffiti spotted at the train station",
    "status": "created",
    "responsible_author": "56cec2b5310859ee16a3ec59",
    "creation_date": "2016-02-23T00:00:00.000Z",
    "__v": 0,
    "actions": [],
    "geometry": {
      "coordinates": [
        46.2,
        7.34
      ],
      "type": "point"
    },
    "tags": [
      "ny",
      "yverdon",
      "oups"
    ]
  },
  {
    "_id": "56ced76c0137995a1d0e8993",
    "name": "Incendie",
    "author": {
      "firstname": "Simon",
      "lastname": "Carlier",
      "email": "admin@simka.ch",
      "role": [
        "staff"
      ]
    },
    "type": "Incendie",
    "description": "Graffiti spotted at the train station",
    "status": "created",
    "responsible_user": {
      "firstname": "Simon",
      "lastname": "Carlier",
      "email": "admin@simka.ch",
      "role": [
        "staff"
      ]
    },
 */

router.get('/', function(req,res,next){
  var criteria={};

  var page = req.query.page ? parseInt(req.query.page, 10) : 1,
      pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 30;

  var offset = (page - 1) * pageSize,
      limit = pageSize;


  var sort="-creation_date";
  

  //GIS Implementation
  var lat = req.query.lat,
  lng = req.query.lng,
  dist = req.query.dist;
  
  if (lat && lng && dist) {
    criteria.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [
            parseFloat(lng),
            parseFloat(lat)
          ]
        },
        $maxDistance: parseInt(dist, 10)
      }
    };
  }


  if(req.query.type){
    criteria.type = req.query.type;
  }

  //in case sort is specified => using the one specified
  if(req.query.sort){
    sort = req.query.sort;
  }

  // Filter by tags, multi-tag possible
  if (typeof(req.query.tags) == "object" && req.query.tags.length) {
    criteria.tags = { $in: req.query.tags };
  } else if (req.query.tags) {
    criteria.tags = req.query.tags;
  }

   // Filter by status, multi-status possible
  if (typeof(req.query.status) == "object" && req.query.status.length) {
    criteria.status = { $in: req.query.status };
  } else if (req.query.status) {
    criteria.status = req.query.status;
  }
  if(req.query.start || req.query.end){

    if(req.query.start && req.query.end){
       criteria.creation_date = {
        $gte : new Date(req.query.start),
        $lte : new Date(req.query.end)
      }
    }
    if(req.query.start){
       criteria.creation_date = {
        $gte : new Date(req.query.start)
      }
    }

    if(req.query.end){
       criteria.creation_date = {
        $lte : new Date(req.query.end)
      }
    }

  }

  Issue.count(function(err, totalCount) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    Issue.count(criteria, function(err, filteredCount) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.set('X-Pagination-Page', page);
      res.set('X-Pagination-Page-Size', pageSize);
      res.set('X-Pagination-Total', totalCount);
      res.set('X-Pagination-Filtered-Total', filteredCount);

      Issue.find(criteria)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .populate("author", '-_id -__v -password')
        .populate("responsible_user", '-_id -__v -password')
        .exec(function(err, issues) {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res.send(issues);
        })
    })
  })
});


/**
 * @api {get} /api/v1/issues/:id
 * @apiName List one issue
 * @apiGroup Issues
 *
 * @apiParam {:id} id of the issue
 * @apiParam {String} lastname user lastname.

 *
 * @apiSuccessExample Success-Response:
  [
  {
    "_id": "56ced76c0137995a1d0e8993",
    "name": "Incendie",
    "author": {
      "firstname": "Simon",
      "lastname": "Carlier",
      "email": "admin@simka.ch",
      "role": [
        "staff"
      ]
    },
    "type": "Incendie",
    "description": "Graffiti spotted at the train station",
    "status": "created",
    "responsible_user": {
      "firstname": "Simon",
      "lastname": "Carlier",
      "email": "admin@simka.ch",
      "role": [
        "staff"
      ]
    },
    "creation_date": "2016-02-23T00:00:00.000Z",
    "__v": 0,
    "actions": [],
    "geometry": {
      "coordinates": [
        46.2,
        7.34
      ],
      "type": "point"
    },
    "tags": [
      "ny",
      "yverdon",
      "oups"
    ]
  }
]
- */
router.get('/:id', function(req,res,next){
  var criteria={};
  criteria._id = req.params.id;

  Issue.find(criteria)
    .populate("author", '-_id -__v -password')
    .populate("responsible_user", '-_id -__v -password')
    .exec(function(err, issues) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send(issues);
    })
});


/**
 * @api {post} /api/v1/issues/:id/actions Insert an action for an issue
 * @apiName Insert an action for an issue Insert an action for an issue
 * @apiGroup Issues
 *
 * @apiParam {String="comment","statusChange"} type type of action
 * @apiParam {Date} date date
 @apiParam {Id} authorId the id of the author
 @apiParam {String} comment the text of the comment if stated
 @apiParam {String="created", "acknowledged", "assigned", "in_progress", "solved", "rejected"} newStatus the new status to change

 *
 * @apiSuccessExample Success-Response:

{
    "type":"comment",
    "date":"2016-02-25",
    "comment":"fine API!",
    "authorId":"56ced76c0137995a1d0e8993"
}

OR

{
    "type":"statusChange",
    "date":"2016-02-25",
    "newStatus":"solved",
    "authorId":"56ced76c0137995a1d0e8993"
}

- */
router.post('/:id/actions', function(req,res,next){
  var action = new Action(req.body);

  //creates the action
  action.save(function(err, createdAction){

    if(err){
      res.status(500).send(err);
      return;
    }

    var criteria={};
    criteria._id = req.params.id;

    if(createdAction){
        Issue.findOne(criteria,function(err, foundIssue) {
          if (err) {
            res.status(500).send(err);
            return;
          }

          //add the last action to the client
          if(foundIssue.actions.length > 0){
            foundIssue.actions.push(createdAction._id);
          } else{
            foundIssue.actions = [createdAction._id];
          }

          if(createdAction.newStatus){
            foundIssue.status = createdAction.newStatus;
          }

          foundIssue.save(function(err, createdAction) {
            if (err) {
              res.status(500).send(err);
              return;
            }
            res.send(createdAction);
          });

        });
    }
  });
});



router.get('/:id/actions', function(req,res,next){
  var criteria={};

  var page = req.query.page ? parseInt(req.query.page, 10) : 1,
      pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 30;

  var offset = (page - 1) * pageSize,
      limit = pageSize;

  var sort="-date";

  //in case sort is specified => using the one specified
  if(req.query.sort){
    sort = req.query.sort;
  }

  if(req.query.type){
    criteria.type = req.query.type;
  }

  if(req.query.start || req.query.end){

    if(req.query.start && req.query.end){
      criteria.date = {
        $gte : new Date(req.query.start),
        $lte : new Date(req.query.end)
      }
    }
    if(req.query.start){
      criteria.date = {
        $gte : new Date(req.query.start)
      }
    }

    if(req.query.end){
      criteria.date = {
      $lte : new Date(req.query.end)
      }
    }
  }


  Action.count(function(err, totalCount) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    Action.count(criteria, function(err, filteredCount) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.set('X-Pagination-Page', page);
      res.set('X-Pagination-Page-Size', pageSize);
      res.set('X-Pagination-Total', totalCount);
      res.set('X-Pagination-Filtered-Total', filteredCount);

      Action.find(criteria)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .populate("authorId",'-_id -__v -password')
        .exec(function(err, actions) {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res.send(actions);
        })
    })
  });

})
