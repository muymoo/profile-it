profilerApp.controller('MainController', ['$scope', '$http', function($scope, $http){
	
	$scope.populateText = "Populate Database";

	$scope.populate = function() {
		$http.get('/profiler/populate').success(function(data) {
			$scope.populateText = "Success!";
		});
	}
}]);