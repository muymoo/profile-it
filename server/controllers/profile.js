var express = require('express');
var router = express.Router();
var shell = require('shelljs');
var queryRunner = require('../services/database-query-runner');
var svgMaker = require('../services/svg-maker');

var killProcess = function(pid){
    console.info('Killing:', pid);
	shell.exec('kill ' + pid);
}

// Profile the database and return a flamegraph
router.get('/profile', function(req, res, next) {
	shell.mkdir('public/target');
    var startTime = Date.now();
    var stacksFile = startTime + '.stacks';
    var svg = startTime + '.svg';

	// Run dtrace profiler on mongod process
	var dtrace = shell.exec('dtrace -x ustackframes=100 -n \'profile-1999 /execname == "mongod" && arg1/ { @[ustack()] = count(); } tick-60s { exit(0); }\' -o tools/' + stacksFile,
		{async:true},
		function(){

            // Once it's done running the profiler, take the results and create an svg.
            svgMaker.createSvg(stacksFile, svg);
            var endTime = Date.now();

            // Send back the response with the location of the svg and some metadata
			res.send({
				name: 'Analysis',
				startTime: startTime,
				duration: (endTime - startTime)/1000,
				flamegraph: 'target/' + svg
			});
		});

    // Wait for the dtrace to warm up and then run some queries on the db to profile
	setTimeout(function() {
		var queries = req.query.queries;
		if(queries instanceof Array) {
			queryRunner.runQueries(queries);
		} else {
			queryRunner.runQueries([queries]);
		}
		
	}, 5000);

	// Kill the dtrace because it doesn't stop on its own
	setTimeout(killProcess.bind(null, dtrace.pid), 10000);
});

router.get('/populate', function(req, res, next) {
	queryRunner.addInitialZipCodes();
	res.send("Added zip codes to database.");
});

module.exports = router;
