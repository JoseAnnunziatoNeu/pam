/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("FormEditController", function($scope, $routeParams, $http)
{
	console.log("FormEditController !@#");
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.pageId = $routeParams.pageId;
	$scope.widgetId = $routeParams.widgetId
	
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/pages/"+$routeParams.pageId+"/widgets")
	.success(function(widgets)
	{
		$scope.widgets = widgets;
	});
});

pam.controller("FormEditController", function($scope, $routeParams, $http)
{
	console.log("FormEditController !@#");
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.pageId = $routeParams.pageId;
	$scope.widgetId = $routeParams.widgetId
	
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/pages/"+$routeParams.pageId+"/widgets")
	.success(function(widgets)
	{
		$scope.widgets = widgets;
	});
});


pam.controller("NewFormControlController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.pageId = $routeParams.pageId;
	$scope.create = function()
	{
		console.log("NewWidgetController.create()");
		console.log($routeParams.username);
		console.log($routeParams.applicationId);
		var url = "api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId+"/widgets";
		console.log(url);
		$scope.newWidget.pageId = $scope.pageId;
		$http.post(url, $scope.newWidget)
		.success(function(applications)
		{
			console.log("NewWidgetController.create() post callback");
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId+"/widgets/list" );
		});
	}
});

pam.controller("EditFormControlController", function($scope, $routeParams, $http, $location)
{

	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.pageId = $routeParams.pageId;
	$scope.widgetId = $routeParams.widgetId;
	
	$http.get("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId+"/widgets/"+$scope.widgetId)
		.success(function(widget)
		{
			$scope.editWidget = widget;
		});
	
	$scope.update = function()
	{
		$http.put("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId+"/widgets/"+$scope.widgetId, $scope.editWidget)
			.success(function(widget){
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId+"/widgets/list" );
			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId+"/widgets/"+$scope.widgetId)
			.success(function(widget){
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId+"/widgets/list" );
			});
	}
});
