'use strict';


angular
  .module('app', [
    'ngTouch',
    'infinite-scroll',
    'app.controllers',
    'app.constants',
  ])
  .config(config);

config.$inject = ['$interpolateProvider', '$locationProvider'];
function config($interpolateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $interpolateProvider.startSymbol('{$');
  $interpolateProvider.endSymbol('$}');
}
