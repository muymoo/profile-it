var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

require('../models/systemprofile');

var mongoose = require('mongoose');
mongoose.set('debug', true)
var systemProfile = mongoose.model('SystemProfile');

router.get('/collection', function(req, res, next) {

  systemProfile
    .aggregate(
      [
        {
          $group: {
            _id: {'ns':'$ns'},
            maxMillis: { $max: '$millis' },
            avgMillis: { $avg: "$millis" },
            minMillis: { $min: "$millis" },
            count: { $sum: 1 },
          }
        }
      ]
    )
    .exec(function(err, result) {
      console.log('IN');
      if (err) {
        console.log('ERROR',err);
      }
      res.send(result);
    });

});

router.get('/collectionoperation', function(req, res, next) {

  systemProfile
    .aggregate(
      [
        {
          $group: {
            _id: {'ns':'$ns', 'op':'$op'},
            maxMillis: { $max: '$millis' },
            avgMillis: { $avg: "$millis" },
            minMillis: { $min: "$millis" },
            count: { $sum: 1 },
          }
        }
      ]
    )
    .exec(function(err, result) {
      console.log('IN');
      if (err) {
        console.log('ERROR',err);
      }
      res.send(result);
    });

});

router.get('/collection/:collection_name/operation', function(req, res, next) {

  systemProfile
    .aggregate(
      [
      { 
          $match: { 
            ns: { 
              $eq: req.params.collection_name
            }
          }
        },
        {
          $group: {
            _id: {'op':'$op', 'query':'$query', 'updateobj':'$updateobj'},
            maxMillis: { $max: '$millis' },
            avgMillis: { $avg: "$millis" },
            minMillis: { $min: "$millis" },
            count: { $sum: 1 },
          }
        },
        {
          $sort: {
            avgMillis: -1
          }
        },
        {
          $limit: 50
        }
      ]
    )
    .exec(function(err, result) {
      console.log('IN');
      if (err) {
        console.log('ERROR',err);
      }
      res.send(result);
    });

});


router.post('/collection/:collection_name/operation/id', function(req, res, next) {

  var operation = req.body.operation;
  var obj = req.body.obj;  // TODO at the moment only have query objs, so hardcoding - need to include updateobjs!!

  var systemProfileQuery = {
        ns: req.params.collection_name,
        op: operation
      };
  if(obj) {
    console.log("THERESANOBJ", obj);
    var parsed = JSON.parse(obj);
    console.log(parsed, parsed.path);
    systemProfileQuery['$where'] = "this.query && this.query.path && this.query.path === '" + parsed.path  + "'"//'/page9.js'"
  }

  console.log('HEREIT Is', systemProfileQuery);

  systemProfile
      .find(systemProfileQuery)
      .exec(function(err, result) {
        if(err) {
          console.log(err);
        }
        res.send(result);
      });
});

module.exports = router;