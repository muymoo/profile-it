profilerApp.factory('StatsService', function($http, $q) {

	var splitCharacter = ' - '; // use this to split the operation from the insert/updateobj for user readable data

	function makeCategoryString(obj) {
		var categoryString = obj.op;
		if(obj.query !== undefined) {
			categoryString += splitCharacter + JSON.stringify(obj.query);
		}
		if(obj.updateobj !== undefined) {
			categoryString += splitCharacter + JSON.stringify(obj.updateobj);
		}
		return categoryString;
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

	var operationsCountOverTime = function(collection) {
		var defer = $q.defer();
		get('/stats/operation/' + collection + '/recent').then(function(result) {
			var seriesObjs = {};

			for(var index in result) {
				var item = result[index];
						
				var seriesName = item._id.op;
				if(seriesObjs[seriesName] == undefined) { 	// var categoryString = makeCategoryString(item._id);
					seriesObjs[seriesName] = [];
				}

				seriesObjs[seriesName].push([Date.UTC(item._id.year, item._id.month - 1, item._id.day, item._id.hour - 1, item._id.minute -1), item.count]);
			}

			var series = [];
			for(obj in seriesObjs) {
				series.push({
					name: obj,
					data: seriesObjs[obj].reverse()
				});
			}

			defer.resolve({
				series: series
			});
		});
		return defer.promise;
	}

	var operationsMillisOverTime = function(collection) {
		var defer = $q.defer();
		get('/stats/operation/' + collection + '/recent').then(function(result) {

			var seriesObjs = {};

			for(var index in result) {
				var item = result[index];
						
				var seriesName = item._id.op;
				if(seriesObjs[seriesName] == undefined) { 	// var categoryString = makeCategoryString(item._id);
					seriesObjs[seriesName] = [];
				}
				
				seriesObjs[seriesName].push([Date.UTC(item._id.year, item._id.month - 1, item._id.day, item._id.hour - 1, item._id.minute -1), item.avgMillis]);
			}

			var series = [];
			for(obj in seriesObjs) {
				series.push({
					name: obj,
					data: seriesObjs[obj].reverse()
				});
			}

			defer.resolve({
				series: series
			});
		});
		return defer.promise;
	}

	return {
		topOperationsByTime: topOperationsByTime,
		topOperationsByCount: topOperationsByCount,
		getAllCollections: getAllCollections,
		operationsCountOverTime: operationsCountOverTime,
		operationsMillisOverTime: operationsMillisOverTime
	};

});