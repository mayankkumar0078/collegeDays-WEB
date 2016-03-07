var homeModule1 = angular.module('home');
homeModule1.factory('TokenStorage', function() {
	var storageKey = 'auth_token';
	return {		
		store : function(token) {
			return localStorage.setItem(storageKey, token);
		},
		retrieve : function() {
			return localStorage.getItem(storageKey);
		},
		clear : function() {
			return localStorage.removeItem(storageKey);
		}
	};
}).factory('TokenAuthInterceptor', function($q, TokenStorage) {
	return {
		request: function(config) {
			var authToken = TokenStorage.retrieve();
			if (authToken) {
				config.headers['X-AUTH-TOKEN'] = authToken;
			}
			return config;
		},
		responseError: function(error) {
			if (error.status === 401 || error.status === 403) {
				TokenStorage.clear();
			}
			return $q.reject(error);
		}
	};
}).config(function($httpProvider) {
	$httpProvider.interceptors.push('TokenAuthInterceptor');
});


homeModule1.controller('loginDialogCtrl', function($scope, $rootScope,
		$location, loginService, $http,TokenStorage) {

	initialiseModels();
	//make the login home page visible when the login page is landed
	$scope.loginHomePage = true;

	$scope.signInEmail = "";
	$scope.signInPpassword = "";
	//declare model variables for sign up
	$scope.signUpName = "";
	$scope.signUpEmail = "";
	$scope.signUpPassword = "";
	$scope.signUpCollege = "";
	//declare the model for forgot password
	$scope.forgotPasswordEmail = "";

	$scope.showSignInForm = function() {
		$scope.signInForm = true;
		$scope.signUpForm = false;
		$scope.forgotPasswordForm = false;
		$scope.loginHomePage = false;
		$scope.isLoginFailed=false;
	};

	$scope.showSignUpForm = function() {
		$scope.signInForm = false;
		$scope.signUpForm = true;
		$scope.forgotPasswordForm = false;
		$scope.loginHomePage = false;
	};

	$scope.showForgotPasswordForm = function() {
		$scope.signInForm = false;
		$scope.signUpForm = false;
		$scope.forgotPasswordForm = true;
		$scope.loginHomePage = false;
	};

	function initialiseModels() {
		//declare model variables for sign in
		$scope.signInEmail = "";
		$scope.signInPassword = "";
		//declare model variables for sign up
		$scope.signUpName = "";
		$scope.signUpEmail = "";
		$scope.signUpPassword = "";
		$scope.signUpCollege = "";
		//declare the model for forgot password
		$scope.forgotPasswordEmail = "";
	}
	$scope.verifyLogin = function() {

		var loginCredential = {
			email : $scope.email,
			password : $scope.password
		};
		//call the login service to verify the login credentials
		var resource = loginService.verifyLogin();

		//check if the user is authenticated
		if (true) {
			$location.path("/studentDashboard/library");
			$scope.closeThisDialog('Some value');
			//set the rootScope variable 
			$rootScope.userLoggedIn = true;
			//set the user coming from the response
			$rootScope.user = {};
		}

	};

	/*registers a new user*/
	$scope.registerUser = function() {
		var postObject = new Object();
		postObject.email = this.signUpEmail;
		postObject.firstName = this.signUpName;
		postObject.password = this.signUpPassword;

		$http.post("http://localhost:9090/userModule/Users", postObject)
				.success(function(data, status, headers, config) {	

				}).error(function(data, status, header, config) {
					alert("Error");
					console.log("Error");
				});

	};

	$scope.login = function() {
		var credentials = {
			email : this.signInEmail,
			password : this.signInPassword
		};
		$http.post('http://localhost:9090/userModule/Users/authenticate',
				credentials).success(function(result, status, headers) {
					console.log(result.token);
			$scope.authenticated = true;
			TokenStorage.store(result.token);
			if($scope.authenticated){
				$location.path("/studentDashboard/library");
				$scope.closeThisDialog('Some value');
				//set the rootScope variable 
				$rootScope.userLoggedIn = true;
				//set the user coming from the response
				$rootScope.user = result.firstName;
			}
			
		}).error(function(result, status, headers) {
			$scope.isLoginFailed=true;
			$scope.errorMessage=result.message;
			console.log($scope.errorMessage);
		});
	};
	/*retrieves the password for the email*/
	$scope.recoverPassword = function() {

	};

});