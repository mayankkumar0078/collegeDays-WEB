var homeModule = angular.module('home');

homeModule.controller('HomeCtrl', function HomeCtrl($scope, $parse, $modal, loginService, 
		$location, ngDialog) {

	$scope.openLoginDialog = function(){
		//open the login modal
		//$scope.animationsEnabled = true;

		ngDialog.open({template: 'loginDialogContent.html',
					   controller: 'loginDialogCtrl'});
	};

	/*$scope.items = [
	                'The first choice!',
	                'And another choice for you.',
	                'but wait! A third!'
	                ];*/

	$scope.status = {
			isopen: false
	};

	$scope.toggled = function(open) {
		// $log.log('Dropdown is now: ', open);
	};

	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};


	/*crousel for the images data setting*/
	$scope.myInterval = 500000;
	$scope.noWrapSlides = false;
	var slides = $scope.slides = [];
	$scope.addSlide = function() {
		//var newWidth = 1300 + slides.length + 1;
		slides.push({
			image: 'assets/img/Social-Media-College-Student.jpg',
			text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
			['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
		});
	};
	for (var i=0; i<4; i++) {
		$scope.addSlide();
	}
});
