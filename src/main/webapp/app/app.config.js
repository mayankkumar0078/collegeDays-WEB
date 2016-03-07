var module = angular.module('collegeDays', [ 'home', 'studentDashboard',
		'ui.router', 'blockUI', 'ui.bootstrap', 'ngResource', 'awesome-rating',
		'ngDialog', 'infinite-scroll', 'nsPopover' ]);

module.config(function(blockUIConfig, $stateProvider, $urlRouterProvider) {
	blockUIConfig.message = 'Please wait.. !';
	blockUIConfig.autoBlock = false;
	$urlRouterProvider.otherwise('/home');
});

module.controller('appCTRL', function appCTRL($scope, $location, $rootScope,
		ngDialog, TokenStorage) {

	$rootScope.userLoggedIn = false;
	$rootScope.user = null;
	$scope.redirectToHomePage = function() {
		$location.path("/home");
	};

	$scope.openLoginDialog = function() {
		ngDialog.open({
			template : 'loginDialogContent.html',
			controller : 'loginDialogCtrl as loginCtrl',
			scope : $scope
		});
	};
	$scope.logOut = function() {
		$rootScope.userLoggedIn = false;
		$rootScope.user = null;
		TokenStorage.clear();
		$scope.redirectToHomePage();
	};

});
