profilerApp.controller('ComparisonController', function($scope, StatsService, DetailsService) {

	$scope.allCollections = [];
	$scope.selectedCollections = [];

	$scope.allOperationsForCollections = {};
	$scope.allOperations = [];
	$scope.selectedOperations = [];

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

	$scope.$watch('selectedOperations', function(newSelectedOperations) {

		if(newSelectedOperations.length === 0) {
			return; // do nothing when initialized to []
		}

		console.log(newSelectedOperations);

		var obj = StatsService.getDetailsParams($scope.selectedCollections[0], $scope.selectedOperations[0]);
		console.log(obj);

		DetailsService.fetchDetails(obj.collection, obj.operation, obj.query).then(function(result) {

			$scope.nscanned = {
				series: result.nScannedSeries,
				categories: result.categories
			};

		});

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
		}
		else {
			$scope.selectedOperations.push(operation);
		}
	};
});