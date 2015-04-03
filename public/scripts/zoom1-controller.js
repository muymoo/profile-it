profilerApp.controller('Zoom1Controller', ['$scope', '$http', function($scope, $http){
	
	$scope.timeEachOperationData = [];
	$scope.timeEachOperation = { data: 'timeEachOperationData' };
	$http.get('/stats/collection/my_database.events/operation').success(function(result) {
		console.log(result);
		for(var index in result) {
			var item = result[index];
			$scope.timeEachOperationData.push(
				{
					'Operation': item._id.op,
					'Query': item._id.query,
					'Update': item._id.updateobj,
					'Avg Millis': item.avgMillis,
					'Max Millis': item.maxMillis,
					'Min Millis': item.minMillis,
					'Count': item.count
				}
			);
		}
	});
}]);