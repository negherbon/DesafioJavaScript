var app = angular.module('app',['ngRoute']);

app.config(function($routeProvider, $locationProvider)
{
   $routeProvider

   .when('/', {
      templateUrl : 'app/views/vehicles.html',
      controller     : 'VehiclesController',
   })
  .when('/brands', {
      templateUrl : 'app/views/brands.html',
      controller  : 'BrandsController',
   }) 
   .otherwise ({ redirectTo: '/' });

});