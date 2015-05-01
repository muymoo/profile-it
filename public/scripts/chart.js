profilerApp.directive('chart', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<div style="width:100%;"></div>',
		scope: {
			title: '@',
			subtitle: '@?',
			yAxisTitle: '@',
			seriesAndCategories: '=',
			selectBarEvent: '@?'
		},
		link: function(scope, element) {

			if(!scope.selectBarEvent) {
				scope.selectBarEvent = 'select-bar';
			}

			var config = {
		        chart: {
		        	renderTo: element[0],
		            type: 'bar',
		            zoomType: 'xy'
		        },
		        title: {
		            text: scope.title
		        },
		        subtitle: {
		        	text: scope.subtitle
		        },
		        xAxis: {
		            categories: scope.categories,
		            min: 0,
		            labels: {
			            enabled: true
					}
		        },
		        yAxis: {
		            title: {
		                text: scope.yAxisTitle
		            }
		        },
		        series: scope.series,
		        credits: {
	      			enabled: false
	  			},
	  			legend: {
	  				align: 'right',
	  				verticalAlign: 'middle',
            		layout: 'vertical',
	  			},
	  			plotOptions: {
	  				series: {
	                    cursor: 'pointer',
	                    point: {
	                        events: {
	                            click: function (e) {
	                            	scope.$emit(scope.selectBarEvent, this.category); 
	                            }
	                        }
	                    }
	                }
	  			}
		    };

		    scope.chart = new Highcharts.Chart(config);

		    scope.$watch('seriesAndCategories', function(newData) {

		    	if(newData) {

		    		scope.chart.xAxis[0].setCategories(null, false);
					while(scope.chart.series.length > 0) {
					    scope.chart.series[0].remove(false);
					}

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