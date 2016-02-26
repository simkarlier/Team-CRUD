var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
IssueType = mongoose.model('IssueType');


module.exports = function (app) {
  app.use('/api/v1/issueTypes', router);
};

/**
 * @api {post} /api/v1/issueTypes Create an issue type
 * @apiName Create an issue type
 * @apiGroup issueTypes
 *
 * @apiParam {String}   name Name of the issue type.
 * @apiParam {String}   author Id of the author of the new type.
 *
 *
 * @apiSuccess {String}   _id ID of the issue type.
 * @apiSuccess {String}   name Name of the issue type.
 * @apiSuccess {String}   author Id of the author of the new type.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    _id: "56d013305456626274ea6071",
 *    name: "Grafiti",
 *    author: "56cc793a922ac0e6542d88df",
 *    __v: 0
 *  }
 *
 * @apiError Can't create the issueType.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "IssueTypeCantBeCreated"
 *     }
 */
router.post('/', function (req, res, next) {

  var issueType = new IssueType(req.body);

  issueType.save(function(err, createdIssueType){

    if(err){
      res.status(500).send(err);
      return;
    }

    res.send(createdIssueType);

  });
});

/**
 * @api {get} /api/v1/issueTypes Get issue types
 * @apiName Get issue types
 * @apiGroup issueTypes
 *
 *
 * @apiSuccess {String}   _id ID of the issue type.
 * @apiSuccess {String}   name Name of the issue type.
 * @apiSuccess {String}   author Id of the author of the new type.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    _id: "56d013305456626274ea6071",
 *    name: "Grafiti",
 *    author: "56cc793a922ac0e6542d88df",
 *    __v: 0
 *  }
 *
 * @apiError There's no issueType.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "IssueTypeCantBeFound"
 *     }
 */
router.get('/', function(req,res,next){

  IssueType.find()
      .sort('name')
      .exec(function(err, issuetypes) {
          if (err) {
            res.status(500).send(err);
            return;
          }

          res.send(issuetypes);

      })

});
