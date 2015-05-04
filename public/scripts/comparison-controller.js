profilerApp.controller('ComparisonController', function($scope, StatsService, DetailsService, $q) {

	$scope.allCollections = [];
	$scope.selectedCollections = [];

	$scope.allOperations = [];
	$scope.selectedOperations = [];

	$scope.nscanned = {
		series: [],
		categories: []
	};
	$scope.nscannedObjs = {
		series: [],
		categories: []
	};

	var clearGraph = function() {
		$scope.nscanned = {
			series: [],
			categories: []
		};
		$scope.nscannedObjs = {
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



	$scope.$watch('selectedOperations', redrawGraph, true);

	function redrawGraph(newSelectedOperations) {

		clearGraph();

		DetailsService.fetchAllDetails($scope.selectedCollections, $scope.selectedOperations).then(function(results) {
			addResultsToGraph(results);
		});
	};

	function addResultsToGraph(results) {
		var nscannedResults = results.nscannedResults;
		var nscannedObjsResults = results.nscannedObjsResults;
		var collections = results.collectionsResults;

		for(var collection in collections) {
			addSeries($scope.nscanned.series, collection);
			addSeries($scope.nscannedObjs.series, collection);
		}

		addCategoriesAndPoints($scope.nscanned, nscannedResults);
		addCategoriesAndPoints($scope.nscannedObjs, nscannedObjsResults);
	};

	function addSeries(series, name) {
		series.push({
			name: name,
			data: []
		});
	};

	function addCategoriesAndPoints(graph, results) {
		for(var category in results) {
			for(var collection in results[category]) {
				var point = results[category][collection];

				for(var x in graph.series) {
					if(graph.series[x].name === collection) {
						graph.series[x].data.push(point);
						break;
					}
				}
			}
			graph.categories.push(category);
		}
	};

});