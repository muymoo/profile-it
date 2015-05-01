var express = require('express');
var router = express.Router();
var shell = require('shelljs');
var LineByLineReader = require('line-by-line');
var q = require('q');

// Load Zip code model
require('../models/zip-with-index');
require('../models/zip');
var mongoose = require('mongoose');
var zipWithIndex = mongoose.model('ZipWithIndex');
var zip = mongoose.model('Zip');
var connection = mongoose.connection;
connection.setProfiling(2, function (err, doc) {
    console.error(err, doc);
});

var killProcess = function(pid){
    console.info('Killing:', pid);
	shell.exec('kill ' + pid);
}

var getZipCodes = function() {
	var zips = [];
	var lineReader = new LineByLineReader('/Users/204054399/development/uiuc/profile-it/server/data/zips.json');
	var deferred = q.defer();

	console.info('Reading in zip code data...')

	lineReader.on('error', function(error) {
		console.error(error);
		deferred.reject(error);
	});

	lineReader.on('line', function (line) {
   		zips.push(JSON.parse(line));
	});

	lineReader.on('end', function () {
		console.info('Completed reading in zip code data. Count:', zips.length);
		deferred.resolve(zips);
	});

	return deferred.promise;
}

var addToDatabase = function(items) {
	var deferred = q.defer();

	console.info('Adding zip codes to database...');

	// Create a bunch of items
	items.forEach(function(item) {
		zip.create(
			item,
			function (err, doc) {
    			if (err) return next(err);
			}
		);

		zipWithIndex.create(
			item,
			function (err, doc) {
    			if (err) return next(err);
			}
		);
	});

	console.info('Zip codes added.');
	deferred.resolve();
	return deferred.promise;
}

var findAllInDatabase = function() {
	var deferred = q.defer();

	model.find({ state: 'WI' }, function(err, all){
        console.info('Found ' + all.length + ' items.');
        deferred.resolve(all);
	});
	
	return deferred.promise;
}

var runDbTests = function() {
	getZipCodes()
		.then(addToDatabase)
		.then(findAllInDatabase);
};

var createSvg = function(stacksFileName, svgFileName) {
    console.info('Completed profiling. Processing results...');
    
    // We need to change into the tools directory because the stackcollapse.pl only works if it is running against a file in its directory
    shell.cd('./tools');
    shell.exec('./stackcollapse.pl ' + stacksFileName +' | ./flamegraph.pl --width=1000 > ../public/target/' + svgFileName);
    // Reset the current working directory 
    shell.cd('..');

    // Cache a copy for later use
    shell.cat('public/target/' + svgFileName).to('public/target/last.svg');
    console.info('Completed processing results. Created SVG.');
};

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
            createSvg(stacksFile, svg);
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
	setTimeout(runDbTests, 5000);

	// Kill the dtrace because it doesn't stop on its own
	setTimeout(killProcess.bind(null, dtrace.pid), 10000);
});

module.exports = router;
