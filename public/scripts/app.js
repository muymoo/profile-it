'use strict';

var profilerApp = angular.module('profilerApp',['ngGrid', 'ui.bootstrap', 'ui.router']);

profilerApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('overview', {
      url: "/",
      templateUrl: "views/overview.html",
      controller: "ProfilerController"
    })
    .state('reports', {
      url: "/reports",
      templateUrl: "views/reports.html",
      controller: "ReportsController"
    });

    $urlRouterProvider.otherwise("/");
});