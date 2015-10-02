/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/

pam.controller("RunCollectionsController", function($scope, $routeParams, $http, $sce)
{
    console.log("at new run...");
	$scope.username  = $routeParams.username;
	$scope.application = $routeParams.application;
	var applicationId = $routeParams.applicationId;
	$scope.state = $routeParams.state;
	
	console.log("RunCollectionsController");
	$http.get("api/users/"+$scope.username+"/"+$scope.application+"/entities")
	.success(function(entities)
	{
	    $scope.collections = entities;
	    $http.get("api/users/" + $scope.username)
	    .success(function (user) {
	        $scope.currentUser = user[0];
	    })
        .error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
        });
	})
    .error(function (data, status, headers, config) {
        console.log(data + status + headers + config);
    });
});

pam.controller("RunListController", function($scope, $routeParams, $http, $sce)
{
	$scope.username  = $routeParams.username;
	$scope.application = $routeParams.application;
	$scope.state = $routeParams.state;
	$scope.collection = $routeParams.collection;

    //Sandipan
	console.log("RunListController");
	console.log("STATE: " + $scope.state);
    //Sandipan
	var state = $scope.state.split("/");
	var parentCollectionIndex = state.length-2;
	var parentIdIndex = state.length-1;
	var parentCollection = state[parentCollectionIndex];
	var parentId = state[parentIdIndex];
	
	$scope.parentCollection = parentCollection;
	$scope.parentId = parentId;
	
	var prevState = "";
	for(var i=0; i<state.length - 2; i++)
	{
		prevState += state[i];
		if(i < state.length - 3)
			prevState += "/";
	}
	console.log("PREV STATE");
	console.log(prevState);
	$scope.previousState = prevState;
//	console.log($scope.collection);

	$http.get("api/"+$scope.username+"/"+$scope.application+"/collection/"+$scope.collection)
	.success(function(entity)
	{
		console.log("ENTITY");
		console.log(entity);

		var template = htmlDecode(entity.template);
		$scope.template = entity.template;
		
		console.log("TEMPLATE");
		console.log(template);

		var listViewLabelField = entity.listItem;

		$http.get("new/"+$scope.username+"/"+$scope.application+"/"+$scope.collection+"/fields")
		.success(function(fields)
		{
			$scope.fields = fields;
			console.log("FIELDS");
			console.log(fields);

			$http.get("/list/"+$scope.username+"/"+$scope.application+"/"+parentCollection+"/"+parentId+"/"+$scope.collection)
			.success(function(instances){
				
				var instanceRender = [];
				if(typeof template != "undefined" && template != "") {
					
					for(var i in instances) {
						var instance = instances[i];
						
						var render = template;
						for(var f in fields) {
							var field = fields[f];
							var t = "{{"+field.name+"}}";
							render = render.replace(t, instance[field.name]);
						}
						
						render = $sce.trustAsHtml(render);
						
						instanceRender.push({
							label: render,
							_id: instance["_id"]
						});
					}
				}
				else
				{
					for(var i in instances) {
						var instance = instances[i];

						var render = $sce.trustAsHtml(instance[listViewLabelField]);
//						var render = instance[listViewLabelField];

						instanceRender.push({
							label: render,
							_id: instance["_id"]
						});
					}
				}
				$scope.instances = instanceRender;
			});
		});		
	});
});

pam.controller("RunNewController", function($scope, $routeParams, $http, $location)
{
	console.log("RunNewController");
	
	$scope.username  = $routeParams.username;
	$scope.application = $routeParams.application;
	$scope.state = $routeParams.state;
	$scope.collection = $routeParams.collection;
	
	console.log($scope.username);
	console.log($scope.application);
	console.log($scope.state);
	console.log($scope.collection);
	
	var state = $scope.state.split("/");
	var parentCollectionIndex = state.length-2;
	var parentIdIndex = state.length-1;
	var parentCollection = state[parentCollectionIndex];
	var parentId = state[parentIdIndex];

	$scope.parentCollection = parentCollection;
	$scope.parentId = parentId;

	$http.get("new/"+$scope.username+"/"+$scope.application+"/"+$scope.collection+"/fields")
	.success(function(fields)
	{
		$scope.fields = fields;
	});

	$scope.model = {};

	$scope.create = function() {
		console.log("create model: ");
		console.log($scope.model);
		
		// 7/30, 11:36 HERE //
		
		$http.post("new/"+$scope.username+"/"+$scope.application+"/"+parentCollection+"/"+parentId+"/"+$scope.collection, $scope.model)
		.success(function(){
			$location.path( "/list/"+$scope.username+"/"+$scope.application+"/"+$scope.state+"/"+$scope.collection );
		});
	}
});

