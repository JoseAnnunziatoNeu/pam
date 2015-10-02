/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("PageListController", function($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$scope.pageId = $routeParams.pageId
	$scope.applicationId = $routeParams.applicationId
	$http.get("api/users/"+$scope.username+"/applications/"+$routeParams.applicationId+"/pages")
	.success(function(pages)
	{
		$scope.pages = pages;
	});
});

pam.controller("NewPageController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.create = function()
	{
		console.log("NewPageController.create()");
		console.log($routeParams.username);
		console.log($routeParams.applicationId);
		var url = "api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/pages";
		console.log(url);
		$http.post(url, $scope.newPage)
		.success(function(applications)
		{
			console.log("NewPageController.create() post callback");
			$location.path( $scope.username+"/applications/"+$scope.applicationId+"/pages/list" );
		});
	}
});

pam.controller("EditPageController", function($scope, $routeParams, $http, $location)
{

	$scope.username = $routeParams.username;
	$scope.applicationId = $routeParams.applicationId;
	$scope.pageId = $routeParams.pageId;
	
	$http.get("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId)
		.success(function(page)
		{
			$scope.editPage = page;
		});
	
	$scope.update = function()
	{
		$http.put("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId, $scope.editPage)
			.success(function(page){
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/pages/list" );
			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/users/"+$scope.username+"/applications/"+$scope.applicationId+"/pages/"+$scope.pageId)
			.success(function(page){
//				window.history.back();
				$location.path( $scope.username+"/applications/"+$scope.applicationId+"/pages/list" );
			});
	}
});
