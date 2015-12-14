var libraryModule =  angular.module('library');

libraryModule.controller('bookDetailsModalCTRL', function($scope, libraryService, blockUI,  $modal){
	
	$scope.rightTemplate='app/library/books/BookReviewPartial.tpl.html';
	
	$scope.showAddToShelfPage = function(){
		$scope.rightTemplate='app/library/books/addBookToShelfPartial.tpl.html';
	};
	
	$scope.showBookReviewsPagePage = function(){
		$scope.rightTemplate='app/library/books/BookReviewPartial.tpl.html';
	};
	/*crousel for the images data setting*/
	$scope.myInterval = 5000;
	$scope.noWrapSlides = false;
	var slides = $scope.slides = [];
	
	$scope.addSlide = function(record) {
		//var newWidth = 1300 + slides.length + 1;
		//check for the image from different options
		slides.push({
			image: 'http://covers.openlibrary.org/b/id/'+record.cover_i+'-S.jpg',
			record:record
		});
		
	};
	
	$scope.showEditionBookInfo = function(editionRecord){
		$scope.$parent.record = editionRecord;
	};
	
	var clickedBookRecord = $scope.$parent.record;
	$scope.addSlide(clickedBookRecord);
	//...........service call to get the book edition info
	//populate edition books data for the post request
	var edition_keys=[];
	for(var i=0; i< clickedBookRecord.edition_key.length; i++){
		edition_keys[i] = clickedBookRecord.edition_key[i];
	}
	var olids = {olids: clickedBookRecord.edition_key};
	var BookInfoServiceResource = libraryService.getBookInfo();
	BookInfoServiceResource.call(olids).$promise.then(function(response){
		console.log(response);
		
		var listOfEditionBooks = response.listOfBooks;
		for (var i=0; i<listOfEditionBooks.length ; i++) {
			console.log('count is'+listOfEditionBooks.length +'.........'+listOfEditionBooks[i].preview);
			if(listOfEditionBooks[i].preview=='full'){
				
			$scope.addSlide(listOfEditionBooks[i]);
			}
		}
	},
	function(error){
		
	});
	console.log("The clicked book is : "+clickedBookRecord.title);
	$scope.getSecondIndex = function(index)
	  {
	    if(index-slides.length>=0)
	      return index-slides.length;
	    else{
	    	console.log("index "+index);
	      return index;
	    }
	  };

});