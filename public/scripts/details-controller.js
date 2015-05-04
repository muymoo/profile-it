profilerApp.controller('DetailsController', function($scope, $stateParams, DetailsService) {

	$scope.collection = $stateParams.collection;
	$scope.operation = $stateParams.operation;
	$scope.obj = $stateParams.obj;

	DetailsService.fetchDetails($scope.collection, $scope.operation, $scope.obj).then(function(result) {

		var nScannedSeries = [{
			name: 'Number documents scanned',
			data: result.nScannedObjs
		},{
			name: 'Number documents scanned in index',
			data: result.nScanned
		},{
			name: 'Number documents returned',
			data: result.nReturned
		}];

		var responseLengthSeries = [{
			name: 'Response Length',
			data: result.responseLength
		}];

		var queryTimeSeries = [{
			name: 'Time to complete query',
			data: result.queryTime
		}];

		$scope.nscanned = {
			series: nScannedSeries,
			categories: result.categories
		};

		$scope.responseLength = {
			series: responseLengthSeries,
			categories: result.categories
		};
		
		$scope.queryTime = {
			series: queryTimeSeries,
			categories: result.categories
		};

	});
});