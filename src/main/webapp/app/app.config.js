// Declare app level module which depends on controllers, services, directives and filters module.
var module = angular.module('collegeDays',['home','studentDashboard', 'ui.router','blockUI',
                                           'ui.bootstrap','ngResource','awesome-rating']);

module.config(function(blockUIConfig,$stateProvider, $urlRouterProvider){
	blockUIConfig.message = 'Please wait.. !';
	blockUIConfig.autoBlock = false;
	$urlRouterProvider.otherwise('/home');
	
	//$stateProvider.state('home',{url:'/home', templateUrl:'app/home/home.tpl.html', controller:'HomeCtrl'});
});

/*module.config(function($routeProvider) {
	$routeProvider.otherwise('#/home');
}); */





