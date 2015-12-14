var homeModule = angular.module('home');
homeModule.controller('loginModalCtrl', function ($scope, $modalInstance, items, loginService,$location) {

	$scope.loginModalBody = "modal-body";
	$scope.showSignInButton = true;
	$scope.showSignInTitle = true;
	$scope.showSignUpButton = true;
	$scope.showBackToSignIn = false;
	$scope.emailPwdNotMatchModel=false;

	$scope.login = function(){

		$scope.showCnfPwdInputBox = false;
		$scope.showCollegeInputBox = false;
		$scope.showSemInputBox = false;
		$scope.showSignUpTitle = false;
		$scope.showSignInTitle = true;
		$scope.showSignInButton = true;

		$scope.showBackToSignIn = false;

		//verify the user and password
		var loginData={};
		loginData.email=$scope.emailIdModel;
		loginData.password=$scope.passwordModel;
		
		var verifyLogin = loginService.verifyLogin();
		verifyLogin.call(loginData).$promise.then(function(data){
			if(data.authenticated){
				$location.path('/studentDashboard');
				$modalInstance.dismiss('cancel');
			}else{
				$scope.emailPwdNotMatchModel=true;
			}
				
				
			});
		/*var matched = loginService.verifyLogin($scope.emailIdModel, $scope.passwordModel);
		if(matched) {
			
			$location.path('/studentDashboard');
		}*/
	};

	$scope.signUp = function(){
		$scope.showCnfPwdInputBox = true;
		$scope.showCollegeInputBox = true;
		$scope.showSemInputBox = true;
		$scope.showSignInButton = false;
		$scope.showSignInTitle = false;
		$scope.showSignUpTitle = true;
		$scope.showBackToSignIn = true;
		$scope.emailPwdNotMatchModel=false;
	};

	$scope.backToSignIn = function(){
		$scope.login();
	};
	$scope.items = items;
	$scope.selected = {
			item: $scope.items[0]
	};

	/*  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };*/

	$scope.closeModal = function () {
		$modalInstance.dismiss('cancel');
	};
});