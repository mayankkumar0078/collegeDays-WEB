var homeModule = angular.module('home');

homeModule.controller('HomeCtrl', function HomeCtrl($scope, $parse, $modal, loginService, $location) {

	$scope.openLoginModal = function(){
		//open the login modal
		$scope.animationsEnabled = true;

		//$scope.open = function (size) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'loginModalContent.html',
			controller: 'loginModalCtrl',
			size: 'lg',
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			// $log.info('Modal dismissed at: ' + new Date());
		});
		// };


		/* $scope.verifyLogin = function(){

    	            var username = $scope.username;
    	            var password = $scope.password;

    	            var result = loginService.verify(username, password);
    	            if (result) {
    	                $location.path('/userDashboard');
    	            }
    	        }*/
	};

	$scope.items = [
	                'The first choice!',
	                'And another choice for you.',
	                'but wait! A third!'
	                ];

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
