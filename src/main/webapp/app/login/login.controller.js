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
		$location, loginService, $http,TokenStorage, ngDialog) {

	//make the login home page visible when the login page is landed
	$scope.loginHomePage = true;

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

	
	var self=this; 
	/*registers a new user*/
	self.registerUser = function() {
		$http.post("http://localhost:9090/userModule/Users", self.user)
				.success(function(data, status, headers, config) {	
						
				}).error(function(data, status, header, config) {
					alert("Error");
					console.log("Error");
				});

	};

	self.login = function() {

		$http.post('http://localhost:9090/userModule/Users/authenticate',
				self.loginCredentials).success(
				function(result, status, headers) {
					console.log(result.token);
					self.authenticated = true;
					TokenStorage.store(result.token);
					if (self.authenticated) {
						$location.path("/studentDashboard/library");
						self.closeThisDialog('Some value');
						// set the rootScope variable
						$rootScope.userLoggedIn = true;
						// set the user coming from the response
						$rootScope.loggedInUser = {}
						
						$rootScope.loggedInUser.userEmail = result.userEmail;
						$rootScope.loggedInUser.userName = result.firstName;
					}

				}).error(function(result, status, headers) {
			self.isLoginFailed = true;
			self.errorMessage = result.message;
			console.log(self.errorMessage);
		});
	};
	self.closeThisDialog = function(){
		ngDialog.closeAll();
	};
	/* retrieves the password for the email */
	$scope.recoverPassword = function() {

	};

});