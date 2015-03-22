var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var connection = mongoose.connection;

	//db.system.profile.find().limit(10).sort( { ts : -1 } ).pretty()

// Get one run
router.get('/last25', function(req, res, next) {

	var Last25 = mongoose.mquery(connection.collection('system.profile')).toConstructor();
  	Last25()
  		.find({}, function(err) {
  			console.log(err);
  		})
  		.limit(25)
  		.sort( { ts : -1 } )
  		.exec(function(err, result) {
  			console.log("RESULT", result);
  			res.send(result);
  		});
});

module.exports = router;