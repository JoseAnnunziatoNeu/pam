/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/
// set up ======================================================================
var mongojs   = require('mongojs');
var express   = require('express');
var app       = express(); 								// create our app w/ express
var port  	  = process.env.OPENSHIFT_NODEJS_PORT || 8124; 				// set the port
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;

var connection_string = '127.0.0.1:27017/pam';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
	connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_APP_NAME;
}

var db = mongojs(connection_string, ['users', 'applications', 'entities', 'fields', 'scripts', 'statements', 'childFields', 'pages', 'widgets', 'forms', 'userData', 'userApps', 'appStore']);

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});


/*
 *	Run
 */
app.get('/api/run/:applicationId', function(req, res)
{
});
// GET ALL
app.get('/list/:username/:application/:parentCollection/:parentId/:collection', function(req, res)
{
	var user = req.params.username;
	var applicationName = req.params.application;
	var parentCollection = req.params.parentCollection;
	var parentId = req.params.parentId;
	var collection = req.params.collection;
	
    //Sandipan
    //var collection = db.collection(collection);
    //if(parentId == "null" || typeof parentId == "undefined" || parentId == "") {
	//	collection.find({parentId : "null"}, function(err, docs){
	//		res.json(docs);
	//	});
	//} else {
	//	collection.find({parentId : parentId}, function(err, docs){
	//		res.json(docs);
	//	});
    //}
	if (parentId == "null" || typeof parentId == "undefined" || parentCollection == "") {
	    db.applications.findOne({ name: applicationName }, function (err, application) {
	        db.entities.findOne({ application_id: application._id, name: collection }, function (err, entity) {	            
	            db.userData.find({ parentId: "null", entity_id: entity._id, username: user, application: applicationName }, function (err, docs) {
	                console.log("-->" + docs);
	                res.json(docs);
	            });
	        });
	    });
	} else {
	    db.applications.findOne({ name: applicationName }, function (err, application) {
	        db.entities.findOne({ application_id: application._id, name: collection }, function (err, entity) {
	            db.userData.find({ parentId: parentId, entity_id: entity._id, username: user, application: applicationName }, function (err, docs) {
	                console.log("-->" + docs);
	                res.json(docs);
	            });
	        });
	    });
	}

    //Sandipan
});
// GET ONE
app.get('/list/:username/:application/:parentCollection/:parentId/:collection/:id', function(req, res)
{
	var username = req.params.username;
	var application = req.params.application;
	var parentCollection = req.params.parentCollection;
	var parentId = req.params.parentId;
	var collection = req.params.collection;
	var id = req.params.id;
    //Sandipan
	//var collection = db.collection(collection);
	//collection.findOne({_id : mongojs.ObjectId(id)}, function(err, instance){
	//	res.json(instance);
	//});	
	db.userData.findOne({ _id: mongojs.ObjectId(id) }, function (err, instance) {
	    res.json(instance);
	});
    //Sandipan
});
// DELETE ONE
app.delete("/:username/:application/:collection/:id", function(req, res) {
    var id = req.params.id;
    //Sandipan
	//var collection = req.params.collection;
	//var collection = db.collection(collection);
	//collection.remove({_id : mongojs.ObjectId(id)}, function(err, instance){
	//	res.json(instance);
	//});

	db.userData.remove({ _id: mongojs.ObjectId(id) }, function (err, instance) {
	    res.json(instance);
	});
    //Sandipan
});

// DELETE MANY
app.delete("/api/userData/remove/:applicationName/:currentUsername", function (req, res) {

    db.userData.remove({ username: req.params.currentUsername, application: req.params.applicationName }, function (err, instance) {
        res.json(instance);
    });
});

 //GET ONE
