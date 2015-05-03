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

var addToDatabase = function(items) {
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

var dropZipCodeCollections = function() {
	connection.db.dropCollection('zips');
	connection.db.dropCollection('zipwithindexes');
}

 var findWIMultipleTimes = function() {
	var i = 0;
	while(i < 10) {	
		findWIInDatabase();
		i++;
	}
}

 var findWIInDatabase = function() {
	zip.find({ state: 'WI' }, function(err, all){
        console.info('Found ' + all.length + ' items without an index.');
	});
	zipWithIndex.find({ state: 'WI' }, function(err, all){
        console.info('Found ' + all.length + ' items with an index.');
	});
}

var addMoreZipCodes = function() {
	console.info('Adding more zip codes...');
	jsonFileReader.getZipCodesFromFile('/Users/204054399/development/uiuc/profile-it/server/data/zips-6000s.json')
		.then(addToDatabase);
}

var updateZipCodes = function() {

}

var findARangeOfZipCodes = function() {

}

var findZipCodesInLatLon = function() {

}

var addUpPopulation = function() {
	// Map reduce?
}

var allQueries = {
	findWI: findWIInDatabase,
	findWIMultiple: findWIMultipleTimes,
	addMore: addMoreZipCodes
}

queryRunner.runQueries = function(queriesToRun) {
	var query;
	console.info('Running queries:', queriesToRun);
	queriesToRun.forEach(function(queryToRun) {
		query = allQueries[queryToRun];
		query();
	});
};

queryRunner.addInitialZipCodes = function() {
	dropZipCodeCollections();
	jsonFileReader.getZipCodesFromFile('/Users/204054399/development/uiuc/profile-it/server/data/small.json')
		.then(addToDatabase);
}

exports = module.exports = queryRunner;