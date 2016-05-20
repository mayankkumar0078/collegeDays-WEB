var homeModule = angular.module('home');

homeModule.controller('HomeCtrl', function HomeCtrl($scope, $parse, $modal, loginService, 
		$location, ngDialog) {

	$scope.status = {
			isopen: false
	};

	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};

      /*redirect to the corresponding help pages*/
	$scope.redirectToReadBookHelpPage = function(){
		$location.path('/bookReadHelp');
	};
	/*crousel for the images data setting*/
	$scope.myInterval = 500000;
	$scope.noWrapSlides = false;
	var slides = $scope.slides = [];
	$scope.addSlide = function() {
		//var newWidth = 1300 + slides.length + 1;
		slides.push({
			image: 'assets/book_on_beach.jpg',
			caption:'No worry for college life',
			text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
			['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
		});
	};
	for (var i=0; i<4; i++) {
		$scope.addSlide();
	}
	
	//redirect to library page
	$scope.redirectToLibrary = function(){
		$location.path("/library");
	};
});
