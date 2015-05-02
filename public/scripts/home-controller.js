profilerApp.controller('HomeController', function($scope, StatsService, usSpinnerService, $q, $state) {

	$scope.collections = [];
	$scope.selectedCollection = $scope.collections[0];
	$scope.$watch('collections', function(newData) {
		$scope.selectedCollection = $scope.collections[0];
	});

	StatsService.getAllCollections().then(function(collections) {
		$scope.collections = collections;
	});

	$scope.$watch('selectedCollection', function(newData) {

		if(newData == undefined) {
			return;
		}

		usSpinnerService.spin('myspinner');
		$q.all([
			updateOperationsByTime(newData), 
			updateOperationsByCount(newData),
			updateOperationsCountOverTime(newData),
			updateOperationsMillisOverTime(newData)
			]).then(function() {
			usSpinnerService.stop('myspinner');
		});
	});

	$scope.$on('select-bar', function(event, x) {
		var split = x.split(splitCharacter);

		var params = {
			collection: $scope.selectedCollection, 
			operation: split[0]
		};

		if(split.length > 1) {
			params['obj']=split[1];
		}
		if(split.length > 2) {
			alert('ruh roh');
			console.log(split);
		}

		$state.go('details', params);
	});
	
	function updateOperationsByTime(collection) {
		var defer = $q.defer();
		StatsService.topOperationsByTime(collection).then(function(seriesAndCategories) {
			$scope.timeOperations = seriesAndCategories;
			defer.resolve();
		});
		return defer.promise;
	}

	function updateOperationsByCount(collection) {
		var defer = $q.defer();
		StatsService.topOperationsByCount(collection).then(function(seriesAndCategories) {
			$scope.countOperations = seriesAndCategories;
			defer.resolve();
		});
		return defer.promise;
	}

	function updateOperationsCountOverTime(collection) {
		var defer = $q.defer();
		StatsService.operationsCountOverTime(collection).then(function(series) {
			$scope.countOverTime = series;
			defer.resolve();
		});
		return defer.promise;
	}

	function updateOperationsMillisOverTime(collection) {
		var defer = $q.defer();
		StatsService.operationsMillisOverTime(collection).then(function(series) {
			$scope.millisOverTime = series;
			defer.resolve();
		});
		return defer.promise;
	}

});