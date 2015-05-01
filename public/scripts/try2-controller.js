profilerApp.controller('Try2Controller', function($scope, StatsService, usSpinnerService, $q, $state) {

	$scope.collections = [];
	$scope.selectedCollection = $scope.collections[0];
	$scope.$watch('collections', function(newData) {
		$scope.selectedCollection = $scope.collections[0];
	});

	StatsService.getAllCollections().then(function(results) {
		var collections = [];
		for(i in results) {
			collections.push(results[i]._id.ns);
		}
		$scope.collections = collections;
	});

	$scope.$watch('selectedCollection', function(newData) {

		if(newData == undefined) {
			return;
		}

		usSpinnerService.spin('myspinner');
		$q.all([
			updateOperationsByTime(newData), 
			updateOperationsByCount(newData),
			updateOperationsOverTime(newData)
			]).then(function() {
			usSpinnerService.stop('myspinner');
		});
	});

	$scope.$on('select-bar', function(event, x) {
		var split = x.split(splitCharacter);

		var params = {
			collection: $scope.selectedCollection, 
			operation: split[0]
		};

		if(split.length > 1) {
			params['obj']=split[1];
		}
		if(split.length > 2) {
			alert('ruh roh');
			console.log(split);
		}

		$state.go('zoom2', params);
	});
	
	function updateOperationsByTime(collection) {
		var defer = $q.defer();
		StatsService.topOperationsByTime(collection).then(function(result) {
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

				var categoryString = makeCategoryString(item._id);
							
				categories.push(categoryString);
				series[0].data.push(item.maxMillis);
				series[1].data.push(item.avgMillis);
				series[2].data.push(item.minMillis);
			}

			$scope.timeOperations = {
				series: series,
				categories: categories
			}
			defer.resolve();
		});
		return defer.promise;
	}

	function updateOperationsByCount(collection) {
		var defer = $q.defer();
		StatsService.topOperationsByCount(collection).then(function(result) {
			var categories = [];
			var series = [{
				name: 'Count',
				data: []
			}];

			for(var index in result) {
				var item = result[index];

				var categoryString = makeCategoryString(item._id);
							
				categories.push(categoryString);
				series[0].data.push(item.count);
			}

			$scope.countOperations = {
				series: series,
				categories: categories
			}
			defer.resolve();
		});
		return defer.promise;
	}

	function updateOperationsOverTime(collection) {
		var defer = $q.defer();
		StatsService.operationsOverTime(collection).then(function(result) {
			console.log(result);
			var series = [{
				name: 'Count',
				data: []
			}];

			for(var index in result) {
				var item = result[index];

				// var categoryString = makeCategoryString(item._id);
							
				series[0].data.push([Date.UTC(item._id.year, item._id.month, item._id.day), item.count]);
			}

			$scope.overtime = {
				series: series
				// categories: categories
			}
			defer.resolve();
		});
		return defer.promise;
	}

	var splitCharacter = ' - '; // use this to split the operation from the insert/updateobj for user readable data

	function makeCategoryString(obj) {
		var categoryString = obj.op;
		if(obj.query !== undefined) {
			categoryString += splitCharacter + JSON.stringify(obj.query);
		}
		if(obj.updateobj !== undefined) {
			categoryString += splitCharacter + JSON.stringify(obj.updateobj);
		}
		return categoryString;
	}

});