var express = require('express');
var router = express.Router();
require('../models/run');
var mongoose = require('mongoose');
var model = mongoose.model('Run');

/* GET runs listing. */
router.get('/', function(req, res, next) {
	console.log(model);
	model.findOne(function(err, run){
		res.send('Last profiler run: ' + run.name);	
	});
});

router.get('/profile', function(req, res, next) {
	model.create(
		{ 
			name: 'inserting ' + Date.now(), 
			start: Date.now(), 
			duration: 55 
		}, 
		function (err, doc) {
    		if (err) return next(err);
    		res.send(doc);
		}
	);
});

module.exports = router;
