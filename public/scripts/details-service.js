profilerApp.factory('DetailsService', function($http, $q) {

	var fetchDetails = function(collection, operation, query) {
		var defer = $q.defer();
		$http.post('/stats/collection/' + collection + '/operation', {operation: operation, query: query}).success(function(result) {
			console.log('Details: ', result);

			var categories = [];
			var nScanned = [];
			var nScannedObjs = [];
			var nReturned = [];
			var responseLength = [];
			var queryTime = [];

			for(var index in result) {
				var item = result[index];

				var categoryString = item.ts;
							
				categories.push(categoryString);
				nScanned.push(item.nscanned);
				nScannedObjs.push(item.nscannedObjects);
				nReturned.push(item.nreturned); // could also do ntoskip (also expensive?)  // ntoreturn --> shows if have limit (if 0 no limit)
				responseLength.push(item.responseLength);
				queryTime.push(item.millis);

				// TODO scanAndOrder if can't use index to return order.. must resort

				// (ninserted, ndeleted, nMatched, nModified)

				// keyUpdates

				// writeConflicts

				// numYield

				// locks (acquireCount, acquireWaitCount, timeAcquiringMicros, deadlockCount)

			}

			defer.resolve({
				collection: collection,
				op: operation,
				query: query,
				categories: categories, 
				nScanned: nScanned, 
				nScannedObjs: nScannedObjs, 
				nReturned: nReturned, 
				responseLength: responseLength, 
				queryTime: queryTime
			});
		});
		return defer.promise;
	}

	return {
		fetchDetails: fetchDetails
	};

});