pam.controller("RunEditController", function($scope, $routeParams, $http, $location)
{
	console.log("RunEditController");
	
	$scope.username  = $routeParams.username;
	$scope.application = $routeParams.application;
	$scope.state = $routeParams.state;
	$scope.collection = $routeParams.collection;
	$scope.id = $routeParams.id;
	
	console.log($scope.username);
	console.log($scope.application);
	console.log($scope.state);
	console.log($scope.collection);
	console.log($scope.id);
	
	var state = $scope.state.split("/");
	var parentCollectionIndex = state.length-2;
	var parentIdIndex = state.length-1;
	var parentCollection = state[parentCollectionIndex];
	var parentId = state[parentIdIndex];
	
	$scope.parentCollection = parentCollection;
	$scope.parentId = parentId;

	$scope.model = {};
	
	$http.get("new/"+$scope.username+"/"+$scope.application+"/"+$scope.collection+"/fields")
	.success(function(fields)
	{
		$scope.fields = fields;
		
		console.log("FIELDS");
		console.log(fields);
		
		$scope.children = [];
		for(var f in fields) {
			var field = fields[f];
			if(field.type == "Collection") {
				$scope.children.push(field);
			}
		}
		
		$http.get("list/"+$scope.username+"/"+$scope.application+"/"+parentCollection+"/"+parentId+"/"+$scope.collection+"/"+$scope.id)
		.success(function(instance){
			$scope.model = instance;
			console.log($scope.model);
		});

	});

	$scope.remove = function(id) {
		console.log("REmove " + id);
		$http.delete($scope.username+"/"+$scope.application+"/"+$scope.collection+"/"+id)
		.success(function(){
			$location.path( "/list/"+$scope.username+"/"+$scope.application+"/"+$scope.state+"/"+$scope.collection );
		});
	}
	
	$scope.update = function(model) {
		console.log("update");
		console.log(model);
	
		$http.put("new/"+$scope.username+"/"+$scope.application+"/"+parentCollection+"/"+parentId+"/"+$scope.collection+"/"+model._id, $scope.model)
		.success(function(){
			$location.path( "/list/"+$scope.username+"/"+$scope.application+"/"+$scope.state+"/"+$scope.collection );
		});
	}
});

pam.controller("RunViewController", function($scope, $routeParams, $http)
{
	$scope.click = function(button) {
		console.log(button);
	}
	
	console.log("RunViewController");
	
	$scope.username  = $routeParams.username;
	$scope.application = $routeParams.application;
	$scope.state = $routeParams.state;
	$scope.collection = $routeParams.collection;
	$scope.id = $routeParams.id;
	
	console.log($scope.username);
	console.log($scope.application);
	console.log($scope.state);
	console.log($scope.collection);
	console.log($scope.id);
	
	var state = $scope.state.split("/");
	var parentCollectionIndex = state.length-2;
	var parentIdIndex = state.length-1;
	var parentCollection = state[parentCollectionIndex];
	var parentId = state[parentIdIndex];
	
	$scope.parentCollection = parentCollection;
	$scope.parentId = parentId;

	$scope.model = {};
	
	$http.get("/api/53e2e2be9a8c059427195e21/scripts")
	.success(function(scripts)
	{
		console.log("SCRIPTS !!!!");
		$scope.scripts = scripts;
		console.log(scripts);
	});
		
	$http.get("new/"+$scope.username+"/"+$scope.application+"/"+$scope.collection+"/fields")
	.success(function(fields)
	{
		$scope.fields = fields;
		
		console.log("FIELDS");
		console.log(fields);
		
		$scope.children = [];
		for(var f in fields) {
			var field = fields[f];
			if(field.type == "Collection") {
				$scope.children.push(field);
			}
		}
		
		$http.get("list/"+$scope.username+"/"+$scope.application+"/"+parentCollection+"/"+parentId+"/"+$scope.collection+"/"+$scope.id)
		.success(function(instance){
			$scope.model = instance;
			console.log($scope.model);
		});

	});
});
