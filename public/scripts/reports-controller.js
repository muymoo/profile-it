profilerApp.controller('ReportsController', ['$scope', '$http', function($scope, $http){
	
	$scope.myData = [];

	$http.get('/all/last25').success(function(last25) {

		console.log(last25);
		for(var idx in last25) {
			var one = last25[idx];
			$scope.myData.push(
				{
					op: one.op,
					query: one.query,
					command: one.command,
					nscannedObjects: one.nscannedObjects,
					responseLength: one.responseLength
				}
			);
		}

	});

	$scope.myOptions = { data: 'myData' };
	
}]);