//app.get('/api/run/:applicationId/:parentId/:entityName/:instanceId', function(req, res)
app.get('/api/run/:collectionName/:instanceId', function(req, res)
{
	var instanceId = req.params.instanceId;
	var entityName = req.params.entityName;
	var collection = db.collection(entityName);
	collection.findOne({_id : mongojs.ObjectId(instanceId)}, function(err, doc){
		res.json(doc);
	});
});
// CREATE
app.post('/new/:username/:application/:parentCollection/:parentId/:collection', function(req, res)
{
	console.log("CREATE");
	
	var username = req.params.username;
	var application = req.params.application;
	var parentCollection = req.params.parentCollection;
	var parentId = req.params.parentId;
	var collection = req.params.collection;
	var instance = req.body;
	console.log("INSERT RUNNING");
	console.log([username, application, parentCollection, parentId, collection, instance]);
	
	instance.parentCollection = parentCollection;
	instance.parentId = parentId;
	instance.application = application;
	instance.username = username;
	
    //Sandipan
	//var collection = db.collection(collection);
	//collection.insert(req.body, function(err, newDoc)
	//{
	//	res.json(newDoc);
    //});
	db.applications.findOne({ name: application }, function (err, application) {
	    db.entities.findOne({ application_id: application._id, name: collection }, function (err, entity) {
	        instance.entity_id = entity._id;
	        db.userData.insert(req.body, function (err, newDoc) {
	            res.json(newDoc);
	        });
	    });
	});	
    //Sandipan
});
// UPDATE
app.put('/new/:username/:application/:parentCollection/:parentId/:collection/:id', function(req, res)
{
	console.log("UPDATE");
	
	var username = req.params.username;
	var application = req.params.application;
	var parentCollection = req.params.parentCollection;
	var parentId = req.params.parentId;
	var collection = req.params.collection;
	var id = req.params.id;
	var instance = req.body;	
	delete instance._id;
	
	console.log([username, application, parentCollection, parentId, collection, id, instance]);
	
	instance.parentCollection = parentCollection;
	instance.parentId = parentId;
	instance.application = application;
	instance.username = username;
    //Sandipan
	//var collection = db.collection(collection);
	//collection.update({_id: mongojs.ObjectId(id)}, instance, function(err, newDoc)
	//{
	//	res.json(newDoc);
    //});
	
	db.entities.findOne({ _id: mongojs.ObjectId(instance.entity_id) }, function (err, entity) {
	    instance.entity_id = entity._id;
	    db.userData.update({ _id: mongojs.ObjectId(id) }, instance, function (err, newDoc) {
	        res.json(newDoc);
	    });
	});
});
// App Store

app.get('/api/appStore/list', function (req, res) {
    db.applications.find().sort({ name: 1 }, function (err, applications) {
        res.json(applications);
    });
});

app.get('/api/appStore/:username/:appName', function (req, res) {
    db.appStore.find({ username: req.params.username, appName: req.params.appName }, function (err, appStoreApp) {
        res.json(appStoreApp);
    });
});

app.get('/api/appStore/:username/list', function (req, res) {
    console.log(req.params.username);
    db.appStore.find({ username: req.params.username }, function (err, appStoreApps) {
        console.log("all apps: ");
        console.log(appStoreApps);
        res.json(appStoreApps);
    });
});

app.post('/api/users/appStore/add', function (req, res) {
    db.appStore.insert(req.body, function (err, obj) {
        res.json(obj);
    });
});
// Delete application for user
app.delete('/api/appStore/users/remove/:appName/:username', function (req, res) {    
    console.log(req.params.username + "|" + req.params.appName);
    db.appStore.remove({ username: req.params.username, appName: req.params.appName }, function (err, appStoreApp) {
        res.json(appStoreApp);
    });
});

/*
 *	Applications
 */

// Get all applications for username
app.get('/api/users/:username/applications', function(req, res)
{
	db.applications.find({username: req.params.username}, function(err, applications)
	{
		res.json(applications);
	});
});
//Get all applications for username from appstore
app.get('/api/users/appStore/:username/applications', function (req, res) {
    db.appStore.find({ username: req.params.username }, function (err, applications) {
        res.json(applications);
    });
});

// Get a specific application for a username
app.get('/api/users/:username/applications/:applicationid', function(req, res)
{
	db.applications.findOne({_id: mongojs.ObjectId(req.params.applicationid)}, function(err, application)
	{
		res.json(application);
	});
});

// Create a new application for username
app.post('/api/users/:username/applications', function(req, res)
{
	req.body.schema = {};
	db.applications.insert(req.body, function(err, newApplication)
	{
		res.json(newApplication);
	});
});

// Update application
app.put('/api/users/:username/applications/:applicationid', function(req, res)
{
	db.applications.findAndModify( {
	   query: {_id:mongojs.ObjectId(req.params.applicationid)},
	   update: {
		   name: req.body.name,
		   notes: req.body.notes,
		   username: req.body.username,
		   rootEntity: req.body.rootEntity
		}
	}, function(err, application){
		res.json(application);
	});
});

