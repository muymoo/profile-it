profilerApp.controller('TopLevelController', ['$scope', '$http', function($scope, $http){
	
	$scope.timeEachCollectionData = [];
	$scope.timeEachCollection = { data: 'timeEachCollectionData' };
	$http.get('/stats/collection').success(function(result) {
		console.log(result);
		for(var index in result) {
			var item = result[index];
			$scope.timeEachCollectionData.push(
				{
					'Collection': item._id.ns,
					'Avg Millis': item.avgMillis,
					'Max Millis': item.maxMillis,
					'Min Millis': item.minMillis,
					'Count': item.count
				}
			);
		}
	});

	$scope.timeEachCollectionPerOperationData = [];
	$scope.timeEachCollectionPerOperation = { data: 'timeEachCollectionPerOperationData' };
	$http.get('/stats/collectionoperation').success(function(result) {
		console.log(result);
		for(var index in result) {
			var item = result[index];
			$scope.timeEachCollectionPerOperationData.push(
				{
					'Collection': item._id.ns,
					'Operation': item._id.op,
					'Avg Millis': item.avgMillis,
					'Max Millis': item.maxMillis,
					'Min Millis': item.minMillis,
					'Count': item.count
				}
			);
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
