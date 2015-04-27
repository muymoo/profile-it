profilerApp.controller('Zoom1Controller', ['$scope', 'StatsService', '$stateParams', '$state', function($scope, StatsService, $stateParams, $state) {

	var collection = $stateParams.collection;

	var splitCharacter = ' - '; // use this to split the operation from the insert/updateobj for user readable data

	$scope.$on('select-bar', function(event, x) {
		var split = x.split(splitCharacter);

		var params = {
			collection: collection, 
			operation: split[0]
		};
		console.log(split);
		if(split.length > 1) {
			params['obj']=split[1];
		}
		if(split.length > 2) {
			alert('ruh roh');
			console.log(split);
		}

		$state.go('zoom2', params);
	});

	StatsService.getOperations(collection).then(function(result) {
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
				categoryString += splitCharacter + JSON.stringify(item._id.query);
			}
			if(item._id.updateobj !== undefined) {
				categoryString += splitCharacter + JSON.stringify(item._id.updateobj);
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

	$scope.up = function() {
		$state.go('toplevel');
	};
}]);