angular.module('collegeDays')

    .controller('AppCtrl', function AppCtrl($scope, blockUI,ngDialog, TokenStorage,
    		$rootScope, $location) {
        "use strict";

        $scope.options = {};
        $scope.options.selectedOption = 'home';
        $scope.shelf = {};
        $scope.shelf.shelfLimit = 4;
        $scope.test="Test Inputb Box";
        $scope.$on('$stateChangeSuccess', function (event, toState) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle;
            }
        });
        
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
    	
    	//method : redirect to library page
        $scope.redirectToPage = function(url, id){
        	//set the selected li
        	$scope.options.selectedOption = id;
        	$location.path(url);
        };
    });