/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("AppStoreController", function ($scope, $routeParams, $http, $location) {
    //$scope.message = "";
    $scope.username = "";
    console.log("AppStoreController");
    //setTimeout(function () {
    //    document.body.scrollTop = document.documentElement.scrollTop = -1000;
    //}, 100);

    $scope.username = $routeParams.username;
    $http.get("api/appStore/list")
	.success(function (applications) {
	    var allApps = applications;
	    $http.get("api/users/appStore/" + $scope.username + "/applications")
	    //$http.get("api/appStore/"+$scope.username+"/list")
	    .success(function (appStoreApps) {
	        for (var app in allApps) {
	            allApps[app].isUserApp = "no";
	            for (var as in appStoreApps) {
	                //console.log(">>" + appStoreApps[as].appName + " | " + allApps[app].name);
	                if (appStoreApps[as].appName == allApps[app].name) {
	                    allApps[app].isUserApp = "yes";
	                }
	            }
	        }
	        $scope.applications = allApps;
	    })
	    console.log("SUCCESS");
	    console.log(applications);
	    //$location.path("/" + $scope.username + "/run/applications/list");
	    //$location.path("/" + $scope.username + "/appStore");
	});

    $scope.add = function (application) {
        console.log("reached in add function: " + application.name + "/" + $routeParams.username);
        var currentUsername = $routeParams.username;
        var applicationName = application.name;
        var applicationId = application._id;
        // check if already added        
        $http.get("/api/appStore/" + currentUsername + "/" + applicationName)
	    .success(function (appStoreApp) {
	        console.log(appStoreApp);
	        if (appStoreApp.length != 0) {
	            console.log("Already added..");
	        } else {
	            var obj = { appName: applicationName, username: currentUsername, appId: applicationId };
	            $http.post("/api/users/appStore/add", obj)
                .success(function (result) {
                    console.log(result);
                    if (result.length != 0) {
                        for (var i in $scope.applications) {
                            if ($scope.applications[i].name == application.name) {
                                $scope.applications[i].isUserApp = "yes";
                            }
                        }
                        console.log("added " + applicationName + " to " + currentUsername);
                        $location.path("/" + $scope.username + "/run/applications/list");
                    }
                });
	        }	        
	    });
    }

    $scope.remove = function (application) {
        console.log("reached in remove function: " + application.name + "/" + $routeParams.username);
        var currentUsername = $routeParams.username;
        var applicationName = application.name;
        var applicationId = application._id;
        // check if already added        
        $http.get("/api/appStore/" + currentUsername + "/" + applicationName)
	    .success(function (appStoreApp) {
	        console.log(appStoreApp);
	        //setTimeout(function () {
	        //    document.body.scrollTop = document.documentElement.scrollTop = -1000;
	        //}, 100);
	        if (appStoreApp.length == 0) {
	            console.log("Application was not added for this user..");
	        } else {	            
	            //var obj = { appName: applicationName, username: currentUsername, appId: applicationId };
	            
	            $http.delete("/api/appStore/users/remove/" + applicationName + "/" + currentUsername )
                .success(function (result) {
                    console.log("appstore delete: "+result);
                    if (result.length != 0) {
                        for (var i in $scope.applications) {
                            if ($scope.applications[i].name == application.name) {
                                $scope.applications[i].isUserApp = "no";
                            }
                        }
                        console.log("removed " + applicationName + " from " + currentUsername);
                        // Delete all data
                        $http.delete("/api/userData/remove/" + applicationName + "/" + currentUsername)
                            .success(function(result) {
                                console.log("UserData delete: " + result);
                            });
                    }
                });
	        }	        
	    });
    }

});
