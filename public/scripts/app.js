'use strict';

var profilerApp = angular.module('profilerApp',['ngGrid', 'ui.bootstrap', 'ui.router']);

profilerApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('toplevel', {
      url: "/",
      templateUrl: "views/top-level.html",
      controller: "TopLevelController"
    })
    .state('zoom1', {
      url: "/zoom1?collection",
      templateUrl: "views/zoom1.html",
      controller: "Zoom1Controller"
    })
    .state('zoom2', {
      url: "/zoom2",
      templateUrl: "views/zoom2.html",
      controller: "Zoom2Controller"
    })
    .state('zoom3', {
      url: "/zoom3",
      templateUrl: "views/zoom3.html",
      controller: "Zoom3Controller"
    });

    $urlRouterProvider.otherwise("/");
});