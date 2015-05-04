profilerApp.controller('ComparisonController', function($scope, StatsService, DetailsService, $q) {

	$scope.allCollections = [];
	$scope.selectedCollections = [];

	$scope.allOperations = [];
	$scope.selectedOperations = [];

	$scope.nscanned = {
		series: [],
		categories: []
	};
	$scope.nscannedResults = {};
	$scope.nscannedCollections = {};

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

	var fetchAllDetails = function() {
		$scope.nscannedResults = {};
		$scope.nscannedCollections = {};

		var defer = $q.defer();
		var promises = [];
		for(var i in $scope.selectedCollections) {
			for(var j in $scope.selectedOperations) {
				var collection = $scope.selectedCollections[i];
				var operation = $scope.selectedOperations[j];

				var obj = StatsService.getDetailsParams(collection, operation);			
				

				promises.push(DetailsService.fetchDetails(obj.collection, obj.operation, obj.query).then(function(result) {

					// can't figure out how to do this aggregation server-side because we can't use $where with $match... 
					// so for now, trying client-side
					var nScannedForEachInstanceOfThisQuery = result.nScanned;

					var value;
					if(result.nScanned.length <= 0) {
						value = 0;
					}
					else {
						var total = 0;
						for(var i in nScannedForEachInstanceOfThisQuery) {
							total += nScannedForEachInstanceOfThisQuery[i];
						}
						value = total;
					}

					result.query = JSON.parse(result.query); // hack to show query results not stringified
					if($scope.nscannedResults[StatsService.makeCategoryString(result)] === undefined) {
						$scope.nscannedResults[StatsService.makeCategoryString(result)] = {};
					}
					$scope.nscannedResults[StatsService.makeCategoryString(result)][result.collection] = value;
					$scope.nscannedCollections[result.collection] = true;

				}));
			}
		}

		$q.all(promises).then(function() {
			defer.resolve();
		});

		return defer.promise;
	};

	$scope.$watch('selectedOperations', function(newSelectedOperations) {

		reinitNscanned();

		fetchAllDetails().then(function() {

			console.log($scope.nscannedResults);

			for(var collection in $scope.nscannedCollections) {
				$scope.nscanned.series.push({
					name: collection,
					data: []
				});
			}

			for(var category in $scope.nscannedResults) {
				for(var collection in $scope.nscannedResults[category]) {
					var point = $scope.nscannedResults[category][collection];

					for(var x in $scope.nscanned.series) {
						if($scope.nscanned.series[x].name === collection) {
							$scope.nscanned.series[x].data.push(point);
							break;
						}
					}
				}
				$scope.nscanned.categories.push(category);
			}
			
		});

	}, true);
});