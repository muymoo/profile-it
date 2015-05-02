profilerApp.controller('DetailsController', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams, $state) {

	$scope.collection = $stateParams.collection;
	$scope.operation = $stateParams.operation;
	$scope.obj = $stateParams.obj;
	console.log($scope.collection, $scope.operation, $scope.obj);

	$scope.detailsOperationInstanceData = [];
	$scope.detailsOperationInstance = { data: 'detailsOperationInstanceData' };
	$http.post('/stats/collection/' + $scope.collection + '/operation', {operation: $scope.operation, obj: $scope.obj}).success(function(result) {
		console.log(result);

		var categories = [];
		var nScannedSeries = [{
			name: 'Number documents scanned',
			data: []
		},{
			name: 'Number documents scanned in index',
			data: []
		},{
			name: 'Number documents returned',
			data: []
		}];

		var responseLengthSeries = [{
			name: 'Response Length',
			data: []
		}];

		var queryTimeSeries = [{
			name: 'Time to complete query',
			data: []
		}];

		for(var index in result) {
			var item = result[index];

			var categoryString = item.ts;
						
			categories.push(categoryString);
			nScannedSeries[0].data.push(item.nscannedObjects);
			nScannedSeries[1].data.push(item.nscanned);
			nScannedSeries[2].data.push(item.nreturned); // could also do ntoskip (also expensive?)  // ntoreturn --> shows if have limit (if 0 no limit)
			responseLengthSeries[0].data.push(item.responseLength);
			queryTimeSeries[0].data.push(item.millis);

			// TODO scanAndOrder if can't use index to return order.. must resort

			// (ninserted, ndeleted, nMatched, nModified)

			// keyUpdates

			// writeConflicts

			// numYield

			// locks (acquireCount, acquireWaitCount, timeAcquiringMicros, deadlockCount)


			$scope.detailsOperationInstanceData.push(
				{
					'Operation': item.op,
					'Query': item.query,
					'Update': item.updateobj,
					'Millis': item.millis,
					'Lock Stats': item.lockStats,
					'Number Scanned': item.nscanned,
					'Response Length': item.responseLength,
				}
			);
		}

		$scope.nscanned = {
			series: nScannedSeries,
			categories: categories
		};
		$scope.responseLength = {
			series: responseLengthSeries,
			categories: categories
		}
		$scope.queryTime = {
			series: queryTimeSeries,
			categories: categories
		}
	});

	$scope.up = function() {
		$state.go('home');
	};
}]);