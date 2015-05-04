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

			// reinitialize allOperations & start fresh
			// $scope.allOperations = [];
			// for(var i in $scope.selectedCollections) {
			// 	addOperationsFor($scope.selectedCollections[i]);
			// }
			// reinitNscanned();

		}
		else {
			$scope.selectedCollections.push(collection);

			// for now, just reinitialize everything
			// $scope.allOperations = [];
			// for(var i in $scope.selectedCollections) {
			// 	addOperationsFor($scope.selectedCollections[i]);
			// }
			// reinitNscanned();

			// TODO, just add them instead? (but then we have to track all possibilities of updating graph from that...)
			// addOperationsFor(collection);
		}
	};

	$scope.$watch('selectedCollections', function(newSelectedCollections) {
		console.log(newSelectedCollections);

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
			// $scope.nscanned.series[0].data.splice(currentIndex, 1);
			// $scope.nscanned.categories.splice(currentIndex, 1);
		}
		else {
			$scope.selectedOperations.push(operation);

			// var obj = StatsService.getDetailsParams($scope.selectedCollections[0], operation);
			// DetailsService.fetchDetails(obj.collection, obj.operation, obj.query).then(function(result) {

			// 	// can't figure out how to do this aggregation server-side because we can't use $where with $match... 
			// 	// so for now, trying client-side

			// 	console.log('RESULT: ', obj.collection, result);

			// 	var nScannedForEachInstanceOfThisQuery = result.nScanned;
			// 	var total = 0;
			// 	for(var i in nScannedForEachInstanceOfThisQuery) {
			// 		total += nScannedForEachInstanceOfThisQuery[i];
			// 	}

			// 	$scope.nscanned.series.push({
			// 		name: obj.collection,
			// 		data: [total]
			// 	});
			// 	$scope.nscanned.categories.push(obj.operation + ' - ' + obj.query);

			// });
		}
	};

	$scope.$watch('selectedOperations', function(newSelectedOperations) {
		console.log('ops', newSelectedOperations);

		reinitNscanned();

		for(var i in $scope.selectedCollections) {
			for(var j in newSelectedOperations) {
				var collection = $scope.selectedCollections[i];
				var operation = newSelectedOperations[j];
				console.log(collection, operation);

				var obj = StatsService.getDetailsParams(collection, operation);			
				DetailsService.fetchDetails(obj.collection, obj.operation, obj.query).then(function(result) {
					console.log(result.collection, result.operation);
					// can't figure out how to do this aggregation server-side because we can't use $where with $match... 
					// so for now, trying client-side
					var nScannedForEachInstanceOfThisQuery = result.nScanned;
					var total = 0;
					for(var i in nScannedForEachInstanceOfThisQuery) {
						total += nScannedForEachInstanceOfThisQuery[i];
					}

					$scope.nscanned.series.push({
						name: result.collection,
						data: [total]
					});
					$scope.nscanned.categories.push(result.operation + ' - ' + result.query);

				});

			}
		}

	}, true);
});