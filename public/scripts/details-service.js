profilerApp.factory('DetailsService', function($http, $q, StatsService) {

	var fetchDetails = function(collection, operation, obj) {
		var defer = $q.defer();
		$http.post('/stats/collection/' + collection + '/operation', {operation: operation, obj: obj}).success(function(result) {
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
				obj: obj,
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
		var nscannedObjsResults = {};
		var collectionsResults = {};

		var defer = $q.defer();
		var promises = [];
		for(var i in collections) {
			for(var j in operations) {
				var collection = collections[i];
				var operation = operations[j];

				var obj = StatsService.getDetailsParams(collection, operation);			
				
				promises.push(fetchDetails(obj.collection, obj.operation, obj.obj).then(function(result) {

					result.obj = JSON.parse(result.obj); // hack to show query/command results not stringified
					var category = StatsService.makeCategoryString(result);

					var totalNScanned = aggregate(result.nScanned);
					if(nscannedResults[category] === undefined) {
						nscannedResults[category] = {};
					}
					nscannedResults[category][result.collection] = totalNScanned;

					var totalNScannedObjs = aggregate(result.nScannedObjs);
					if(nscannedObjsResults[category] === undefined) {
						nscannedObjsResults[category] = {};
					}
					nscannedObjsResults[category][result.collection] = totalNScannedObjs;

					collectionsResults[result.collection] = true;

				}));
			}
		}

		$q.all(promises).then(function() {
			defer.resolve({
				nscannedResults: nscannedResults,
				nscannedObjsResults: nscannedObjsResults,
				collectionsResults: collectionsResults
			});
		});

		return defer.promise;
	};

	// can't figure out how to do this aggregation server-side because we can't use $where with $match... 
	// so for now, trying client-side
	function aggregate(instances) {
		var value;
		if(instances.length <= 0) {
			value = 0;
		}
		else {
			var total = 0;
			for(var i in instances) {
				total += instances[i];
			}
			value = total;
		}
		return value;
	};

	return {
		fetchDetails: fetchDetails,
		fetchAllDetails: fetchAllDetails
	};

});