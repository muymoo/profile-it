profilerApp.controller('ComparisonController', function($scope, StatsService, DetailsService) {

	$scope.allCollections = [];
	$scope.selectedCollections = [];

	$scope.allOperationsForCollections = {};
	$scope.allOperations = [];
	$scope.selectedOperations = [];

	$scope.nscanned = {
		series: [{
			name: 'Number documents scanned in index',
			data: []
		}],
		categories: []
	};

	StatsService.getAllCollections().then(function(collections) {
		$scope.allCollections = collections;
	});

	$scope.$watch('selectedCollections', function(newSelectedCollections) {

		if(newSelectedCollections.length === 0) {
			$scope.allOperationsForCollections = {};
			return;
		}

		for(var i in newSelectedCollections) {

			StatsService.getAllOperations(newSelectedCollections[i]).then(function(newOperations) {
				$scope.allOperationsForCollections[newSelectedCollections[i]] = newOperations;
			});
		}

	}, true);

	$scope.$watch('allOperationsForCollections', function(newOperationsForCollections) {

		$scope.allOperations = [];

		console.log(newOperationsForCollections);

		for(var x in newOperationsForCollections) {
			console.log(x);
			for(var y in newOperationsForCollections[x]) {
				console.log(newOperationsForCollections[x][y]);
				$scope.allOperations.push(newOperationsForCollections[x][y]);
			}
		}

	}, true);

	$scope.toggleCollection = function(collection) {
		var currentIndex = $scope.selectedCollections.indexOf(collection);
		if(currentIndex > -1) {
			$scope.selectedCollections.splice(currentIndex, 1);
		}
		else {
			$scope.selectedCollections.push(collection);
		}
	};

	$scope.toggleOperation = function(operation) {
		var currentIndex = $scope.selectedOperations.indexOf(operation);
		if(currentIndex > -1) {
			$scope.selectedOperations.splice(currentIndex, 1);
			$scope.nscanned.series[0].data.splice(currentIndex, 1);
			$scope.nscanned.categories.splice(currentIndex, 1);
		}
		else {
			$scope.selectedOperations.push(operation);

			var obj = StatsService.getDetailsParams($scope.selectedCollections[0], operation);
			DetailsService.fetchDetails(obj.collection, obj.operation, obj.query).then(function(result) {

				// can't figure out how to do this aggregation server-side because we can't use $where with $match... 
				// so for now, trying client-side

				var nScannedForEachInstanceOfThisQuery = result.nScanned;
				var total = 0;
				for(var i in nScannedForEachInstanceOfThisQuery) {
					total += nScannedForEachInstanceOfThisQuery[i];
				}

				$scope.nscanned.series[0].data.push(total);
				$scope.nscanned.categories.push(obj.operation + ' - ' + obj.query);
			});
		}
	};
});