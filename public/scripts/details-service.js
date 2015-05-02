profilerApp.factory('DetailsService', function($http, $q) {

	var fetchDetails = function(collection, operation, query) {
		var defer = $q.defer();
		$http.post('/stats/collection/' + collection + '/operation', {operation: operation, query: query}).success(function(result) {
			console.log('Details: ', result);

			var categories = [];
			var nScannedSeries = [{
				name: 'Number documents scanned',
				data: []
			},{
				name: 'Number documents scanned in index',
				data: []
			},{
				name: 'Number documents returned',
				data: []
			}];

			var responseLengthSeries = [{
				name: 'Response Length',
				data: []
			}];

			var queryTimeSeries = [{
				name: 'Time to complete query',
				data: []
			}];

			for(var index in result) {
				var item = result[index];

				var categoryString = item.ts;
							
				categories.push(categoryString);
				nScannedSeries[0].data.push(item.nscannedObjects);
				nScannedSeries[1].data.push(item.nscanned);
				nScannedSeries[2].data.push(item.nreturned); // could also do ntoskip (also expensive?)  // ntoreturn --> shows if have limit (if 0 no limit)
				responseLengthSeries[0].data.push(item.responseLength);
				queryTimeSeries[0].data.push(item.millis);

				// TODO scanAndOrder if can't use index to return order.. must resort

				// (ninserted, ndeleted, nMatched, nModified)

				// keyUpdates

				// writeConflicts

				// numYield

				// locks (acquireCount, acquireWaitCount, timeAcquiringMicros, deadlockCount)

			}

			defer.resolve({
				categories: categories, 
				nScannedSeries: nScannedSeries, 
				responseLengthSeries: responseLengthSeries, 
				queryTimeSeries: queryTimeSeries
			});
		});
		return defer.promise;
	}

	return {
		fetchDetails: fetchDetails
	};

});