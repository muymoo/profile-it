'use strict';

var profilerApp = angular.module('profilerApp',['ngGrid', 'ui.bootstrap', 'ui.router', 'angularSpinner']);

profilerApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html",
      controller: "HomeController"
    })    
    .state('details', {
      url: "/details?collection&operation&obj",
      templateUrl: "views/details.html",
      controller: "DetailsController"
    })
    .state('profiler', {
      url: "/profiler",
      templateUrl: "views/profiler.html",
      controller: "ProfilerController"
    });

    $urlRouterProvider.otherwise("/");
});

profilerApp.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({top: '10%'});
}]);