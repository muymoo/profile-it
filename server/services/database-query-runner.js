// Load Zip code model
require('../models/zipwithindex');
require('../models/zip');
var jsonFileReader = require('./json-file-reader');
var mongoose = require('mongoose');
var zipWithIndex = mongoose.model('ZipWithIndex');
var zip = mongoose.model('Zip');
var connection = mongoose.connection;
connection.setProfiling(2, function (err, doc) {
    console.error(err, doc);
});

var queryRunner = {};

queryRunner.addToDatabase = function(items) {
	console.info('Adding ' + items.length + ' zip codes to database...');
	
	// Create a bunch of items
	var promise = zip.create(
		items,
		function (err, doc) {
			console.error(err);
		}
	);

	return promise.then( function () {
		zipWithIndex.create(
			items,
			function (err, doc) {
				console.error(err);
			}
		);
	});
}

queryRunner.findWIInDatabase = function() {
	console.info('Searching database for WI...');
	
	var i = 0;
	
	while(i < 10) {
		zip.find({ state: 'WI' }, function(err, all){
	        console.info('Found ' + all.length + ' items without an index.');
		});
		zipWithIndex.find({ state: 'WI' }, function(err, all){
	        console.info('Found ' + all.length + ' items with an index.');
		});
		i++;
	}

}

queryRunner.addInitialZipCodes = function() {
	jsonFileReader.getZipCodesFromFile('/Users/204054399/development/uiuc/profile-it/server/data/small.json')
		.then(addToDatabase);
}

queryRunner.addMoreZipCodes = function() {
	getZipCodesFromFile('/Users/204054399/development/uiuc/profile-it/server/data/zips-6000s.json')
		.then(addToDatabase);
}

queryRunner.updateZipCodes = function() {

}

queryRunner.findARangeOfZipCodes = function() {

}

queryRunner.findZipCodesInLatLon = function() {

}

queryRunner.addUpPopulation = function() {
	// Map reduce?
}

var allQueries = {
	findWI: queryRunner.findWIInDatabase,
	addMore: queryRunner.addMoreZipCodes
}

queryRunner.runQueries = function(queriesToRun) {
	var query;
	
	queriesToRun.forEach(function(queryToRun) {
		query = allQueries[queryToRun];
		query();
	});
};

exports = module.exports = queryRunner;