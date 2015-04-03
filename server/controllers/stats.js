var express = require('express');
var router = express.Router();
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

router.get('/collection/:collection_id/operation', function(req, res, next) {

  systemProfile
    .aggregate(
      [
      { 
          $match: { 
            ns: { 
              $eq: req.params.collection_id
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


router.get('/collection/:collection_id/operation/:operation_id', function(req, res, next) {

  systemProfile
      .find({
        ns: req.params.collection_id,
        op: 'query',
        $where: "this.query && this.query.path && this.query.path === '/page9.js'"
      })
      .exec(function(err, result) {
        if(err) {
          console.log(err);
        }
        res.send(result);
      });
});

module.exports = router;