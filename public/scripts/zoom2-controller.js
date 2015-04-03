profilerApp.controller('Zoom2Controller', ['$scope', '$http', function($scope, $http){
	
	$scope.detailsOperationInstanceData = [];
	$scope.detailsOperationInstance = { data: 'detailsOperationInstanceData' };
	$http.get('/stats/collection/my_database.events/operation/123').success(function(result) {
		console.log(result);
		for(var index in result) {
			var item = result[index];
			$scope.detailsOperationInstanceData.push(
				{
					'Operation': item.op,
					'Query': item.query,
					'Update': item.updateobj,
					'Millis': item.millis,
					'Lock Stats': item.lockStats,
					'Number Scanned': item.nscannedObjects,
					'Response Length': item.responseLength,
				}
			);
		}
	});
}]);