profilerApp.controller('ReportsController', ['$scope', '$http', function($scope, $http){
	
	$scope.aggData = [];
	$scope.agg = { data: 'aggData' };
	$http.get('/all/aggLastDay').success(function(lastDay) {
		console.log(lastDay);
		for(var idx in lastDay) {
			var one = lastDay[idx];
			$scope.aggData.push(
				{
					op: one.op,
					query: one.query,
					lockStats: one.lockStats,
					nscannedObjects: one.nscannedObjects,
					responseLength: one.responseLength,
					timestamp: one.ts,
					ns: one.ns,
					millis: one.millis
				}
			);
		}
	});

	// $scope.lastDayData = [];
	// $scope.lastDay = { data: 'lastDayData' };
	// $http.get('/all/lastDay').success(function(lastDay) {
	// 	for(var idx in lastDay) {
	// 		var one = lastDay[idx];
	// 		$scope.lastDayData.push(
	// 			{
	// 				op: one.op,
	// 				query: one.query,
	// 				command: one.command,
	// 				// lockStats: one.lockStats,
	// 				// nscannedObjects: one.nscannedObjects,
	// 				// responseLength: one.responseLength,
	// 				timestamp: one.ts,
	// 				ns: one.ns,
	// 				millis: one.millis
	// 			}
	// 		);
	// 		console.log(one);
	// 	}
	// });

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
