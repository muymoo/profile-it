var express = require('express');
var router = express.Router();

// Load Run model
require('../models/run');
var mongoose = require('mongoose');
var model = mongoose.model('Run');

// Get one run
router.get('/recent', function(req, res, next) {
	console.log(model);
	model.findOne(function(err, run){
		res.send('Last profiler run: ' + run.name);	
	});
});

// Insert a run (i.e. profile)
router.get('/profile', function(req, res, next) {
	// TODO: This should run a profiler task on the mongodb instance and return the result.
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
