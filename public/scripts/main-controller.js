profilerApp.controller('MainController', function($scope, $http, $state) {
	
	$scope.populateText = "Populate Database";

	$scope.populate = function() {
		$http.get('/profiler/populate').success(function(data) {
			$scope.populateText = "Success!";
		});
	};

	$scope.isActive = function() {
		if($state.current.name === 'home' || $state.current.name === 'home.collection' || $state.current.name === 'details') {
			return true;
		}
		return false;
	};
});