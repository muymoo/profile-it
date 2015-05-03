profilerApp.controller('HomeController', function($scope, StatsService, usSpinnerService, $q, $state, $location) {

	$scope.collections = [];

	StatsService.getAllCollections().then(function(collections) {
		$scope.collections = collections;
	});

	$scope.$watch('collections', setSelectedCollection);

	$scope.$watch('selectedCollection', updateAllChartsAndUrl);

	$scope.$on('select-bar', function(event, category, seriesName) {
		$state.go('details', StatsService.getDetailsParams($scope.selectedCollection, category));
	});

	$scope.$on('select-timebased', function(event, category, seriesName) {
		$state.go('details', StatsService.getDetailsParams($scope.selectedCollection, seriesName));
	});

	function setSelectedCollection(newCollections) {

		if(newCollections.length === 0) {
			return; // do nothing the first time (when initialized to [])
		}

		var collectionQueryParam = $location.search().collection;

		if(collectionQueryParam) {
			for(var i in $scope.collections) {
				if(collectionQueryParam === $scope.collections[i]) {
					// if it's a valid collection still, use that as the selectedCollection
					$scope.selectedCollection = collectionQueryParam;
					return;
				}
			}
		}

		// otherwise, just set to the first one
		$scope.selectedCollection = $scope.collections[0];
	}

	function updateAllChartsAndUrl(newData) {

		if(newData == undefined) {
			return; // do nothing the first time (called with undefined)
		}

		// change url to have collection param
		$state.go('home.collection', {collection: newData},
			{location:"replace", inherit:false}); 

		usSpinnerService.spin('myspinner');

		$q.all([
			updateOperationsByTime(), 
			updateOperationsByCount(),
			updateOperationsCountOverTime(),
			updateOperationsMillisOverTime()
			])
			.then(function() {
				usSpinnerService.stop('myspinner');
			});
	}

	function updateOperationsByTime() {
		var defer = $q.defer();
		StatsService.topOperationsByTime($scope.selectedCollection).then(function(seriesAndCategories) {
			$scope.timeOperations = seriesAndCategories;
			defer.resolve();
		});
		return defer.promise;
	}

	function updateOperationsByCount() {
		var defer = $q.defer();
		StatsService.topOperationsByCount($scope.selectedCollection).then(function(seriesAndCategories) {
			$scope.countOperations = seriesAndCategories;
			defer.resolve();
		});
		return defer.promise;
	}

	function updateOperationsCountOverTime() {
		var defer = $q.defer();
		StatsService.operationsCountOverTime($scope.selectedCollection).then(function(series) {
			$scope.countOverTime = series;
			defer.resolve();
		});
		return defer.promise;
	}

	function updateOperationsMillisOverTime() {
		var defer = $q.defer();
		StatsService.operationsMillisOverTime($scope.selectedCollection).then(function(series) {
			$scope.millisOverTime = series;
			defer.resolve();
		});
		return defer.promise;
	}

});