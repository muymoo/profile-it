profilerApp.controller('ReportsController', ['$scope', '$http', function($scope, $http){
	

	
	// $scope.last25Data = [];
	// $scope.last25 = { data: 'last25Data' };
	// $http.get('/all/last25').success(function(last25) {
	// 	for(var idx in last25) {
	// 		var one = last25[idx];
	// 		$scope.last25Data.push(
	// 			{
	// 				op: one.op,
	// 				query: one.query,
	// 				command: one.command,
	// 				lockStats: one.lockStats,
	// 				nscannedObjects: one.nscannedObjects,
	// 				responseLength: one.responseLength,
	// 				timestamp: one.ts,
	// 				ns: one.ns,
	// 				millis: one.millis
	// 			}
	// 		);
	// 	}
	// });

	$scope.lastDayData = [];
	$scope.lastDay = { data: 'lastDayData' };
	$http.get('/all/lastDay').success(function(lastDay) {
		for(var idx in lastDay) {
			var one = lastDay[idx];
			$scope.lastDayData.push(
				{
					op: one.op,
					query: one.query,
					command: one.command,
					// lockStats: one.lockStats,
					// nscannedObjects: one.nscannedObjects,
					// responseLength: one.responseLength,
					timestamp: one.ts,
					ns: one.ns,
					millis: one.millis
				}
			);
		}
	});

}]);