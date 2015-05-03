'use strict';

var profilerApp = angular.module('profilerApp',['ui.bootstrap', 'ui.router', 'angularSpinner']);

profilerApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      abstract: true,
      url: "/home",
      templateUrl: "views/home.html",
      controller: "HomeController"
    })   
    .state('home.collection', {
        url: "?collection"
    })
    .state('details', {
      url: "/details?collection&operation&query",
      templateUrl: "views/details.html",
      controller: "DetailsController"
    })
    .state('compare', {
      url: '/compare',
      templateUrl: 'views/comparison.html',
      controller: 'ComparisonController'
    })
    .state('profiler', {
      url: "/profiler",
      templateUrl: "views/profiler.html",
      controller: "ProfilerController"
    });

    $urlRouterProvider.otherwise("/home");
});

profilerApp.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({top: '10%'});
}]);