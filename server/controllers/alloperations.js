var express = require('express');
var router = express.Router();
require('../models/systemprofile');

var mongoose = require('mongoose');
var systemProfile = mongoose.model('SystemProfile');

router.get('/lastDay', function(req, res, next) {
  var today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  console.log(today);
  console.log(yesterday);

  systemProfile
      .find({
        'ts': {
          $gt: yesterday,
          $lt: today
        }
      })
      // .where('ts') // time range
      // .gt(yesterday)
      // .lt(today)
      // .gt(new Date('2015-03-24T07:06:00.000Z'))
      // .lt(new Date('2015-03-24T07:08:00.000Z'))
      // .where('op') // can ignore certain types of operations 
      // .equals('query')
      // .where('ns')
      // .equals('my_database.system.profile') // limit to only certain collections (dbname.collection) - exclude my_database.system.profile
      .sort( { ts : -1 } ) // descending time
      .exec(function(err, result) {
        res.send(result);
      });
});

router.get('/aggLastDay', function(req, res, next) {
// http://docs.mongodb.org/manual/reference/operator/aggregation/group/
// db.sales.aggregate(
//    [
//       {
//         $group : {
//            _id : { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } },
//            totalPrice: { $sum: { $multiply: [ "$price", "$quantity" ] } },
//            averageQuantity: { $avg: "$quantity" },
//            count: { $sum: 1 }
//         }
//       }
//    ]
// )
// Model
// .aggregate({ $match: { age: { $gte: 21 }}})
// .unwind('tags')
// .exec(callback)

  var today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  console.log(today);
  console.log(yesterday);

  systemProfile
  // .find()
      .aggregate()
      .group({
        _id: {'ns':'$ns', 'op':'$op'},//'$ns',//null, // ns & op
        maxMillis: { $max: '$millis' },
        avgMillis: { $avg: "$millis" },
        minMillis: { $min: "$millis" },
        count: { $sum: 1 },
      })
      // .select('id maxMillis')
      // .find({
      //   'ts': {
      //     $gt: yesterday,
      //     $lt: today
      //   }
      // })
      // .where('ts') // time range
      // .gt(yesterday)
      // .lt(today)
      // .gt(new Date('2015-03-24T07:06:00.000Z'))
      // .lt(new Date('2015-03-24T07:08:00.000Z'))
      // .where('op') // can ignore certain types of operations 
      // .equals('query')
      // .where('ns')
      // .equals('my_database.system.profile') // limit to only certain collections (dbname.collection) - exclude my_database.system.profile
      // .sort( { ts : -1 } ) // descending time
      .exec(function(err, result) {
        console.log('IN');
        if (err) {
          console.log('ERROR',err);
        }
        res.send(result);
      });

});

module.exports = router;