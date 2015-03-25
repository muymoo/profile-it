var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var connection = mongoose.connection;

var SystemProfile = mongoose.mquery(connection.collection('system.profile')).toConstructor();

// Get one run
router.get('/last25', function(req, res, next) {
  //db.system.profile.find().limit(10).sort( { ts : -1 } ).pretty()

  SystemProfile()
  	.find({}, function(err) {
  		console.log(err);
  	})
  	.limit(25)
  	.sort( { ts : -1 } )
  	.exec(function(err, result) {
  		res.send(result);
  	});
});

router.get('/lastDay', function(req, res, next) {
// db.system.profile.find(
//                        {
//                         ts : {
//                               $gt : new ISODate("2012-12-09T03:00:00Z") ,
//                               $lt : new ISODate("2012-12-09T03:40:00Z")
//                              }
//                        }
//                       ).sort( { millis : -1 } )
// see how to make monggo queries here: http://mongoosejs.com/docs/queries.html
// and https://github.com/aheckmann/mquery#equals

var today = new Date();
var yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
console.log(today);
console.log(yesterday);

SystemProfile()
    .find()
    .where('ts') // time range
    .gt(yesterday)
    .lt(today)
    //.where('op') // can ignore certain types of operations 
    //.ne('command')
    .where('ns')
    .equals('my_database.testData') // limit to only certain collections (dbname.collection) - exclude my_database.system.profile
    .sort( { ts : -1 } ) // descending time
    .exec(function(err, result) {
      res.send(result);
    });
});

module.exports = router;