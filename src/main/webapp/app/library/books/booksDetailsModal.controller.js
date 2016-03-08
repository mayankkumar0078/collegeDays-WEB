var libraryModule =  angular.module('library');

libraryModule.controller('bookDetailsModalCTRL', function($scope, $rootScope, libraryService, blockUI,  $modal){

	$scope.rightTemplate='app/library/books/bookReviewPartialPage.tpl.html';
	$scope.leftTemplate = 'app/library/books/bookInfoPartialModal.tpl.html';
	$scope.bookRatingEditable = {
			values 			: [ 1, 2, 3, 4, 5],
			allowFractional         : false,
			readonly                : false,
			applyHoverCss	: true

	};

	$scope.bookRatingNonEditable = {
			values 			: [ 1, 2, 3, 4, 5],
			allowFractional         : false,
			readonly                : true,
			applyHoverCss	: false

	};



	var savedBookReviewDocument = null;
	//Watch on the variable 'userBookRating' and update the rating of the book
	$scope.$watch('userBookRating', function (newValue, oldValue) {
		if(newValue != undefined){
			$scope.bookRatingDocument.userRating.rating = newValue;
		}
		if(oldValue!= undefined && newValue != undefined && oldValue != newValue){
			if($scope.bookRatingDocument != undefined){
				var updatedBookRatingDoc = $scope.bookRatingDocument;
				updatedBookRatingDoc.userRating.rating = newValue;
				//call the service to update the rating of the book
				var bookRatingServiceCall = libraryService.updateBookRating();
				bookRatingServiceCall.call(updatedBookRatingDoc).$promise.then(function(response){
					if(response != null ){
						var bookReviewServiceCall = libraryService.getBookReviews($rootScope.activeBookRecord.ia[0]);
						bookReviewServiceCall.call().$promise.then(function(response){
							//set the different scope variables 
							setBookReviewScopeObjects(response);

						},
						function(error){

						});
					}
				},
				function(error){

				});
			}
		}  
	});

	$scope.showAddToShelfPage = function(){
		$scope.rightTemplate='app/library/books/addBookToShelfPartial.tpl.html';
	};

	//this method is for updating the comment for a book.
	$scope.updateComment = function(bookReviewDoc){
		//update the comment in db for the user
		var bookReviewServiceCall = libraryService.updateBookReview();
		bookReviewServiceCall.call(bookReviewDoc).$promise.then(function(response){
			if(reposne != null ){
			}
		},
		function(error){

		});
	};

	//show review page
	$scope.showBookReviewsPagePage = function(){
		$scope.rightTemplate='app/library/books/bookReviewPartialPage.tpl.html';
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
	//sevice call to get the book info
	var BookInfoServiceResource = libraryService.getBookInfo();

	BookInfoServiceResource.call(olids).$promise.then(function(response){

		var listOfEditionBooks = response.listOfBooks;
		for (var i=0; i<listOfEditionBooks.length ; i++) {
			if(listOfEditionBooks[i].preview=='full'){

				$scope.addSlide(listOfEditionBooks[i]);
			}
		}
	},
	function(error){

	});

	//service call to get the reviews for the book
	//mongo db call
	var bookReviewServiceCall = libraryService.getBookReviews($rootScope.activeBookRecord.ia[0]);
	bookReviewServiceCall.call().$promise.then(function(response){
		//set the different scope variables 
		setBookReviewScopeObjects(response);

	},
	function(error){

	});

	//this method sets the different scope objects after getting response from 
	//book review service call.
	//this basically refreshes all the data for reviews in the page
	function setBookReviewScopeObjects(response){
		$scope.bookReviewDocList = response.bookReviewDocumentList;
		$scope.overAllBookRating = response.overAllBookRating;
		$scope.totalRatings = response.totalRatings;
		//set scope for book rating document List
		$scope.bookRatingDocumentList = response.bookRatingDocumentList;

		savedBookReviewDocument = response.bookReviewDocumentList;
		//find out current user rating
		for(var i in response.bookRatingDocumentList){
			if($rootScope.loggedInUser.userEmail == response.bookRatingDocumentList[i].userRating.user.userEmail){
				$scope.bookRatingDocument = response.bookRatingDocumentList[i];
				$scope.userBookRating = response.bookRatingDocumentList[i].userRating.rating;
			}
		}
		//calculate the star rating count and progress bar
		calculateStarRatingCountAndWidth();

		//set the boolean for the liked by current user
		for(var i in $scope.bookReviewDocList){
			$scope.bookReviewDocList[i].likedByCurrentUser =  currentUserPresentInLikedBy($rootScope.loggedInUser, $scope.bookReviewDocList[i].userComment.likedBy);
			//$scope.userBookRating =  //bookReviewDoc.userRating;
		}
	}
	//this method is for calculating the count of different stars and the corresponding width
	function calculateStarRatingCountAndWidth(){
		$scope.fiveStarCount = 0;
		$scope.fourStarCount = 0;
		$scope.threeStarCount = 0;
		$scope.twoStarCount = 0;
		$scope.oneStarCount = 0;
		for(var i in $scope.bookRatingDocumentList){
			if($scope.bookRatingDocumentList[i].userRating.rating == 1){
				$scope.oneStarCount++;
			}else if($scope.bookRatingDocumentList[i].userRating.rating == 2){
				$scope.twoStarCount++;
			}else if($scope.bookRatingDocumentList[i].userRating.rating == 3){
				$scope.threeStarCount++;
			}else if($scope.bookRatingDocumentList[i].userRating.rating == 4){
				$scope.fourStarCount++;
			}else if($scope.bookRatingDocumentList[i].userRating.rating == 5){
				$scope.fiveStarCount++;
			}
		}
		//calculate the width of different stars
		if($scope.bookRatingDocumentList != undefined || $scope.bookRatingDocumentList != null){
			var totalCount = $scope.bookRatingDocumentList.length;
			$scope.width_5_star = {'width':$scope.fiveStarCount*80/totalCount+'px'};
			$scope.width_4_star = {'width':$scope.fourStarCount*80/totalCount+'px'};
			$scope.width_3_star = {'width':$scope.threeStarCount*80/totalCount+'px'};
			$scope.width_2_star = {'width':$scope.twoStarCount*80/totalCount+'px'};
			$scope.width_1_star = {'width':$scope.oneStarCount*80/totalCount+'px'};
		}
	}

	function currentUserPresentInLikedBy(obj, list) {
		for (var i in list) {
			if (list[i].userEmail === obj.userEmail) {
				return true;
			}
		}

		return false;
	}
	$scope.getSecondIndex = function(index)
	{
		if(index-slides.length>=0)
			return index-slides.length;
		else{
			return index;
		}
	};

	$scope.filterReviewsByStar = function(star){
		$scope.bookReviewDocList = savedBookReviewDocument;
		//loop through the scope's bookReviewDoc and filter review according to star
		var updatedReviewDocList = [];
		for(var i in $scope.bookReviewDocList){
			if($scope.bookReviewDocList[i].bookRatingDocument.userRating.rating == star){
				updatedReviewDocList.push($scope.bookReviewDocList[i]); 
			}
		}
		$scope.bookReviewDocList = updatedReviewDocList;
	};

	$scope.seeAllReviews = function(){
		$scope.bookReviewDocList = savedBookReviewDocument;
	};

	$scope.toggleThumbsUp = function(bookReviewDoc){
		bookReviewDoc.likedByCurrentUser = !bookReviewDoc.likedByCurrentUser;

		//logic on Un-liking the comment
		if(!bookReviewDoc.likedByCurrentUser){
			//edit the doc to accompany  like and undo like functionality
			//for this we need to do following activities:
			//1. reduce the no of likes for that doc
			//2. Remove the user from the doc as likedByUser
			var updatedLikedByUser = [];
			for(var i in bookReviewDoc.userComment.likedBy){
				if(bookReviewDoc.userComment.likedBy[i].userEmail != $rootScope.loggedInUser.userEmail){
					updatedLikedByUser.push(bookReviewDoc.userComment.likedBy[i]);
				}
			}
			bookReviewDoc.userComment.likes = bookReviewDoc.userComment.likes - 1;
			bookReviewDoc.userComment.likedBy = updatedLikedByUser;
		}

		//logic on liking the comment
		if(bookReviewDoc.likedByCurrentUser){
			//edit the doc to accompany  like and undo like functionality
			//for this we need to do following activities:
			//1. add the no of likes for that doc
			//2. add the current user in the doc as likedByUser
			var updatedLikedByUser = [];
			updatedLikedByUser.push($rootScope.loggedInUser);
			for(var i in bookReviewDoc.userComment.likedBy){
				if(bookReviewDoc.userComment.likedBy[i].userEmail != $rootScope.loggedInUser.userEmail){
					updatedLikedByUser.push(bookReviewDoc.userComment.likedBy[i]);
				}
			}
			bookReviewDoc.userComment.likes = bookReviewDoc.userComment.likes + 1;
			bookReviewDoc.userComment.likedBy = updatedLikedByUser;
		}
		//remove the unnecessary properties from the bookReviewDoc
		// delete bookReviewDoc.likedByCurrentUser;

		//make a server call to store the data in mongo db
		var bookReviewServiceCall = libraryService.updateBookReview();
		bookReviewServiceCall.call(bookReviewDoc).$promise.then(function(response){
			if(response != null ){
			}
		},
		function(error){

		});

	};
});