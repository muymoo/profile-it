// Load Zip code model
require('../models/zipwithindex');
require('../models/zip');
var jsonFileReader = require('./json-file-reader');
var mongoose = require('mongoose');
var path = require('path');
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
	jsonFileReader.getZipCodesFromFile(path.resolve('server/data/zips-5000s.json'))
		.then(addToDatabase);
}

var updateZipCodes = function() {

}

var findRangeOfZipCodes = function() {
	zip.find({
		_id: {
				$gt: 20000,
				$lt: 50000
			}
		}, function(err, all) {
			console.info('Found ' + all.length + ' zip codes between 20000 and 50000.');
		}
	);

	zipWithIndex.find({
		_id: {
				$gt: 20000,
				$lt: 50000
			}
		}, function(err, all) {
			console.info('Found ' + all.length + ' zip codes (indexed) between 20000 and 50000.');
		}
	);
}

var findZipCodesNearUIUC = function() {
	// Can only run on the indexed collection because GEO quereis require a 2dsphere index.
	zipWithIndex.geoNear(
		[-88.203631, 40.109522],
		{ 
			maxDistance : 0.002, 
			spherical : true 
		}, 
		function(err, all, stats) {
			console.info('Found ' + all.length + ' zip codes near UIUC.');
			console.info('Zip Codes near UIUC:', all);
		}
	);
}

var addUpPopulation = function() {
	// Map reduce?
}

var findAveragePopulationPerCity = function() {
	zip.aggregate( [
   		{ $group: { _id: { state: "$state", city: "$city" }, pop: { $sum: "$pop" } } },
   		{ $group: { _id: "$_id.state", avgCityPop: { $avg: "$pop" } } }
	], function(err, all) {
		console.info('Found ' + all.length + ' states and their average population.');
	});

	zipWithIndex.aggregate( [
   		{ $group: { _id: { state: "$state", city: "$city" }, pop: { $sum: "$pop" } } },
   		{ $group: { _id: "$_id.state", avgCityPop: { $avg: "$pop" } } }
	], function(err,all) {
		console.info('Found ' + all.length + ' states (indexed) and their average population.');
	});
}

var allQueries = {
	findWI: findWIInDatabase,
	findWIMultiple: findWIMultipleTimes,
	findRange: findRangeOfZipCodes,
	addMore: addMoreZipCodes,
	findAverage: findAveragePopulationPerCity,
	findNear: findZipCodesNearUIUC
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
	jsonFileReader.getZipCodesFromFile(path.resolve('server/data/small.json'))
		.then(addToDatabase);
}

exports = module.exports = queryRunner;