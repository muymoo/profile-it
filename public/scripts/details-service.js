profilerApp.factory('DetailsService', function($http, $q, StatsService) {

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
	};

	var fetchAllDetails = function(collections, operations) {

		var nscannedResults = {};
		var nscannedCollections = {};

		var defer = $q.defer();
		var promises = [];
		for(var i in collections) {
			for(var j in operations) {
				var collection = collections[i];
				var operation = operations[j];

				var obj = StatsService.getDetailsParams(collection, operation);			
				
				promises.push(fetchDetails(obj.collection, obj.operation, obj.query).then(function(result) {

					// can't figure out how to do this aggregation server-side because we can't use $where with $match... 
					// so for now, trying client-side
					var nScannedForEachInstanceOfThisQuery = result.nScanned;

					var value;
					if(result.nScanned.length <= 0) {
						value = 0;
					}
					else {
						var total = 0;
						for(var i in nScannedForEachInstanceOfThisQuery) {
							total += nScannedForEachInstanceOfThisQuery[i];
						}
						value = total;
					}

					result.query = JSON.parse(result.query); // hack to show query results not stringified
					if(nscannedResults[StatsService.makeCategoryString(result)] === undefined) {
						nscannedResults[StatsService.makeCategoryString(result)] = {};
					}
					nscannedResults[StatsService.makeCategoryString(result)][result.collection] = value;
					nscannedCollections[result.collection] = true;

				}));
			}
		}

		$q.all(promises).then(function() {
			defer.resolve({
				nscannedResults: nscannedResults,
				nscannedCollections: nscannedCollections
			});
		});

		return defer.promise;
	};

	return {
		fetchDetails: fetchDetails,
		fetchAllDetails: fetchAllDetails
	};

});