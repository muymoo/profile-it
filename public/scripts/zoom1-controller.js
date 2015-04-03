profilerApp.controller('Zoom1Controller', ['$scope', 'StatsService', function($scope, StatsService){
	
	$scope.timeEachOperationData = [];
	$scope.timeEachOperation = { data: 'timeEachOperationData' };
	StatsService.getOperations('my_database.events').then(function(result) {
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

	StatsService.getOperations('my_database.events').then(function(result) {
		var categories = [];
		var series = [{
			name: 'Max Millis',
			data: []
		},{
			name: 'Avg Millis',
			data: []
		},{
			name: 'Min Millis',
			data: []
		}];

		for(var index in result) {
			var item = result[index];

			categories.push(item._id.op + ' ' + item._id.query + ' ' + item._id.updateobj);
			series[0].data.push(item.maxMillis);
			series[1].data.push(item.avgMillis);
			series[2].data.push(item.minMillis);
			// TODO? also have available 'Count': item.count
		}

		$scope.timeEachOperation = {
			series: series,
			categories: categories
		}
	});
}]);