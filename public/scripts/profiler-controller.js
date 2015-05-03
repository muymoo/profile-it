profilerApp.controller('ProfilerController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){
    $scope.progress = {};
    $scope.result = {
        flamegraph: 'target/last.svg'
    };
    $scope.progress.value = 0;

    $scope.queries = {
        findWI: true,
        findWIMultiple: false,
        addMore: false,
        findRange: false
    }

	$scope.profile = function() {
        $scope.result.flamegraph = null;
        $scope.progress.value = 30;
        $scope.progress.state = 'Profiling...';

        console.log("Profiling...");

        var queriesToRun = '';
        var queryKey = 'queries='

        for(var query in $scope.queries) {
            if($scope.queries[query]) {
                queriesToRun += queryKey;
                queriesToRun += query;
                queryKey = '&queries=';
            }
        }

		// Yes, this should be a service...
		$http.get('/profiler/profile?' + queriesToRun).success(function(data) {
			$scope.result = data;
            $scope.progress.value = 100;
            $scope.progress.state = 'Done ' + data.duration + 's';
		});

        // Faux progress making
        var parsing = function() {
            $scope.progress.value = 60;
            $scope.progress.state = 'Parsing Results...'
        }

        var generatingSvg = function() {
            $scope.progress.value = 90;
            $scope.progress.state = 'Generating Flame Graph...'
        }

        $timeout(parsing, 3000);
        $timeout(generatingSvg, 6000);
	};
}]);