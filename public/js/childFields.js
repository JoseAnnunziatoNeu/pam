/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("ChildFieldListController", function($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$scope.entityId = $routeParams.entityId
	$scope.applicationId = $routeParams.applicationId
	$scope.entityId = $routeParams.entityId
	$scope.fieldId = $routeParams.fieldId
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/entities/"+$routeParams.entityId+"/fields/"+$routeParams.fieldId+"/childFields")
	.success(function(childFields)
	{
		$scope.childFields = childFields;
	});
});

pam.controller("NewChildFieldController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
	$scope.create = function()
	{
		var url = "api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$routeParams.entityId+"/fields/"+$routeParams.fieldId+"/childFields";
		$http.post(url, $scope.childField)
		.success(function(childFields)
		{
			console.log("NewChildFieldController.create() post callback");
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$routeParams.fieldId+"/childFields/list" );
		});
	}
});

pam.controller("EditChildFieldController", function($scope, $routeParams, $http, $location)
{

	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
	$scope.childFieldId = $routeParams.childFieldId;
	
	$http.get("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/childFields/"+$scope.childFieldId)
		.success(function(childField)
		{
			$scope.childField = childField;
		});
	
	$scope.update = function()
	{
		$http.put("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/childFields/"+$scope.childFieldId, $scope.childField)
			.success(function(childField){
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/childFields/list" );
			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/childFields/"+$scope.childFieldId)
			.success(function(childField){
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/childFields/list" );
			});
	}
});
