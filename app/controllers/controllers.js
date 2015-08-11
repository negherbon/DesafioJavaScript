app.controller('VehiclesController', function($rootScope, $location)
{
	$rootScope.active = $location.path();
	$rootScope.title = "Veículos";
	// $rootScope.brands = data.brands;
});

app.controller('BrandsController', function($rootScope, $location)
{
	$rootScope.active = $location.path();
	$rootScope.title = "Marcas";
});