// Declare app level module which depends on controllers, services, directives and filters module.
var module = angular.module('collegeDays',['home','studentDashboard', 'ui.router','blockUI',
                                           'ui.bootstrap','ngResource','awesome-rating','ngDialog','infinite-scroll'
                                           ,'nsPopover']);


module.config(function(blockUIConfig,$stateProvider, $urlRouterProvider){
	blockUIConfig.message = 'Please wait.. !';
	blockUIConfig.autoBlock = false;
	$urlRouterProvider.otherwise('/home');
	//$stateProvider.state('home',{url:'/home', templateUrl:'app/home/home.tpl.html', controller:'HomeCtrl'});
});


module.controller('appCTRL', function appCTRL($scope, $location, $rootScope, ngDialog) {
	
	$rootScope.userLoggedIn = false;
	$rootScope.user = null;
	$scope.redirectToHomePage = function(){
		$location.path("/home");
	};
	
	$scope.openLoginDialog = function(){
		//open the login modal
		ngDialog.open({template: 'loginDialogContent.html',
					   controller: 'loginDialogCtrl',
					   scope: $scope});
	};

	//logout the user
	//logout the user
	$scope.logOut = function(){
		$rootScope.userLoggedIn = false;
		$rootScope.user = null;
		//redirect the user to home page
		$scope.redirectToHomePage();
	};
	
});



