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
      .find()
      .where('ns')
      .equals(req.params.collection_id)
      // .where('query')
      // TODO - want to filter to specific type of query/update/etc. here... how?
      .exec(function(err, result) {
        res.send(result);
      });
});

module.exports = router;