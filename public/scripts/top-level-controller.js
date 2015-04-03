profilerApp.controller('TopLevelController', ['$scope', '$http', function($scope, $http){

	$http.get('/stats/collection').success(function(result) {
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

			categories.push(item._id.ns);
			series[0].data.push(item.maxMillis);
			series[1].data.push(item.avgMillis);
			series[2].data.push(item.minMillis);
			// TODO? also have available 'Count': item.count
		}

		$scope.timeCollectionData = {
			series: series,
			categories: categories
		}
	});

	$http.get('/stats/collectionoperation').success(function(result) {
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

			categories.push(item._id.ns + ' ' + item._id.op);
			series[0].data.push(item.maxMillis);
			series[1].data.push(item.avgMillis);
			series[2].data.push(item.minMillis);
			// TODO? also have available 'Count': item.count
		}

		$scope.timeCollectionPerOperationData = {
			series: series,
			categories: categories
		}
	});

}]);

/*
all available things in system.profile 
http://docs.mongodb.org/manual/reference/database-profiler/#output-reference

potentially interesting:
op, ns, query (.$query, orderby, etc. for query ops), ntoreturn, nscanned, scanAndOrder, moved, nmoved, nupdated, 
keyUpdates, lockStats, nreturned, responseLength, millis

maybe?
command, updateobj, ntoskip

probably not:
ts, cursorid, client, user

*/