// Delete application
app.delete('/api/users/:username/applications/:applicationid', function(req, res)
{
	db.applications.remove({_id:mongojs.ObjectId(req.params.applicationid)},
	function(err, application){
		res.json(application);
	});
});

// Register a user includes new username and password
app.post("/api/users", function(req, res)
{
	db.users.insert(req.body, function(err, newUser)
	{
		res.json(newUser);
	});
});

// Find user by username used for registering to see if username already exists
app.get("/api/users/:username", function(req, res)
{
	db.users.find({username: req.params.username}, function(err, user)
	{
		res.json(user);
	});
});

// Find user by username and password used for login to check username and password
app.get("/api/users/:username/:password", function(req, res)
{
	db.users.find({username: req.params.username, password: req.params.password}, function(err, user)
	{	    
	    res.json(user);
	});
});

// Find application list by username
app.get("/api/users/:username/applicationsList", function (req, res) {
    console.log(req.params.username);
    db.applications.find({ username: req.params.username}, function (err, applicationList) {
        console.log(applicationList);
        res.json(applicationList);
    });
});



/*
 *	Entities
 */
// Get all entities for a given application ID
app.get("/api/users/:username/applications/:applicationid/entities", function(req, res)
{
	db.entities.find({application_id: mongojs.ObjectId(req.params.applicationid)}, function(err, entities)
	{
		res.json(entities);
	});
});
// Get all entities for a given application name
app.get("/api/users/:username/:applicationName/entities", function(req, res)
{
	db.applications.findOne({name: req.params.applicationName}, function(err, application){
		db.entities.find({application_id: application._id}, function(err, entities)
		{
			res.json(entities);
		});
	});
});
// Create a new Entity
app.post("/api/users/:username/applications/:applicationid/entities", function(req, res)
{
	var entity = req.body;
	entity.application_id = mongojs.ObjectId(req.params.applicationid);
	entity.fields = {};
	db.entities.insert(entity, function(err, entity)
	{
		res.json(entity);
	});
});

// Get a particular entity by name
app.get("/api/:username/:application/collection/:collection", function(req, res){
	db.entities.findOne({name: req.params.collection}, function(err, entity){
		res.json(entity);
	});
});
// Get a particular entity by id
app.get("/api/users/:username/applications/:applicationid/entities/:entityid", function(req, res){
	db.entities.findOne({_id: mongojs.ObjectId(req.params.entityid)}, function(err, entity){
		res.json(entity);
	});
});
// Delete a particular entity
app.delete("/api/users/:username/applications/:applicationid/entities/:entityid", function(req, res){
	db.entities.remove({_id: mongojs.ObjectId(req.params.entityid)}, function(err, entity){
		db.entities.find(function(err, entities){
			res.json(entities);
		});
	});
});
// Update an entity
app.put("/api/users/:username/applications/:applicationId/entities/:id", function(req, res){
	console.log(req.params.id);
	console.log(req.body);
	delete req.body._id;
	req.body.application_id = mongojs.ObjectId(req.params.applicationId);
	db.entities.update({_id: mongojs.ObjectId(req.params.id)}, req.body, function(err, entity){
		db.entities.find(function(err, entities){
			res.json(entities);
		});
	});
});





/*
 *	Fields
 */
// Get all fields for a given entity ID
app.get("/api/:entityId/fields", function(req, res)
{
	db.fields.find({entity_id: mongojs.ObjectId(req.params.entityId)}, function(err, fields)
	{
		res.json(fields);
	});
});

app.get("/new/:username/:application/:collection/fields", function(req, res)
{
	console.log("get fields");
	console.log(req.params.collection);
	db.entities.findOne({name: req.params.collection}, function(err, collection) {
//		console.log(err);
//		console.log(collection);
		
		var id = collection._id;
		db.fields.find({entity_id: collection._id}, function(err, fields) {
			res.json(fields);
		});
	});
//	db.fields.find({entity_id: mongojs.ObjectId(req.params.entityId)}, function(err, fields)
//	{
//		res.json(fields);
//	});
});

