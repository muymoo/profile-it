profilerApp.factory('StatsService', function($http, $q) {

	var splitCharacter = ' - '; // use this to split the operation from the query object for user readability

	function makeCategoryString(obj) {
		var categoryString = obj.op;
		if(obj.query !== undefined && obj.query !== 'HIDE-INSERT-OBJ') { // hide insert objects since they're each unique
			categoryString += splitCharacter + JSON.stringify(obj.query);
		}
		return categoryString;
	}

	var getDetailsParams = function(collection, userReadableOperationQuery) {
		var operationAndQuery = userReadableOperationQuery.split(splitCharacter);
		var operation = operationAndQuery[0];

		var params = {
			collection: collection, 
			operation: operation
		};

		if(operationAndQuery.length > 1) {
			params['query'] = operationAndQuery[1];
		}

		return params;
	}

	var get = function(url) {
		var deferred = $q.defer();
		$http.get(url).success(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};

	var getAllCollections = function() {
		var defer = $q.defer();
		get('/stats/collection').then(function(results) {
			var collections = [];
			for(i in results) {
				collections.push(results[i]._id.ns);
			}
			defer.resolve(collections);
		});
		return defer.promise;
	};

	var topOperationsByTime = function(collection) {
		var defer = $q.defer();
		get('/stats/operation/' + collection + '?sortBy=avgMillis').then(function(result) {
			var categories = [];
			var series = [{
				name: 'Max Millis',
				data: []
			},{
				name: 'Avg Millis',
				data: []
			},{
				name: 'Min Millis',
				data: []
			}];

			for(var index in result) {
				var item = result[index];

				var categoryString = makeCategoryString(item._id);
							
				categories.push(categoryString);
				series[0].data.push(item.maxMillis);
				series[1].data.push(item.avgMillis);
				series[2].data.push(item.minMillis);
			}
			
			defer.resolve({
				series: series,
				categories: categories
			});
		});
		return defer.promise;
	};

	var topOperationsByCount = function(collection) {
		var defer = $q.defer();
		get('/stats/operation/' + collection + '?sortBy=count').then(function(result) {
			var categories = [];
			var series = [{
				name: 'Count',
				data: []
			}];

			for(var index in result) {
				var item = result[index];

				var categoryString = makeCategoryString(item._id);
							
				categories.push(categoryString);
				series[0].data.push(item.count);
			}

			defer.resolve({
				series: series,
				categories: categories
			});
		});
		return defer.promise;
	};

	var makeTimeBasedSeries = function(factor, result) {
		var pointsForEachSeries = {};

		for(var index in result) {
			var item = result[index];
			var seriesName = makeCategoryString(item._id);

			if(pointsForEachSeries[seriesName] == undefined) {
				pointsForEachSeries[seriesName] = [];
			}

			var x = Date.UTC(item._id.year, item._id.month - 1, item._id.day, item._id.hour - 1, item._id.minute -1);
			var y = item[factor];
			pointsForEachSeries[seriesName].push([x, y]);
		}

		var series = [];
		for(seriesName in pointsForEachSeries) {
			series.push({
				name: seriesName,
				data: pointsForEachSeries[seriesName].reverse() // reverse so in increasing order for highcharts
			});
		}

		return series;
	}

	var operationsCountOverTime = function(collection) {
		var defer = $q.defer();
		get('/stats/operation/' + collection + '/recent').then(function(result) {
			var series = makeTimeBasedSeries('count', result);
			defer.resolve({
				series: series
			});
		});
		return defer.promise;
	}

	var operationsMillisOverTime = function(collection) {
		var defer = $q.defer();
		get('/stats/operation/' + collection + '/recent').then(function(result) {
			var series = makeTimeBasedSeries('avgMillis', result);
			defer.resolve({
				series: series
			});
		});
		return defer.promise;
	}

	return {
		getDetailsParams: getDetailsParams,
		topOperationsByTime: topOperationsByTime,
		topOperationsByCount: topOperationsByCount,
		getAllCollections: getAllCollections,
		operationsCountOverTime: operationsCountOverTime,
		operationsMillisOverTime: operationsMillisOverTime
	};

});