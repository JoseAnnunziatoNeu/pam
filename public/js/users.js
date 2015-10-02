/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("LoginController", function($scope, $routeParams, $http, $location)
{
	$scope.message = "";
	$scope.username = "";
	console.log("LoginController");
	$scope.login = function() {
		$scope.message = "";
		$http.get("/api/users/"+$scope.username+"/"+$scope.password)
		.success(function (user) {
		    console.log(user);
			if(user.length == 0)
				$scope.message = "Username and/or password does not exist. Try again";
			else
			    if (user[0].type == "Developer")
			        $location.path(user[0].username + "/applications/list");
			    else
			        $location.path(user[0].username + "/run/applications/list");
		});
	}
});

pam.controller("TermsController", function($scope, $routeParams, $http, $location)
{
	console.log("TermsController");
	$scope.iAccept = function()
	{
		console.log($scope.accept);
		if($scope.accept)
		{
			location.href = "http://localhost:8080/#/register";
		}
	}
});

var userTypes = ["Developer", "User"];

pam.controller("RegisterController", function($scope, $routeParams, $http, $location)
{
    $scope.message = "";
    $scope.userTypes = userTypes;
	$scope.register = function() {
		$scope.message = "";
		if($scope.newUser.password == $scope.newUser.password2)
		{
			// search for the user to see if it already exists
			$http.get("/api/users/"+$scope.newUser.username)
			.success(function(newUser) {
				// if user does not exist, create it new
				if(newUser.length == 0) {
					$http.post("/api/users", $scope.newUser)
					.success(function(newUser){
					    if (newUser == null)
					        $scope.message = "Unable to register user";
					    else
					        if (newUser.type == "Developer")
					            $location.path($scope.newUser.username + "/applications/list");
					        else
					            $location.path($scope.newUser.username + "/run/applications/list");
					});
				}
				else
				{
					$scope.message = "User already exists";
				}
			});
		}
		else
		{
			$scope.message = "Passwords must match. Try again";
		}
	}
});