app.get("/api/users/:username/applications/:applicationid/entities/:entityId/fields", function(req, res)
{
	db.fields.find({entity_id: mongojs.ObjectId(req.params.entityId)}, function(err, fields)
	{
		res.json(fields);
	});
});
// Create a new Field
app.post("/api/users/:username/applications/:applicationid/entities/:entityId/fields", function(req, res)
{
	var field = req.body;
	field.entity_id = mongojs.ObjectId(req.params.entityId);
	db.fields.insert(field, function(err, field)
	{
		res.json(field);
	});
});
// Get a particular field
app.get("/api/users/:username/applications/:applicationid/entities/:entityId/fields/:fieldId", function(req, res){
	db.fields.findOne({_id: mongojs.ObjectId(req.params.fieldId)}, function(err, field){
		res.json(field);
	});
});
// Delete a particular field
app.delete("/api/users/:username/applications/:applicationid/entities/:entityid/fields/:fieldId", function(req, res){
	db.fields.remove({_id: mongojs.ObjectId(req.params.fieldId)}, function(err, field){
		db.fields.find(function(err, fields){
			res.json(fields);
		});
	});
});
// Update a field
app.put("/api/users/:username/applications/:applicationId/entities/:entityId/fields/:fieldId", function(req, res){
	delete req.body._id;
	req.body.entity_id = mongojs.ObjectId(req.params.entityId);
	db.fields.update({_id: mongojs.ObjectId(req.params.fieldId)}, req.body, function(err, field){
		db.fields.find(function(err, fields){
			res.json(fields);
		});
	});
});




/*
 *	Child Fields
 */
// Get all child fields for a given field ID
app.get("/api/users/:username/applications/:applicationid/entities/:entityId/fields/:fieldId/childFields", function(req, res)
{
	db.childFields.find({field_id: mongojs.ObjectId(req.params.fieldId)}, function(err, fields)
	{
		res.json(fields);
	});
});
// Create a new Child Field
app.post("/api/users/:username/applications/:applicationid/entities/:entityId/fields/:fieldId/childFields", function(req, res)
{
	var childField = req.body;
	childField.field_id = mongojs.ObjectId(req.params.fieldId);
	db.childFields.insert(childField, function(err, childField)
	{
		res.json(childField);
	});
});
// Get a particular field
app.get("/api/users/:username/applications/:applicationid/entities/:entityId/fields/:fieldId/childFields/:childFieldId", function(req, res){
	db.childFields.findOne({_id: mongojs.ObjectId(req.params.childFieldId)}, function(err, childField){
		res.json(childField);
	});
});
// Delete a particular field
app.delete("/api/users/:username/applications/:applicationid/entities/:entityid/fields/:fieldId/childFields/:childFieldId", function(req, res){
	db.childFields.remove({_id: mongojs.ObjectId(req.params.childFieldId)}, function(err, childField){
		db.childFields.find(function(err, childFields){
			res.json(childFields);
		});
	});
});
// Update a field
app.put("/api/users/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/childFields/:childFieldId", function(req, res){
	delete req.body._id;
	req.body.field_id = mongojs.ObjectId(req.params.fieldId);
	db.childFields.update({_id: mongojs.ObjectId(req.params.childFieldId)}, req.body, function(err, childField){
		db.childFields.find(function(err, childFields){
			res.json(childFields);
		});
	});
});








/*
 *	Page
 */
// Get all page for a given application ID
app.get("/api/users/:username/applications/:applicationid/pages", function(req, res)
{
	db.pages.find({application_id: mongojs.ObjectId(req.params.applicationid)}, function(err, pagees)
	{
		res.json(pagees);
	});
});
// Create a new Page
app.post("/api/users/:username/applications/:applicationid/pages", function(req, res)
{
	var newPage = req.body;
	newPage.application_id = mongojs.ObjectId(req.params.applicationid);
	db.pages.insert(newPage, function(err, newPage)
	{
		res.json(newPage);
	});
});
// Get a particular page
app.get("/api/users/:username/applications/:applicationid/pages/:pageid", function(req, res){
	db.pages.findOne({_id: mongojs.ObjectId(req.params.pageid)}, function(err, pagees){
		res.json(pagees);
	});
});
// Delete a particular page
app.delete("/api/users/:username/applications/:applicationid/pages/:pageid", function(req, res){
	db.pages.remove({_id: mongojs.ObjectId(req.params.pageid)}, function(err, newPage){
		db.pages.find(function(err, pagees){
			res.json(pagees);
		});
	});
});
// Update a page
app.put("/api/users/:username/applications/:applicationId/pages/:id", function(req, res){
	console.log(req.params.id);
	console.log(req.body);
	delete req.body._id;
	req.body.application_id = mongojs.ObjectId(req.params.applicationId);
	db.pages.update({_id: mongojs.ObjectId(req.params.id)}, req.body, function(err, newPage){
		console.log("err:");
		console.log(err);
		console.log("newPage:");
		console.log(newPage);
		db.pages.find(function(err, pagees){
			res.json(pagees);
		});
	});
});





