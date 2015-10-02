/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("FieldListController", function($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$scope.entityId = $routeParams.entityId
	$scope.applicationId = $routeParams.applicationId
	$scope.entityId = $routeParams.entityId
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/entities/"+$routeParams.entityId+"/fields")
	.success(function(fields)
	{
		$scope.fields = fields;
	});
});

var types = [
	"Number", "String", "Long String", "Date", "Time", "Collection", "Mapped", "Button"
];

var references = [];

pam.controller("NewFieldController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.types = types;
	$scope.create = function()
	{
		var url = "api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$routeParams.entityId+"/fields";
		$http.post(url, $scope.field)
		.success(function(fields)
		{
			console.log("NewFieldController.create() post callback");
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/list" );
		});
	}
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/entities")
	.success(function(entities)
	{
		$scope.references = entities;
	});

});

pam.controller("EditFieldController", function($scope, $routeParams, $http, $location)
{

	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
	$scope.types = types;
//	$scope.button = {};
//	$scope.button.style = "default";
	
	$scope.update = function()
	{
		$http.put("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId, $scope.field)
			.success(function(entity){
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/list" );
			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId)
			.success(function(entity){
//				window.history.back();
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/list" );
			});
	}
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/entities")
	.success(function(entities)
	{
		$scope.references = entities;
		
		$http.get("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId)
		.success(function(field)
		{
			$scope.field = field;
		});

	});
});
