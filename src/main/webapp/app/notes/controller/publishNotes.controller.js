angular.module('notes').controller('publishNotesCtrl',	function publishNotesCtrl($scope, libraryService, blockUI,
						$mdDialog, $mdMedia, $modal, $rootScope, $timeout, $q, $log) {
	
	  $scope.hide = function() {
		    $mdDialog.hide();
		  };
		  $scope.cancel = function() {
		    $mdDialog.cancel();
		  };
		  $scope.answer = function(answer) {
		    $mdDialog.hide(answer);
		  };
});