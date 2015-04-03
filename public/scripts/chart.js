profilerApp.directive('chart', function() {
	return {
		restrict: 'E',
		template: '<div style="width:100%;"></div>',
		scope: {
			title: '@',
			yAxisTitle: '@',
			seriesAndCategories: '='
		},
		link: function(scope, element) {

			var config = {
		        chart: {
		        	renderTo: element[0],
		            type: 'column',
		            zoomType: 'xy'
		        },
		        title: {
		            text: scope.title
		        },
		        xAxis: {
		            categories: scope.categories,
		            min: 0
		        },
		        yAxis: {
		            title: {
		                text: scope.yAxisTitle
		            }
		        },
		        series: scope.series,
		        credits: {
	      			enabled: false
	  			}
		    };

		    scope.chart = new Highcharts.Chart(config);

		    scope.$watch('seriesAndCategories', function(newData) {

		    	if(newData) {
			    	console.log(newData);

			    	scope.chart.xAxis[0].setCategories(newData.categories, false);
			    	for(var idx in newData.series) {
			    		scope.chart.addSeries(newData.series[idx]);
			    	}

			    	scope.chart.reflow();
			    }
		    });
		}
	};
});