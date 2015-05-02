profilerApp.controller('HomeController', function($scope, StatsService, usSpinnerService, $q, $state) {

	$scope.collections = [];
	$scope.selectedCollection = $scope.collections[0];

	StatsService.getAllCollections().then(function(collections) {
		$scope.collections = collections;
	});

	$scope.$watch('collections', function(newData) {
		$scope.selectedCollection = $scope.collections[0];
	});

	$scope.$watch('selectedCollection', updateAllCharts);

	$scope.$on('select-bar', function(event, bar) {
		$state.go('details', StatsService.getDetailsParams($scope.selectedCollection, bar));
	});

	function updateAllCharts(newData) {

		if(newData == undefined) {
			return;
		}

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