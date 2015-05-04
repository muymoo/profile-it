profilerApp.controller('ComparisonController', function($scope, StatsService, DetailsService, $q) {

	$scope.allCollections = [];
	$scope.selectedCollections = [];

	$scope.allOperations = [];
	$scope.selectedOperations = [];

	$scope.nscanned = {
		series: [],
		categories: []
	};

	var clearGraph = function() {
		$scope.nscanned = {
			series: [],
			categories: []
		};
	};



	StatsService.getAllCollections().then(function(collections) {
		$scope.allCollections = collections;
	});



	$scope.toggleCollection = function(collection) {
		toggleInList($scope.selectedCollections, collection);
	};

	$scope.toggleOperation = function(operation) {
		toggleInList($scope.selectedOperations, operation);
	};

	function toggleInList(list, item) {
		var currentIndex = list.indexOf(item);
		if(currentIndex > -1) {
			list.splice(currentIndex, 1);
		}
		else {
			list.push(item);
		}
	}



	$scope.$watch('selectedCollections', loadOperationsFresh, true);

	function loadOperationsFresh(newSelectedCollections) {
		// reinitialize lists of operations & start fresh (easiest thing)
		$scope.allOperations = [];
		$scope.selectedOperations = [];
		for(var i in newSelectedCollections) {
			addOperationsForCollection(newSelectedCollections[i]);
		}
	};

	function addOperationsForCollection(collection) {
		StatsService.getAllOperations(collection).then(function(newOperations) {
			for(var i in newOperations) {
				var newOp = newOperations[i];
				if($scope.allOperations.indexOf(newOp) === -1) {
					// only add operations that aren't already in the list
					$scope.allOperations.push(newOp);
				}
			}
		});
	};



	$scope.$watch('selectedOperations', function(newSelectedOperations) {

		clearGraph();

		DetailsService.fetchAllDetails($scope.selectedCollections, $scope.selectedOperations).then(function(results) {
			addResultsToGraph(results);
		});

	}, true);

	function addResultsToGraph(results) {
		var nscannedResults = results.nscannedResults;
		var nscannedCollections = results.nscannedCollections;

		console.log(nscannedResults);

		for(var collection in nscannedCollections) {
			$scope.nscanned.series.push({
				name: collection,
				data: []
			});
		}

		for(var category in nscannedResults) {
			for(var collection in nscannedResults[category]) {
				var point = nscannedResults[category][collection];

				for(var x in $scope.nscanned.series) {
					if($scope.nscanned.series[x].name === collection) {
						$scope.nscanned.series[x].data.push(point);
						break;
					}
				}
			}
			$scope.nscanned.categories.push(category);
		}
	}


});