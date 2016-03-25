var libraryModule =  angular.module('library');

libraryModule.controller('bookRatingPopoverCTRL', function($scope, $rootScope, $modal, libraryService){

	//by default show over all rating section
	$scope.showOverAllRatingSec = true;
	$scope.showSubmitReviewSec = false;
	/*options for the rating system*/
	$scope.optionsEditable = {
			values 			: [ 1, 2, 3, 4, 5],
			allowFractional         : false,
			readonly                : false,
			applyHoverCss	: true

	};

	$scope.saveBookReview = function(){

	};

	//Insert/update Book Review
	$scope.insertBookReview = function(){
		if($scope.ratingOfUser == null || $scope.ratingOfUser == 0 ){
			console.log('user rating is empty');
		}else{
			if($scope.hoveredBook.userBookReview != undefined && $scope.hoveredBook.userBookReview != ''){
				if(($scope.hoveredBook.bookReviewDocument != null ||
						$scope.hoveredBook.bookReviewDocument != undefined) && $scope.hoveredBook.bookReviewDocument.review != undefined){
					
					//set the review
					$scope.hoveredBook.bookReviewDocument.review =  $scope.hoveredBook.userBookReview ;
					//update the book review document
					var bookRatingServiceCall = libraryService.updateBookReview();
					bookRatingServiceCall.call($scope.hoveredBook.bookReviewDocument).$promise.then(function(response){

						//refresh the book ratings after the insert 
						//$scope.library.refreshBookRating($scope.hoveredBook.record.ia[0]);

					},
					function(error){

					});
				}else{
					//make the book review document to be saved to mongo db
					var bookReviewDocument = {};
					var user = {};
					//var userComment = {};

					//set the user
					user.userEmail = $rootScope.loggedInUser.userEmail;
					user.userName = $rootScope.loggedInUser.userName;

					//set the book review
					bookReviewDocument.review = $scope.hoveredBook.userBookReview;

					//set book review document
					//bookReviewDocument.userComment = userComment;
					bookReviewDocument.bookId = $rootScope.activeBookRecord.ia[0];
					bookReviewDocument.user = user;

					//insert new records into mongo db
					var bookRatingServiceCall = libraryService.insertBookReview();
					bookRatingServiceCall.call(bookReviewDocument).$promise.then(function(response){

						//refresh the book ratings after the insert 
						//$scope.library.refreshBookRating($scope.hoveredBook.record.ia[0]);

					},
					function(error){

					});
				}
				//save the book rating
				saveBookRating($scope.ratingOfUser);
				
			}
		}
	};
	//open book details modal...............................................................
	$scope.openBookDetailsModal = function(record){
		$scope.animationsEnabled = true;
		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'bookDetailModal.html',
			controller: 'bookDetailsModalCTRL',
			scope:$scope,
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
		});
	};

	//Watch on the variable 'userBookRating' and update the rating of the book
	$scope.$watch('ratingOfUser', function (newValue, oldValue) {
		if(newValue != undefined){
			//$scope.bookRatingDocument.userRating.rating = newValue;
		}
		if(oldValue!= undefined && newValue != undefined && oldValue != newValue){

			if(($scope.hoveredBook.bookReviewDocument!= null &&
					$scope.hoveredBook.bookReviewDocument.review != null) 
					|| ($scope.hoveredBook.bookReviewDocument != undefined
							&& $scope.hoveredBook.bookReviewDocument.review != undefined)){
				saveBookRating(newValue);
			}  else{
				//notify user to write some review
				console.log('please enter some review  ');
			}
		}
	});
	//saves the book rating
	function saveBookRating(newValue){
		//if the $scope.bookRating document is null or undefined then it means it is new 
		if($scope.hoveredBook.bookRatingDocument == undefined || $scope.hoveredBook.bookRatingDocument == null){
			var bookRatingDocList = [];
			//create a new bookRating document for system and user rating and then save it

			//populate user rating 
			$scope.hoveredBook.bookRatingDocument = {};
			var userRating = {};
			var user = {};
			user.userEmail = $rootScope.loggedInUser.userEmail;
			user.userName = $rootScope.loggedInUser.userName;

			userRating.user = user;
			userRating.rating = newValue;

			//set user rating
			$scope.hoveredBook.bookRatingDocument.bookId = $scope.hoveredBook.record.ia[0];
			$scope.hoveredBook.bookRatingDocument.userRating = userRating;

			//populate system rating
			var systemRatingDoc = {};
			var systemUserRating = {};
			var systemUser = {};
			systemUser.userEmail = "admin@collegedays.com";
			systemUser.userName = "Admin";

			systemUserRating.user = systemUser;
			systemUserRating.rating = 3;

			//set system rating
			systemRatingDoc.userRating = systemUserRating;
			systemRatingDoc.bookId = $scope.hoveredBook.record.ia[0];

			//set list of system and user rating
			bookRatingDocList.push(systemRatingDoc);
			bookRatingDocList.push($scope.hoveredBook.bookRatingDocument);

			//insert new records into mongo db
			var bookRatingServiceCall = libraryService.insertBookRatings();
			bookRatingServiceCall.call(bookRatingDocList).$promise.then(function(response){

				//refresh the book ratings after the insert 
				$scope.library.refreshBookRating($scope.hoveredBook.record.ia[0]);

			},
			function(error){

			});
		}
		else{
			//if the user has already give the rating then 
			//in that case just update the rating of that user
			var updatedBookRatingDoc = $scope.hoveredBook.bookRatingDocument;
			updatedBookRatingDoc.userRating.rating = newValue;
			//call the service to update the rating of the book
			var bookRatingServiceCall = libraryService.updateBookRating();
			bookRatingServiceCall.call(updatedBookRatingDoc).$promise.then(function(response){

				$scope.library.refreshBookRating($scope.hoveredBook.record.ia[0]);

			},
			function(error){

			});
		}
	}
	//refresh the book rating for a book.
	$scope.library.refreshBookRating = function(bookId){

		var bookRatingServiceCall = libraryService.getBookReviews(bookId);
		bookRatingServiceCall.call().$promise.then(function(response){
			if(response != null ){
				setRatingScopeObjects(response);
			}
		},
		function(error){

		});
	};

	//set the scope objects after the book rating retrieved
	function setRatingScopeObjects(response){
		$scope.hoveredBook.bookRatingDocument = undefined;
		$scope.hoveredBook.bookReviewDocument = undefined;
		//calculate the user rating
		for(var i in response.bookRatingDocumentList){
			//set the current user rating and review out of all the users
			if($rootScope.loggedInUser.userEmail == response.bookRatingDocumentList[i].userRating.user.userEmail){
				$scope.hoveredBook.bookRatingDocument = response.bookRatingDocumentList[i];
				$scope.ratingOfUser = response.bookRatingDocumentList[i].userRating.rating;
			}
		}
		//loop throught the review to get the current user review
		for(var j in response.bookReviewDocumentList){
		//set the review set by the user
		if($rootScope.loggedInUser.userEmail == response.bookReviewDocumentList[j].user.userEmail){
			//set the review of the user
			$scope.hoveredBook.userBookReview = response.bookReviewDocumentList[j].review;
			$scope.hoveredBook.bookReviewDocument = response.bookReviewDocumentList[j];
		}
	}
		//set the scope objects for no of users and over all rating
		$scope.hoveredBook.overAllRatingPopUp = response.overAllBookRating;
		$scope.hoveredBook.noOfRatingsPopUp = response.bookRatingDocumentList.length;

		//calculate the star rating count 
		calculateStarRatingCountAndWidth(response.bookRatingDocumentList);
	}

	function calculateStarRatingCountAndWidth(bookRatingDocList){
		$scope.hoveredBook.fiveStarCount = 0;
		$scope.hoveredBook.fourStarCount = 0;
		$scope.hoveredBook.threeStarCount = 0;
		$scope.hoveredBook.twoStarCount = 0;
		$scope.hoveredBook.oneStarCount = 0;
		for(var i in bookRatingDocList){
			if(bookRatingDocList[i].userRating.rating == 1){
				$scope.hoveredBook.oneStarCount++;
			}else if(bookRatingDocList[i].userRating.rating == 2){
				$scope.hoveredBook.twoStarCount++;
			}else if(bookRatingDocList[i].userRating.rating == 3){
				$scope.hoveredBook.threeStarCount++;
			}else if(bookRatingDocList[i].userRating.rating == 4){
				$scope.hoveredBook.fourStarCount++;
			}else if(bookRatingDocList[i].userRating.rating == 5){
				$scope.hoveredBook.fiveStarCount++;
			}
		}
		//calculate the width of different stars
		var totalCount = bookRatingDocList.length;
		$scope.hoveredBook.width_5_star = {'width':$scope.hoveredBook.fiveStarCount*80/totalCount+'px'};
		$scope.hoveredBook.width_4_star = {'width':$scope.hoveredBook.fourStarCount*80/totalCount+'px'};
		$scope.hoveredBook.width_3_star = {'width':$scope.hoveredBook.threeStarCount*80/totalCount+'px'};
		$scope.hoveredBook.width_2_star = {'width':$scope.hoveredBook.twoStarCount*80/totalCount+'px'};
		$scope.hoveredBook.width_1_star = {'width':$scope.hoveredBook.oneStarCount*80/totalCount+'px'};
	}


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