/*
 *	Widgets
 */
// Get all widgets for a given page ID
app.get("/api/users/:username/applications/:applicationid/pages/:pageid/widgets", function(req, res)
{
	console.log("Get All Widgets for a given page ID");
	console.log(req.params.pageid);
	db.widgets.find({pageId: req.params.pageid}, function(err, widgets)
	{
		res.json(widgets);
	});
});
// Create a new Widget
app.post("/api/users/:username/applications/:applicationid/pages/:pageid/widgets", function(req, res)
{
	var newWidget = req.body;
//	newWidget.page_id = mongojs.ObjectId(req.params.pageid);
	db.widgets.insert(newWidget, function(err, newWidget)
	{
		res.json(newWidget);
	});
});
// Get a particular Widget
app.get("/api/users/:username/applications/:applicationid/pages/:pageid/widgets/:widgetid", function(req, res){
	db.widgets.findOne({_id: mongojs.ObjectId(req.params.widgetid)}, function(err, widgets){
		res.json(widgets);
	});
});
// Delete a particular widget
app.delete("/api/users/:username/applications/:applicationid/pages/:pageid/widgets/:widgetid", function(req, res){
	db.widgets.remove({_id: mongojs.ObjectId(req.params.widgetid)}, function(err, newWidget){
		db.widgets.find(function(err, widgets){
			res.json(widgets);
		});
	});
});
// Update a Widget
app.put("/api/users/:username/applications/:applicationId/pages/:pageId/widgets/:widgetId", function(req, res){
	delete req.body._id;
	db.widgets.update({_id: mongojs.ObjectId(req.params.widgetId)}, req.body, function(err, newWidget){
		db.widgets.find(function(err, widgets){
			res.json(widgets);
		});
	});
});







/*
 *	Field Scripts
 */
// Get all Field scripts for a given field ID
app.get("/api/:fieldId/scripts", function(req, res)
{
	db.scripts.find({fieldId: req.params.fieldId}, function(err, scripts)
	{
		res.json(scripts);
	});
});
// Get Field script for a given script ID
app.get("/api/:fieldId/scripts/:scriptId", function(req, res)
{
	db.scripts.findOne({_id: mongojs.ObjectId(req.params.scriptId)}, function(err, script)
	{
		res.json(script);
	});
});
// Create a new Field Script
app.post("/api/:fieldId/scripts", function(req, res)
{
	var script = req.body;
	script.fieldId = req.params.fieldId;
	db.scripts.insert(script, function(err, script)
	{
		res.json(script);
	});
});
// Update a Field Script
app.put("/api/:fieldId/scripts/:id", function(req, res)
{
	delete req.body._id;
	db.scripts.update({_id: mongojs.ObjectId(req.params.id)}, req.body, function(err, updated)
	{
		res.json(updated);
	});
});






/*
 *	Statements
 */
// Get all Statements for a given Script ID
app.get("/api/:parentId/statements", function(req, res)
{
	db.statements.find({parentId: req.params.parentId}, function(err, results)
	{
		res.json(results);
	});
});
// Get Statement for a given scriptStatement ID
app.get("/api/:parentId/statements/:id", function(req, res)
{
	db.statements.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, result)
	{
		res.json(result);
	});
});
// Create a new Statement
app.post("/api/:parentId/statements", function(req, res)
{
	req.body.parentId = req.params.parentId;
	db.statements.insert(req.body, function(err, result)
	{
		res.json(result);
	});
});
// Update a Statement
app.put("/api/:parentId/statements/:id", function(req, res)
{
	delete req.body._id;
	db.statements.update({_id: mongojs.ObjectId(req.params.id)}, req.body, function(err, updated)
	{
		res.json(updated);
	});
});




app.listen(port, ipaddress);
