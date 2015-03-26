profilerApp.controller('ReportsController', ['$scope', '$http', function($scope, $http){
	
	$scope.operationsCollectionsData = [];
	$scope.operationsCollections = { data: 'operationsCollectionsData' };
	$http.get('/all/operationscollections').success(function(result) {
		console.log(result);
		for(var index in result) {
			var item = result[index];
			$scope.operationsCollectionsData.push(
				{
					'Namespace': item._id.ns,
					'Operation': item._id.op,
					'Avg Millis': item.avgMillis,
					'Max Millis': item.maxMillis,
					'Min Millis': item.minMillis,
					'Count': item.count
				}
			);
		}
	});

	$scope.longestQueriesData = [];
	$scope.longestQueries = { data: 'longestQueriesData' };
	$http.get('/all/longestqueries').success(function(result) {
		console.log(result);
		for(var index in result) {
			var item = result[index];
			$scope.longestQueriesData.push(
				{
					'Namespace': item._id.ns,
					'Query': item._id.query,
					'Avg Millis': item.avgMillis,
					'Count': item.count
				}
			);
		}
	});

	$scope.lastDayData = [];
	$scope.lastDay = { data: 'lastDayData' };
	$http.get('/all/lastDay').success(function(result) {
		console.log(result);
		for(var index in result) {
			var item = result[index];
			$scope.lastDayData.push(
				{
					op: item.op,
					query: item.query,
					command: item.command,
					// lockStats: item.lockStats,
					// nscannedObjects: item.nscannedObjects,
					// responseLength: item.responseLength,
					timestamp: item.ts,
					ns: item.ns,
					millis: item.millis
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
