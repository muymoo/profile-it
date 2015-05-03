profilerApp.controller('DetailsController', function($scope, $stateParams, DetailsService) {

	$scope.collection = $stateParams.collection;
	$scope.operation = $stateParams.operation;
	$scope.query = $stateParams.query;

	DetailsService.fetchDetails($scope.collection, $scope.operation, $scope.query).then(function(result) {

		$scope.nscanned = {
			series: result.nScannedSeries,
			categories: result.categories
		};

		$scope.responseLength = {
			series: result.responseLengthSeries,
			categories: result.categories
		};
		
		$scope.queryTime = {
			series: result.queryTimeSeries,
			categories: result.categories
		};

	});
});