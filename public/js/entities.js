/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("EntityListController", function($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$scope.entityId = $routeParams.entityId
	$scope.applicationId = $routeParams.applicationId
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/entities")
	.success(function(entities)
	{
		$scope.entities = entities;
	});
});

pam.controller("NewEntityController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.create = function()
	{
		var url = "api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities";
		console.log(url);
		$http.post(url, $scope.entity)
		.success(function(applications)
		{
			console.log("NewEntityController.create() post callback");
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/list" );
		});
	}
});

pam.controller("EditEntityController", function($scope, $routeParams, $http, $location)
{

	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
		
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/entities/"+$scope.entityId+"/fields")
	.success(function(fields)
	{
		$scope.fields = fields;
		$http.get("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId)
		.success(function(entity)
		{
			entity.template = htmlDecode(entity.template);
			$scope.entity = entity;
		});
	});
		
	$scope.update = function()
	{
		$scope.entity.template = htmlEncode($scope.entity.template);
		
		$http.put("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId, $scope.entity)
		.success(function(entity){
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/list" );
		});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId)
		.success(function(entity){
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/list" );
		});
	}
});
