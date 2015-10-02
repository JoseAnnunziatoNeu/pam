/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("RunTest", function($scope, $routeParams, $http){
	console.log("run test");
	console.log($routeParams);
});

pam.controller("RunListController", function($scope, $routeParams, $http)
{
	$scope.applicationName = $routeParams['applicationName'];
	$scope.applicationId = $routeParams['applicationId'];
	
	$scope.parentCollectionName = $routeParams['parentCollectionName'];
	$scope.parentId = $routeParams['parentId'];
	
	$scope.collectionName = $routeParams['collectionName'];
	
	console.log("RunListController");
	
	$http.get("/api/run/"+$scope.parentId+"/"+$scope.collectionName)
		.success(function(instances) {
			console.log(instances);
			$scope.instances = instances;
		});
});

pam.controller("RunNewController", function($scope, $routeParams, $http, $location)
{
	$scope.applicationName = $routeParams['applicationName'];
	$scope.applicationId = $routeParams['applicationId'];
	$scope.parentCollectionName = $routeParams['parentCollectionName'];
	$scope.parentId = $routeParams['parentId'];
	$scope.collectionName = $routeParams['collectionName'];
	console.log("RunNewController");
	
	$http.get()//<--
		.success(function(application) {
		});
	
	$scope.create = function() {
		console.log("create");
		$location.path( "/run/"+$scope.applicationName+"/"+$scope.applicationId+"/"+$scope.parentCollectionName+"/"+$scope.parentId+"/"+$scope.collectionName+"/list" );
	}
});

pam.controller("RunEditController", function($scope, $routeParams, $http, $location)
{
	console.log("RunEditController");
});
