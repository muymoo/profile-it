profilerApp.controller('Zoom1Controller', ['$scope', 'StatsService', function($scope, StatsService){

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

			var categoryString = item._id.op;
			if(item._id.query !== undefined) {
				categoryString += ' ' + JSON.stringify(item._id.query);
			}
			if(item._id.updateobj !== undefined) {
				categoryString += ' ' + JSON.stringify(item._id.updateobj);
			}

			categories.push(categoryString);
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