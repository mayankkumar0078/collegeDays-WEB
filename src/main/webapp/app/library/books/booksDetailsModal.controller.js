var libraryModule =  angular.module('library');

libraryModule.controller('bookDetailsModalCTRL', function($scope, $rootScope, libraryService, blockUI,  $modal){

	//set the objects
	var savedBookReviewDocument = null;

	//set the template 
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

	//this method is for updating the review for a book.
	$scope.updateReview = function(bookReviewDoc){
		//update the comment in db for the user
		var bookReviewServiceCall = libraryService.updateBookReview();
		bookReviewServiceCall.call(bookReviewDoc).$promise.then(function(response){
			if(response != null ){
			}
		},
		function(error){

		});
	};

	//this method is for updating the comment for a review.
	$scope.updateComment = function(bookReviewDoc, userComment, index){
		
		bookReviewDoc.userComments[index] = userComment;
		//make the request
		var request = {};
		request.bookReviewId = bookReviewDoc.id;
		request.userComment = userComment;
		request.userComments = bookReviewDoc.userComments;
		//update the comment in db for the user
		var bookReviewServiceCall = libraryService.updateBookReviewComment();
		bookReviewServiceCall.call(request).$promise.then(function(response){
			if(response != null ){
				//take the latest user comment and push it to user comments in UI
				bookReviewDoc.userComments[index] = userComment;
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
		$scope.userHasReviewd = false;
		//set the boolean for the liked by current user
		for(var i in $scope.bookReviewDocList){
			
			// check if the logged-in user has submitted his reviews or not
			if($scope.bookReviewDocList[i].user.userEmail == $rootScope.loggedInUser.userEmail){
				$scope.userHasReviewd = true;
			}
			
			$scope.bookReviewDocList[i].showComments = false;
			$scope.bookReviewDocList[i].likedByCurrentUser =  currentUserPresentInLikedBy($rootScope.loggedInUser, $scope.bookReviewDocList[i].likedBy);
			//find out the user comments for that book review 
			if($scope.bookReviewDocList[i].userComments != undefined && $scope.bookReviewDocList[i].userComments.length > 0){
				//loop through the user comments and set the likedByCurrentUser
				for(var j in $scope.bookReviewDocList[i].userComments){
					
					for(var k in $scope.bookReviewDocList[i].userComments[j].likedBy){
						$scope.bookReviewDocList[i].userComments[j].likedByCurrentUser =  currentUserPresentInLikedBy($rootScope.loggedInUser, 
								$scope.bookReviewDocList[i].userComments[j].likedBy);
					}
				}
				
			}
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

	function currentUserPresentInLikedBy(currentUser, list) {
		if(currentUser == undefined)
			return false;
		if(currentUser.userEmail == undefined)
			return false;
		if(list == undefined)
			return false;
		if(list.length == 0)
			return false;

		for (var i in list) {
			if (list[i].userEmail === currentUser.userEmail) {
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

		if(bookReviewDoc.likes == null || bookReviewDoc.likes == undefined){
			bookReviewDoc.likes = 0;
		}

		//logic on Un-liking the comment
		if(!bookReviewDoc.likedByCurrentUser){
			//edit the doc to accompany  like and undo like functionality
			//for this we need to do following activities:
			//1. reduce the no of likes for that doc
			//2. Remove the user from the doc as likedByUser
			var updatedLikedByUser = [];
			for(var i in bookReviewDoc.likedBy){
				if(bookReviewDoc.likedBy[i].userEmail != $rootScope.loggedInUser.userEmail){
					updatedLikedByUser.push(bookReviewDoc.likedBy[i]);
				}
			}
			bookReviewDoc.likes = bookReviewDoc.likes - 1;
			bookReviewDoc.likedBy = updatedLikedByUser;
		}

		//logic on liking the comment
		if(bookReviewDoc.likedByCurrentUser){
			//edit the doc to accompany  like and undo like functionality
			//for this we need to do following activities:
			//1. add the no of likes for that doc
			//2. add the current user in the doc as likedByUser
			var updatedLikedByUser = [];
			updatedLikedByUser.push($rootScope.loggedInUser);
			for(var i in bookReviewDoc.likedBy){
				if(bookReviewDoc.likedBy[i].userEmail != $rootScope.loggedInUser.userEmail){
					updatedLikedByUser.push(bookReviewDoc.likedBy[i]);
				}
			}

			bookReviewDoc.likes = bookReviewDoc.likes + 1;
			bookReviewDoc.likedBy = updatedLikedByUser;
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
	//toggle the like button for comments
	$scope.toggleThumbsUpForComment = function(bookReviewDoc, userComment, index){

		console.log("user comment index is : "+index);
		if(userComment.likedByCurrentUser == undefined){
			userComment.likedByCurrentUser = false;
		}
		userComment.likedByCurrentUser = !userComment.likedByCurrentUser;
		if(userComment.likes == null || userComment.likes == undefined){
			userComment.likes = 0;
		}

		//logic on Un-liking the comment
		if(!userComment.likedByCurrentUser){
			var updatedLikedByUser = [];
			for(var i in userComment.likedBy){
				if(userComment.likedBy[i].userEmail != $rootScope.loggedInUser.userEmail){
					updatedLikedByUser.push(userComment.likedBy[i]);
				}
			}
			userComment.likes = userComment.likes - 1;
			userComment.likedBy = updatedLikedByUser;
		}

		//logic on liking the comment
		if(userComment.likedByCurrentUser){
			var updatedLikedByUser = [];
			updatedLikedByUser.push($rootScope.loggedInUser);
			for(var i in userComment.likedBy){
				if(userComment.likedBy[i].userEmail != $rootScope.loggedInUser.userEmail){
					updatedLikedByUser.push(userComment.likedBy[i]);
				}
			}

			userComment.likes = userComment.likes + 1;
			userComment.likedBy = updatedLikedByUser;
		}
		//set the updated user comment in the user comments by index
		 bookReviewDoc.userComments[index] = userComment;
		var request = {};
		request.bookReviewId = bookReviewDoc.id;
		request.userComments =  bookReviewDoc.userComments;
		request.userComment = userComment;
		request.userCommentIndex = index;
		//service call to update the user comments
		var bookReviewServiceCall = libraryService.updateBookReviewComment();
		bookReviewServiceCall.call(request).$promise.then(function(response){
			if(response != null ){
				//to do .. check if the user repsonse is not 200 then toogle back the previous like
				console.log('comments updated successfully');
				//bookReviewDoc.userComments = response.bookReviewDocument.userComments;
			}
		},
		function(error){
			userComment.likedByCurrentUser = !userComment.likedByCurrentUser;
		}); 
	};
	$scope.user = {};

	//put the value of comments for a review
	$scope.addNewComment = function(bookReviewDoc){
		if(event.keyCode == 13 && bookReviewDoc.reviewComment != undefined 
				&& bookReviewDoc.reviewComment != ""){
			console.log('enter pressed');
			var userComment = {};
			userComment.user = {'userEmail': $rootScope.loggedInUser.userEmail,
					'userName': $rootScope.loggedInUser.userName};
			userComment.comment = bookReviewDoc.reviewComment;

			var request = {"bookReviewId" : bookReviewDoc.id, "userComment" : userComment};
			var bookReviewServiceCall = libraryService.addBookReviewComment();
			bookReviewServiceCall.call(request).$promise.then(function(response){
				if(response != null ){
					console.log('comments updated successfully');
					//take the latest user comment and push it to user comments in UI
					var len = response.bookReviewDocument.userComments.length;
					var latestComment = response.bookReviewDocument.userComments[len-1];
					latestComment.likedByCurrentUser = false;
					//check if it is the first user comment
					if(bookReviewDoc.userComments == undefined ||
							bookReviewDoc.userComments == null){
						bookReviewDoc.userComments = [];
					}
					bookReviewDoc.userComments.push(latestComment);
					bookReviewDoc.reviewComment = undefined;
				}
			},
			function(error){

			}); 
		}
	};

	//show the comment section
	$scope.enableComment = function(bookReviewDoc){
		bookReviewDoc.showComments = true;
		bookReviewDoc.isFocused = true;
	};
});