var express = require('express');
router = express.Router(),
mongoose = require('mongoose'),
Issue = mongoose.model('Issue');
 

module.exports = function (app) {
  app.use('/api/v1/issues', router);
};


/**
 * @api {post} /api/v1/issues Create User information
 * @apiName Create an issue
 * @apiGroup Issues
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

  var issue = new Issue(req.body);

  issue.save(function(err, createdIssue){

    if(err){
      res.status(500).send(err);
      return;
    }

    res.send(createdIssue);

  });
});



router.get('/', function(req,res,next){
  var criteria={};

  var page = req.query.page ? parseInt(req.query.page, 10) : 1,
      pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 30;
  
  var offset = (page - 1) * pageSize,
      limit = pageSize;

  var sort="creation_date";
  
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
  } else if (req.query.tags) {
    criteria.status = req.query.status;
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
        .exec(function(err, issues) {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res.send(issues);
        })
        .populate("User");
    })
  })
});

