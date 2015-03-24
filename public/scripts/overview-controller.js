profilerApp.controller('ProfilerController', ['$scope', '$http', function($scope, $http){
	$scope.profile = function() {
		console.log("Profiling...");
		// Yes, this should be a service...
		$http.get('/runs/profile').success(function(data) {
			$scope.result = data;
		});
	};
}]);