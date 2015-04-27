profilerApp.directive('chart', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<div style="width:100%;"></div>',
		scope: {
			title: '@',
			subtitle: '@?',
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
		        subtitle: {
		        	text: scope.subtitle
		        },
		        xAxis: {
		            categories: scope.categories,
		            min: 0,
		            labels: {
			            enabled: false
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
	                            	scope.$emit('select-bar', this.category, this.y); 
	                            }
	                        }
	                    }
	                }
	  			}
		    };

		    scope.chart = new Highcharts.Chart(config);

		    scope.$watch('seriesAndCategories', function(newData) {

		    	if(newData) {
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