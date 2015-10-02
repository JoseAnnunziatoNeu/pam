/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("ApplicationListController", function($scope, $routeParams, $http)
{
	setTimeout(function(){
		document.body.scrollTop = document.documentElement.scrollTop = -1000;
	}, 100);

	$scope.username = $routeParams.username;
	$http.get("api/users/"+$scope.username+"/applications")
	.success(function(applications)
	{
		$scope.applications = applications;
	});
});


// Run controller for listing applications for users
pam.controller("UserRunApplicationController", function ($scope, $routeParams, $http, $location) {
    
    console.log("UserRunApplicationController");
    setTimeout(function () {
        document.body.scrollTop = document.documentElement.scrollTop = -1000;
    }, 100);

    $scope.username = $routeParams.username;
    $http.get("api/users/appStore/" + $scope.username + "/applications")
	.success(function (applications) {
	    $scope.applications = applications;
	});

    //$scope.run = function (application) {
    //    console.log("RUN APP");
    //    //$scope.editApplication = application;
    //    console.log(application);

    //    if (typeof application.rootEntity == "undefined" || application.rootEntity == "None") {
    //        var path = "#/collections/" + $scope.username + "/" + application.appName;
    //        console.log("[1]");
    //        console.log(path);
    //        $location.path(path);
    //    }
    //    else {
    //        console.log("[2]");
    //        $location.path("list/" + $scope.username + "/" + application.appName + "/null/null/" + application.rootEntity);
    //    }
    //}
});

pam.controller("NewApplicationController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.create = function()
	{
		$scope.newApplication.username = $scope.username
		$http.post("api/users/"+$scope.username+"/applications", $scope.newApplication)
		.success(function(applications)
		{
			$location.path( $scope.username+"/applications/list" );
		});
	}
});

pam.controller("EditApplicationController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	var applicationid = $routeParams.applicationid;
	

	$http.get("api/users/"+$scope.username+"/applications/"+applicationid+"/entities")
	.success(function(entities)
	{
		$scope.entities = entities;
		$http.get("api/users/"+$scope.username+"/applications/"+applicationid)
		.success(function(application)
		{
			$scope.editApplication = application;
		});
	});
	
	$scope.run = function()
	{
		console.log("RUN");
		console.log($scope.editApplication);
		
		if(typeof $scope.editApplication.rootEntity == "undefined" || $scope.editApplication.rootEntity == "None")
		{
			$location.path("/collections/"+$scope.username+"/"+$scope.editApplication.name);
		}
		else
		{
			$location.path("/list/"+$scope.username+"/"+$scope.editApplication.name+"/null/null/"+$scope.editApplication.rootEntity);
		}

//		console.log(pam);
//		console.log(pam.config);
//		pam.config(["$routeProvider", function($routeProvider, $http){
//			console.log($routeProvider);
//		}]);

//		$location.path("/run/"+$scope.editApplication.name+"/"+$scope.editApplication._id+"/null/null/"+$scope.editApplication.rootEntity+"/list");
//		$location.path( "/run/"+$routeParams.applicationid+"/list" );
	}
	
	$scope.update = function()
	{
		$scope.editApplication.username = $scope.username;
		$http.put("api/users/"+$scope.username+"/applications/"+applicationid, $scope.editApplication)
			.success(function(application){
				$location.path( $scope.username+"/applications/list" );
			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/users/"+$scope.username+"/applications/"+applicationid)
			.success(function(application){
				$location.path( $scope.username+"/applications/list" );
			});
	}
});
