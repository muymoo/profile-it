profilerApp.controller('Zoom2Controller', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams, $state) {
	
	var collection = $stateParams.collection;
	var operation = $stateParams.operation;
	var obj = $stateParams.obj;
	console.log(collection, operation, obj);

	$scope.detailsOperationInstanceData = [];
	$scope.detailsOperationInstance = { data: 'detailsOperationInstanceData' };
	$http.post('/stats/collection/' + collection + '/operation/id', {operation: operation, obj: obj}).success(function(result) {
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

	$scope.up = function() {
		$state.go('try2');
	};
}]);