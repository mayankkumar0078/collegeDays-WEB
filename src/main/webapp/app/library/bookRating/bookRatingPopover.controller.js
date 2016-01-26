var libraryModule =  angular.module('library');

libraryModule.controller('bookRatingPopoverCTRL', function($scope, libraryService){
	
	//by default show over all rating section
	$scope.showOverAllRatingSec = true;
	$scope.showSubmitReviewSec = false;
	/*options for the rating system*/
	$scope.optionsEditable = {
			values 			: [ 1, 2, 3, 4, 5, 6 ],
			allowFractional         : false,
			readonly                : false,
			applyHoverCss	: true
			
	};
	
	$scope.ratingOfUser = 3;
	
	//function for the BACK button
	$scope.backButtonClicked = function(){
		$scope.showOverAllRatingSec = true;
		$scope.showSubmitReviewSec = false;
	};
	
	//function for the submit your review
	$scope.submitReviewButtonClicked = function(){
		$scope.showOverAllRatingSec = false;
		$scope.showSubmitReviewSec = true;
	};
});