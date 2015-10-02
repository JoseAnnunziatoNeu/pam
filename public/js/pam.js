/*
	© 2014 Jose Annunziato
	All Rights Reserved
*/
var pam = angular.module("pam", ["ngRoute","ui.sortable"]);

pam.config(["$routeProvider", function($routeProvider, $http)
{
    $routeProvider
    //AppStore
    .when("/:username/appStore",
	{
	    templateUrl: "templates/appStore/list.html",
	    controller: "AppStoreController"
	})
	// RUN
	.when("/collections/:username/:application",
	{
		templateUrl: "templates/run/collections.html",
		controller: "RunCollectionsController"
	})
	.when("/view/:username/:application//null/null/view",
	{
		templateUrl: "templates/run/collections.html",
		controller: "RunCollectionsController"
	})
	.when("/list/:username/:application/:state*/:collection",
	{
		templateUrl: "templates/run/list.html",
		controller: "RunListController"
	})
	.when("/new/:username/:application/:state*/:collection",
	{
		templateUrl: "templates/run/new.html",
		controller: "RunNewController"
	})
	.when("/edit/:username/:application/:state*/:collection/:id/edit",
	{
		templateUrl: "templates/run/edit.html",
		controller: "RunEditController"
	})
	.when("/view/:username/:application/:state*/:collection/:id/view",
	{
		templateUrl: "templates/run/view.html",
		controller: "RunViewController"
	})
	// LOGIN & REGISTRATION
	.when("/",
	{
		templateUrl: "templates/users/login.html",
		controller: "LoginController"
	})
	.when("/login",
	{
		templateUrl: "templates/users/login.html",
		controller: "LoginController"
	})
	.when("/terms",
	{
		templateUrl: "templates/users/terms.html",
		controller: "TermsController"
	})
	.when("/register/true",
	{
		templateUrl: "templates/users/register.html",
		controller: "RegisterController"
	})
	/*
	*	Applications
	*/
	.when("/:username/applications/new",
	{
		templateUrl: "templates/applications/new.html",
		controller: "NewApplicationController"
	})
	.when("/:username/applications/list",
	{
		templateUrl: "templates/applications/list.html",
		controller: "ApplicationListController"
	})
	.when("/:username/applications/:applicationid/edit",
	{
		templateUrl: "templates/applications/edit.html",
		controller: "EditApplicationController"
	})
    .when("/:username/run/applications/list",
	{
	    templateUrl: "templates/users/list.html",
	    controller: "UserRunApplicationController"
	})
	// Entities
	.when("/:username/applications/:applicationId/entities/list",
	{
		templateUrl: "templates/entities/list.html",
		controller: "EntityListController"
	})
	.when("/:username/applications/:applicationId/entities/new",
	{
		templateUrl: "templates/entities/new.html",
		controller: "NewEntityController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/edit",
	{
		templateUrl: "templates/entities/edit.html",
		controller: "EditEntityController"
	})
	// Fields
	.when("/:username/applications/:applicationId/entities/:entityId/fields/list",
	{
		templateUrl: "templates/fields/list.html",
		controller: "FieldListController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/fields/new",
	{
		templateUrl: "templates/fields/new.html",
		controller: "NewFieldController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/edit",
	{
		templateUrl: "templates/fields/edit.html",
		controller: "EditFieldController"
	})
	// Field Scripts
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/fieldScripts/list",
	{
		templateUrl: "templates/fieldScripts/list.html",
		controller: "ScriptListController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/fieldScripts/new",
	{
		templateUrl: "templates/fieldScripts/new.html",
		controller: "NewScriptController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/fieldScripts/:scriptId/edit",
	{
		templateUrl: "templates/fieldScripts/edit.html",
		controller: "EditScriptController"
	})
	// Statements
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/fieldScripts/:parentId/statements/list",
	{
		templateUrl: "templates/statements/list.html",
		controller: "StatementListController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/fieldScripts/:parentId/statements/new",
	{
		templateUrl: "templates/statements/new.html",
		controller: "NewStatementController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/fieldScripts/:parentId/statements/:instanceId/edit",
	{
		templateUrl: "templates/statements/edit.html",
		controller: "EditStatementController"
	})
	// Child Fields
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/childFields/list",
	{
		templateUrl: "templates/childFields/list.html",
		controller: "ChildFieldListController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/childFields/new",
	{
		templateUrl: "templates/childFields/new.html",
		controller: "NewChildFieldController"
	})
	.when("/:username/applications/:applicationId/entities/:entityId/fields/:fieldId/childFields/:childFieldId/edit",
	{
		templateUrl: "templates/childFields/edit.html",
		controller: "EditChildFieldController"
	})
	/*
	*	Pages
	*/
	.when("/:username/applications/:applicationId/pages/list",
	{
		templateUrl: "templates/pages/list.html",
		controller: "PageListController"
	})
	.when("/:username/applications/:applicationId/pages/new",
	{
		templateUrl: "templates/pages/new.html",
		controller: "NewPageController"
	})
	.when("/:username/applications/:applicationId/pages/:pageId/edit",
	{
		templateUrl: "templates/pages/edit.html",
		controller: "EditPageController"
	})
	/*
	*	Widgets
	*/
	.when("/:username/applications/:applicationId/pages/:pageId/widgets/list",
	{
		templateUrl: "templates/widgets/list.html",
		controller: "WidgetListController"
	})
	.when("/:username/applications/:applicationId/pages/:pageId/widgets/new",
	{
		templateUrl: "templates/widgets/chooser.html",
		controller: "NewWidgetController"
	})
	.when("/:username/applications/:applicationId/pages/:pageId/widgets/:widgetId/edit",
	{
		templateUrl: "templates/widgets/edit.html",
		controller: "EditWidgetController"
	})
	.when("/:username/applications/:applicationId/pages/:pageId/widgets/:widgetId/YouTube Video/edit",
	{
		templateUrl: "templates/widgets/youtube/list.html",
		controller: "EditYouTubeWidgetController"
	})
	.when("/:username/applications/:applicationId/pages/:pageId/widgets/:widgetId/TEXT/edit",
	{
		templateUrl: "templates/widgets/editTextWidget.html",
		controller: "EditTextWidgetController"
	})
	/*
	 *	Form Widget
	 */
	.when("/:username/applications/:applicationId/pages/:pageId/widgets/:widgetId/Form/edit",
	{
		templateUrl: "templates/widgets/form/edit.html",
		controller: "FormEditController"
	})
	.when("/:username/applications/:applicationId/pages/:pageId/widgets/:widgetId/Form/edit",
	{
		templateUrl: "templates/widgets/form/FormElements/list.html",
		controller: "FormElementsListController"
	})
	/*
	 *
	 */
	//.otherwise({
	//	templateUrl: "templates/users/login.html",
	//	controller: "LoginController"
	//})
	//;	
}]);
