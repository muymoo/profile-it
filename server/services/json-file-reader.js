var LineByLineReader = require('line-by-line');
var q = require('q');

var getZipCodesFromFile = function(absoluteFilePath) {
	var zips = [];
	var lineReader = new LineByLineReader(absoluteFilePath);
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