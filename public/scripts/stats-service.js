profilerApp.factory('StatsService', function($http, $q) {

	var get = function(url) {
		var deferred = $q.defer();
		$http.get(url).success(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};

	var getAllCollections = function() {
		return get('/stats/allcollections');
	};

	var topOperationsByTime = function(collection) {
		return get('/stats/operationtime/' + collection);
	};

	var topOperationsByCount = function(collection) {
		return get('/stats/operationcount/' + collection);
	};

	var operationsCountOverTime = function(collection) {
		return get('/stats/lastoperations/count/' + collection);
	}

	var operationsMillisOverTime = function(collection) {
		return get('/stats/lastoperations/count/' + collection); // for now, just same query as count (since just last time anyway)
	}

	// var getCollections = function() {
	// 	return get('/stats/collection/' + collection);
	// };

	// var getCollectionsOperations = function() {
	// 	return get('/stats/collectionoperation');
	// };

	// var getOperations = function(collection) {
	// 	return get('/stats/collection/' + collection + '/operation');
	// };

	return {
		// getCollections: getCollections,
		// getCollectionsOperations: getCollectionsOperations,
		// getOperations: getOperations,
		topOperationsByTime: topOperationsByTime,
		topOperationsByCount: topOperationsByCount,
		getAllCollections: getAllCollections,
		operationsCountOverTime: operationsCountOverTime,
		operationsMillisOverTime: operationsMillisOverTime
	};

});