/*var libraryModule = angular.module('library');

libraryModule.controller('booksCTRL', function HomeCtrl($scope, $parse, $modal, $location) { 
	$scope.openBookDetailsModal = function(){
		$scope.animationsEnabled = true;

		//$scope.open = function (size) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			template: 'loginModalContent.html',
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
	};
});*/