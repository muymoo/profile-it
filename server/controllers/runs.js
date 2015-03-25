var express = require('express');
var router = express.Router();
var shell = require('shelljs');

// Load Run model
require('../models/run');
var mongoose = require('mongoose');
var model = mongoose.model('Run');
var connection = mongoose.connection;
connection.setProfiling(2, function (err, doc) {
	console.log(err, doc);
});

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
	model.create(
		{ 
			name: 'inserting2 ' + Date.now(), 
			start: Date.now(), 
			duration: 56 
		}, 
		function (err, doc) {
    		if (err) return next(err);
		}
	);
	model.create(
		{ 
			name: 'inserting3 ' + Date.now(), 
			start: Date.now(), 
			duration: 57 
		}, 
		function (err, doc) {
    		if (err) return next(err);
		}
	);
	model.create(
		{ 
			name: 'inserting4 ' + Date.now(), 
			start: Date.now(), 
			duration: 58 
		}, 
		function (err, doc) {
    		if (err) return next(err);
		}
	);

	model.findOne(function(err, run){
		console.log(run);	
	});

	model.find(function(err, all){
		console.log(all);	
	});

}

// TODO: GET THIS WORKING
// Insert a run (i.e. profile)
router.get('/profile', function(req, res, next) {
	shell.exec('mkdir public/target');
	// run profiler
	var dtrace = shell.exec('dtrace -x ustackframes=100 -n \'profile-1999 /execname == "mongod" && arg1/ { @[ustack()] = count(); } tick-60s { exit(0); }\' -o tools/out.stacks',
		{async:true},
		function(code, output){
			console.log('Completed profiling. Processing results...');
            shell.cd('./tools');
			shell.echo(shell.exec('./stackcollapse.pl out.stacks | ./flamegraph.pl').output).to('../public/target/out.svg');
			console.log('Completed processing results. Created SVG.');
			res.send({
				name: '12345',
				startTime: 'abc',
				duration: 'sometime',
				flamegraph: 'target/out.svg'
			});
		});

	setTimeout(runDbTests, 5000);

	// Kill the dtrace
	setTimeout(killProcess.bind(null, dtrace.pid), 10000);
});

module.exports = router;
