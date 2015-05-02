profilerApp.factory('StatsService', function($http, $q) {

	var get = function(url) {
		var deferred = $q.defer();
		$http.get(url).success(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};

	var getAllCollections = function() {
		return get('/stats/collection');
	};

	var topOperationsByTime = function(collection) {
		return get('/stats/operation/' + collection + '?sortBy=avgMillis');
	};

	var topOperationsByCount = function(collection) {
		return get('/stats/operation/' + collection + '?sortBy=count');
	};

	var operationsCountOverTime = function(collection) {
		return get('/stats/operation/' + collection + '/recent');
	}

	var operationsMillisOverTime = function(collection) {
		return get('/stats/operation/' + collection + '/recent');
	}

	return {
		topOperationsByTime: topOperationsByTime,
		topOperationsByCount: topOperationsByCount,
		getAllCollections: getAllCollections,
		operationsCountOverTime: operationsCountOverTime,
		operationsMillisOverTime: operationsMillisOverTime
	};

});