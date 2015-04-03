profilerApp.factory('StatsService', function($http, $q) {

	var getCollections = function() {
		var deferred = $q.defer();
		$http.get('/stats/collection').success(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};

	var getCollectionsOperations = function() {
		var deferred = $q.defer();
		$http.get('/stats/collectionoperation').success(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};

	var getOperations = function(collection) {
		var deferred = $q.defer();
		$http.get('/stats/collection/' + collection + '/operation').success(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};

	return {
		getCollections: getCollections,
		getCollectionsOperations: getCollectionsOperations,
		getOperations: getOperations
	};

});