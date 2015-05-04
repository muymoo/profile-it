profilerApp.controller('ComparisonController', function($scope, StatsService, DetailsService) {

	$scope.allCollections = [];
	$scope.selectedCollections = [];

	$scope.allOperations = [];
	$scope.selectedOperations = [];

	$scope.nscanned = {
		series: [],
		categories: []
	};

	var reinitNscanned = function() {
		$scope.nscanned = {
			series: [],
			categories: []
		};
	};

	StatsService.getAllCollections().then(function(collections) {
		$scope.allCollections = collections;
	});

	var addOperationsFor = function(collection) {
		StatsService.getAllOperations(collection).then(function(newOperations) {
			for(var i in newOperations) {
				var newOp = newOperations[i];
				if($scope.allOperations.indexOf(newOp) === -1) {
					// only add operations that aren't already in the list
					$scope.allOperations.push(newOp);
				}
			}
		});
	}

	$scope.toggleCollection = function(collection) {
		var currentIndex = $scope.selectedCollections.indexOf(collection);
		if(currentIndex > -1) {
			$scope.selectedCollections.splice(currentIndex, 1);
		}
		else {
			$scope.selectedCollections.push(collection);
		}
	};

	$scope.$watch('selectedCollections', function(newSelectedCollections) {

		// reinitialize allOperations & start fresh (easiest thing)
		$scope.allOperations = [];
		$scope.selectedOperations = [];
		for(var i in newSelectedCollections) {
			addOperationsFor(newSelectedCollections[i]);
		}

	}, true);

	$scope.toggleOperation = function(operation) {
		var currentIndex = $scope.selectedOperations.indexOf(operation);
		if(currentIndex > -1) {
			$scope.selectedOperations.splice(currentIndex, 1);
		}
		else {
			$scope.selectedOperations.push(operation);
		}
	};

	$scope.$watch('selectedOperations', function(newSelectedOperations) {

		reinitNscanned();

		for(var i in $scope.selectedCollections) {
			for(var j in newSelectedOperations) {
				var collection = $scope.selectedCollections[i];
				var operation = newSelectedOperations[j];

				var obj = StatsService.getDetailsParams(collection, operation);			
				DetailsService.fetchDetails(obj.collection, obj.operation, obj.query).then(function(result) {

					// can't figure out how to do this aggregation server-side because we can't use $where with $match... 
					// so for now, trying client-side
					var nScannedForEachInstanceOfThisQuery = result.nScanned;

					if(result.nScanned.length > 0) {
						// if there is actually a result, graph it

						var total = 0;
						for(var i in nScannedForEachInstanceOfThisQuery) {
							total += nScannedForEachInstanceOfThisQuery[i];
						}

						$scope.nscanned.series.push({
							name: result.collection,
							data: [total]
						});
						$scope.nscanned.categories.push(StatsService.makeCategoryString(result));
					}

				});

			}
		}

	}, true);
});