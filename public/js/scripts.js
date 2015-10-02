/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("ScriptListController", function($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$scope.entityId = $routeParams.entityId;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
//	/*
//	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/entities/"+$routeParams.entityId+"/fields/"+$scope.fieldId+"/scripts")
	$http.get("/api/"+$scope.fieldId+"/scripts")
	.success(function(scripts)
	{
		$scope.scripts = scripts;
	});
//	*/
});

var events = [
	"Click", "Swipe"
];

pam.controller("NewScriptController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
	$scope.events = events;
	
	$scope.create = function()
	{
		console.log("Create new script");
		var url = "api/"+$scope.fieldId+"/scripts";
		$http.post(url, $scope.script)
		.success(function(scripts)
		{
			console.log("NewScriptController.create() post callback");
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/fieldScripts/list" );
		});
	}
});

pam.controller("EditScriptController", function($scope, $routeParams, $http, $location)
{

	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.entityId = $routeParams.entityId;
	$scope.fieldId = $routeParams.fieldId;
	$scope.scriptId = $routeParams.scriptId;
	$scope.events = events;
	
	$scope.update = function()
	{
		$http.put("api/"+$scope.fieldId+"/scripts/"+$scope.scriptId, $scope.script)
			.success(function(script){
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/fieldScripts/list" );
			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/"+$scope.fieldId+"/scripts/"+$scope.scriptId)
		.success(function(script){
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/entities/"+$scope.entityId+"/fields/"+$scope.fieldId+"/fieldScripts/list" );
		});
	}
	$http.get("api/"+$scope.fieldId+"/scripts/"+$scope.scriptId)
	.success(function(script)
	{
		$scope.script = script;
	});
});
