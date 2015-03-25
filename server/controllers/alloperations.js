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
SystemProfile()
    .find()
      // ts: {
      //   //'$gt' : new Date('2012-03-20T16:00:00.000Z')//,//1234, //new ISODate("2012-12-09T03:00:00Z")
      //   '$lt' : new Date('2015-03-25T16:00:00.000Z')//5678//new ISODate("2012-12-09T03:40:00Z")
      // }
      // op:{
      //   '$ne' : 'command'
      // }
    // }, function(err) {
    //   console.log("ERRRRR",err);
    // })
    .where('ts')
    .gt(new Date('2015-03-24T07:06:00.000Z')) // TODO this isn't working :( :(
    .lt(new Date('2015-03-24T07:08:00.000Z'))
    // .where('op')
    // .ne('command')
    .sort( { ts : -1 } )
    .exec(function(err, result) {
      res.send(result);
    });
});

module.exports = router;