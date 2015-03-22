var express = require('express');
var router = express.Router();
var shell = require('shelljs');

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

var killProcess = function(pid){
	console.log('Killing: ' + pid);
	shell.exec('kill ' + pid);
}

var runDbTests = function() {
	// Do something in MongoDB to profile
	model.create(
		{ 
			name: 'inserting ' + Date.now(), 
			start: Date.now(), 
			duration: 55 
		}, 
		function (err, doc) {
    		if (err) return next(err);
		}
	);

	model.findOne(function(err, run){
		console.log(run);	
	});
}

// TODO: GET THIS WORKING
// Insert a run (i.e. profile)
router.get('/profile', function(req, res, next) {
	shell.exec('mkdir public/target');
	// run profiler
	var dtrace = shell.exec('dtrace -x ustackframes=100 -n \'profile-99 /execname == "mongod" && arg1/ { @[ustack()] = count(); } tick-60s { exit(0); }\' -o public/target/out.stacks', 
		{async:true},
		function(code, output){
			console.log('DONE!');
			shell.exec('./server/tools/stackcollapse.pl public/target/out.stacks > public/target/out.folded');
			shell.exec('./server/tools/flamegraph.pl public/target/out.folded > public/target/out.svg');
			res.send({
				name: '12345',
				startTime: 'abc',
				duration: 'sometime',
				flamegraph: 'target/out.svg'
			});
		});
	
	setTimeout(runDbTests, 3000);

	// Kill the dtrace
	setTimeout(killProcess.bind(null, dtrace.pid), 5000);
});

module.exports = router;
