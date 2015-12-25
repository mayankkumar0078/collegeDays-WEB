var homeModule1 = angular.module('home');
homeModule1.controller('loginDialogCtrl', function ($scope,$location) {

	//make the login home page visible when the login page is landed
	$scope.loginHomePage = true;
	
/*	$scope.showSignInForm = function(){

		$scope.signInForm = true;
		$scope.signUpForm = false;
		$scope.forgotPasswordForm = false;
		$scope.loginHomePage = false;

		//verify the user and password
		var loginData={};
		loginData.email=$scope.emailIdModel;
		loginData.password=$scope.passwordModel;
		
		var verifyLogin = loginService.verifyLogin();
		verifyLogin.call(loginData).$promise.then(function(data){
			if(data.authenticated){
				$location.path('/studentDashboard');
			}else{
				//$scope.userNotAuthenticatedErrorMsg=true;
			}
				
				
			});
	};*/

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

});