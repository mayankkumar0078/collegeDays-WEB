var libraryModule =  angular.module('library');

libraryModule.controller('advanceBookSearchModalCTRL', function($scope, libraryService, blockUI,  $modalInstance){

	
	/*var advBookSearchCriteria = 
	{ 
			subject:$scope.subject,
			author:$scope.author,
			title:$scope.title,
			publishYearStartLimit:$scope.publishYearStartLimit,
			publishYearEndLimit:$scope.publishYearEndLimit 
	};*/
		
	$scope.advanceBookSearch = function(){
		var subject = $scope.subject;
		var author = $scope.author;
		var publishYearStartLimit = $scope.publishYearStartLimit;
		var publishYearEndLimit = $scope.publishYearEndLimit;		
		var publisher = $scope.publisher;
		var title = $scope.title;
		var place = $scope.place;
		var isbn = $scope.isbn;
		var advSearchCriteria = 
		{
				subject:subject,
				author:author,
				publishYearStartLimit:publishYearStartLimit,
				publishYearEndLimit:publishYearEndLimit,
				publisher:publisher,
				title:title,
				place:place,
				isbn:isbn
		};
		
$scope.$parent.searchBooks('advanceSearch', advSearchCriteria, false);

$modalInstance.dismiss('cancel');
	};
	
});