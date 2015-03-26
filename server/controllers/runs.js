var express = require('express');
var router = express.Router();
var shell = require('shelljs');

// Load Run model
require('../models/run');
var mongoose = require('mongoose');
var model = mongoose.model('Run');
var connection = mongoose.connection;
connection.setProfiling(2, function (err, doc) {
    console.error(err, doc);
});

// Get one run
router.get('/recent', function(req, res, next) {
    console.info(model);
	model.findOne(function(err, run){
		res.send('Last profiler run: ' + run.name);	
	});
});

var killProcess = function(pid){
    console.info('Killing:', pid);
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
        console.info(run);
	});

	model.find(function(err, all){
        console.info(all);
	});

}

var createSvg = function(stacksFileName, svgFileName) {
    console.info('Completed profiling. Processing results...');
    shell.cd('./tools');
    shell.echo(shell.exec('./stackcollapse.pl ' + stacksFileName +' | ./flamegraph.pl --width=1000').output).to('../public/target/' + svgFileName);
    console.info('Completed processing results. Created SVG.');
};

// Profile the database and return a flamegraph
router.get('/profile', function(req, res, next) {
	shell.exec('mkdir public/target');
    var startTime = Date.now();
    var stacksFile = startTime + '.stacks';
    var svg = startTime + '.svg';

	// Run dtrace profiler on mongod process
	var dtrace = shell.exec('dtrace -x ustackframes=100 -n \'profile-1999 /execname == "mongod" && arg1/ { @[ustack()] = count(); } tick-60s { exit(0); }\' -o tools/' + stacksFile,
		{async:true},
		function(){
            // Once it's done, take the results and create an svg.
            createSvg(stacksFile, svg);
            var endTime = Date.now();

            // Send back the response with the location of the svg and some metadata
			res.send({
				name: '12345',
				startTime: startTime,
				duration: (endTime - startTime)/1000,
				flamegraph: 'target/' + svg
			});
		});

    // Wait for the dtrace to warm up and then run some queries on the db to profile
	setTimeout(runDbTests, 5000);

	// Kill the dtrace because it doesn't stop on its own
	setTimeout(killProcess.bind(null, dtrace.pid), 10000);
});

module.exports = router;
