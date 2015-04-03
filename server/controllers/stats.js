var express = require('express');
var router = express.Router();
require('../models/systemprofile');

var mongoose = require('mongoose');
mongoose.set('debug', true)
var systemProfile = mongoose.model('SystemProfile');

router.get('/collections', function(req, res, next) {

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

router.get('/operations', function(req, res, next) {

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

module.exports = router;