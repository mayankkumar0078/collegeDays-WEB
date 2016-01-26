var homeModule1 = angular.module('home');
homeModule1.controller('loginDialogCtrl', function ($scope, $rootScope, $location, loginService) {

	//make the login home page visible when the login page is landed
	$scope.loginHomePage = true;
	
	$scope.showSignInForm = function(){
		$scope.signInForm = true;
		$scope.signUpForm = false;
		$scope.forgotPasswordForm = false;
		$scope.loginHomePage = false;
	};
	
	$scope.showSignUpForm = function(){
		$scope.signInForm = false;
		$scope.signUpForm = true;
		$scope.forgotPasswordForm = false;
		$scope.loginHomePage = false;
	};
	
	$scope.showForgotPasswordForm = function(){
		$scope.signInForm = false;
		$scope.signUpForm = false;
		$scope.forgotPasswordForm = true;
		$scope.loginHomePage = false;
	};

	$scope.verifyLogin = function(){
		
		var loginCredential = {
									email : $scope.email,
									password : $scope.password
							   };
		//call the login service to verify the login credentials
		var resource = loginService.verifyLogin();
		//make the ajax call to verify the login
	/*	resource.call(loginCredential).$promise.then(function(response) {
			
		},
		function(error) {
			alert(error);
			blockUI.stop();
		}
		);*/
		
		//check if the user is authenticated
		if(true){
			$location.path("/studentDashboard/library");
			$scope.closeThisDialog('Some value');
			//set the rootScope variable 
			$rootScope.userLoggedIn = true;
			//set the user coming from the response
			$rootScope.user = {};
		}
		
	};
	
	/*registers a new user*/
	$scope.registerUser = function(){
		
	};
	
	/*retrieves the password for the email*/
	$scope.recoverPassword = function(){
		
	};
	
});