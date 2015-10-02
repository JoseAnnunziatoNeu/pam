/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

//var types = ["Variable", "Arithmetic", "Transform", "String", "Boolean", "Comparison"];

pam.controller("StatementListController", function($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
	$scope.parentId = $routeParams.parentId;
	
	$http.get("/api/"+$scope.parentId+"/statements")
	.success(function(results)
	{
		$scope.results = results;
	});
});

pam.controller("NewStatementController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
	$scope.parentId = $routeParams.parentId;
//	$scope.types = types;
	
	$scope.create = function()
	{
		console.log("Create new Statement");
		var url = "api/"+$scope.parentId+"/statements";
		$http.post(url, $scope.statement)
		.success(function(results)
		{
			console.log("NewStatementController.create() post callback");
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/fieldScripts/"+$scope.parentId+"/statements/list" );
		});
	}
});

pam.controller("EditStatementController", function($scope, $routeParams, $http, $location)
{

	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
	$scope.parentId = $routeParams.parentId;
	$scope.instanceId = $routeParams.instanceId;
//	$scope.types = types;
	
	$scope.update = function()
	{
		$http.put("api/"+$scope.parentId+"/statements/"+$scope.instanceId, $scope.model)
		.success(function(result){
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/fieldScripts/"+$scope.parentId+"/statements/list" );
		});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/"+$scope.parentId+"/statements/"+$scope.instanceId)
		.success(function(result){
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/fieldScripts/"+$scope.parentId+"/statements/list" );
		});
	}
	$http.get("api/"+$scope.parentId+"/statements/"+$scope.instanceId)
	.success(function(result)
	{
		$scope.model = result;
	});
});
