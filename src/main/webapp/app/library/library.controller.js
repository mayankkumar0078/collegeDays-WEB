angular.module('library')

.controller('libraryCtrl', function libraryCtrl($scope, usSpinnerService, libraryService, blockUI,  $modal, $rootScope) {

	$scope.start = function(){
		usSpinnerService.spin('spinner-1');
	};
	$scope.stop = function(){
		//usSpinnerService.stop('spinner-1');
	};
	$scope.readablePageScrollEnded = false;
	$scope.scrollablePageScrollEnded = false;
	$scope.showBookReviewPage = true;
	$scope.showAddBookToShelfPage = false;
	
	$scope.readable_infinite_scroll_in_progress = false;
	$scope.borrowable_infinite_scroll_in_progress = false;
	
	var toggleReadableBooks = true;
	var toggleBorrowableBooks = false;
	
	$scope.library = {};
	
	var readableBooks=[];
	var borrowableBooks=[];
	var pageNo = 1;
	var booksInReadablePageList=[];
	var booksInBorrowablePageList=[];
	var currentPageInUIReadableTab = 1;
	var currentPageInUIBorrowableTab = 1;
	var scrolledBookPageType="";
	var allBooksSearched = false;
	var advSearchCriteriaSaved = null;
	var bookSearchType = "";
	var totalNoOfRecords = 0;
	
	$scope.shelfRadioButtonGroup = "";
	 $scope.isBookShelfClicked = false;
	var searchBookButtonClicked = false;
	$scope.showCreateNewShelf = true;
	//watch the book shelf clicked from the book shelf page
	  $scope.$watch(function () { return libraryService.getBookShelf(); }, 
			  		function (newValue, oldValue) {
		  		if(!(newValue.shelfName == 'dummyShelf')){
			        if (newValue !== oldValue) {
			        	resetVariables();
			        	$scope.noReadableBooksInShelf = false;
			        	$scope.noBorrowableBooksInShelf = false;
			        	$scope.readable_infinite_scroll_in_progress = false;
			        	$scope.borrowable_infinite_scroll_in_progress = false;
			        	$scope.shelfName = newValue.shelfName;
			        	var request = [];
			        	//loop through the books and make list of book ids 
			        	for(var i in newValue.books){
			        		request.push(newValue.books[i].bookId);
			        	}
			        	  var ratingResource = libraryService.getBookRatings();
			        	  ratingResource.call(request).$promise.then(function(response) {
			        		  if(response != undefined && response.status == 200){
			        			  //set the readable and borrowable books
			        			  $scope.readableBooks = [];
			        			  $scope.borrowableBooks = [];
			        			  
			        			  var bookAvgRatings = response.bookAvgRating;
			        			  //loop through the shelf books and add the rating to it
			        			  for(var bookIndex in newValue.books){
			        				  var notFound = true;
			        				  for(var ratingIndex in bookAvgRatings){
			        					  if(newValue.books[bookIndex].bookId == bookAvgRatings[ratingIndex]._id){
			        						  newValue.books[bookIndex].bookRating =  bookAvgRatings[ratingIndex].avgRating;
			        						  if(bookAvgRatings[ratingIndex].avgRating != 0){
			        							  notFound = false;
			        						  newValue.books[bookIndex].noOfRatings = (bookAvgRatings[ratingIndex].sumOfRatings)/(bookAvgRatings[ratingIndex].avgRating);
			        						  }
			        					  }
			        				  }
			        				  //set the default one
			        				  if(notFound){
			        					  newValue.books[bookIndex].noOfRatings = 1;
			        					  newValue.books[bookIndex].bookRating =  3;
			        				  }
			        				  //find out the type of the book i.e readable/borrowable
			        				  if(newValue.books[bookIndex].public_scan_b){
			        					  $scope.readableBooks.push(newValue.books[bookIndex]);
			        				  }else{
			        					  $scope.borrowableBooks.push(newValue.books[bookIndex]);
			        				  }
			        			  }
			        		  }
					        	if($scope.readableBooks != undefined && $scope.readableBooks.length == 0){
					        		$scope.noReadableBooksInShelf = true;
					        	}
			        	  if($scope.borrowableBooks != undefined && $scope.borrowableBooks.length == 0){
				        		$scope.noBorrowableBooksInShelf = true;
				        	}
			        	  
			        	  //find out the current active tab and display the same
			        	  var readableTabActive = true;
			        	  for(var tabIndex in $scope.tabs){
			        		  if($scope.tabs[tabIndex].title == 'Borrowable' && $scope.tabs[tabIndex].active){
			        			  readableTabActive = false;
			        		  }
			        	  }
					        	$scope.tabs = [
								               {title:'Readable', active:readableTabActive, page: 'app/library/readable/readable.tpl.html', icon:'assets/img/open-books/open-book.jpg'},
								               {title:'Borrowable', active:!readableTabActive, page: 'app/library/borrowable/borrowable.tpl.html', icon:'assets/img/open-books/open-book.jpg'},
								               ];
					        	$scope.searchBookText = '';
			        		},
			        		function(error) {
			        			
			        		}
			        		);
			        }
	  }
			    });

	  //watch the  book shelf clicked boolean form the book shelf
	  $scope.$watch(function () { return libraryService.getBookShelfClicked(); }, 
		  		function (newValue, oldValue) {
		        if (newValue !== oldValue) {
		        	 $scope.isBookShelfClicked = newValue;
		        	searchBookButtonClicked = !$scope.isBookShelfClicked;
		        }
		        
		    });
	  
	  //get the book shelves for the user on page load
	  var shelfResource = libraryService.retrieveUserShelves($rootScope.loggedInUser.userEmail);
	  shelfResource.call().$promise.then(function(response) {
		  if(response != undefined && response.status == 200 && response.userShelfDocument != undefined){
			  $rootScope.bookShelves = response.userShelfDocument.shelves; 
			  //publish the shelves retrieved to the library controller
			  //libraryService.setUserBookShelves($scope.bookShelves);
		  }else if(response != undefined && response.status != 200){
			  //show the error message
		  }
		  
		},
		function(error) {
			alert("Some problem while retrieving user shelves. Try after some time");
		}
		);
	  
	  //watch the list of user book shelves returned from book shelf page
	  //this is the list of all the shelves assigned to a user
	  $scope.$watch(function () { return libraryService.getUserBookShelves(); }, 
		  		function (newValue, oldValue) {
		        if (newValue !== oldValue) {
		        	//get the list of book shelves for a user
		        	//$scope.bookShelves = newValue;
		        }
		        
		    });
	  
	  $scope.showCreateNewShelfTextBox = function(){
		  $scope.showCreateNewShelf = false;
	  };
	  
	  $scope.enableCreateNewShelfLink = function(){
		  $scope.showCreateNewShelf = true;
	  };
	
	//hover event on book rating section
	$scope.getRatingForBook = function(record){
		$scope.hoveredBook = {};
		if(record != undefined && record.ia != undefined){
			var bookId = record.ia[0];
		}else{
			bookId = record.bookId;
		}
		
		$scope.hoveredBook.record = record;
		$rootScope.activeBookRecord = record;
		//check if the book is having the default rating then don't call the service
		if(record.noOfRatings == 1){
			$scope.hoveredBook.overAllRatingPopUp = 3;
			$scope.hoveredBook.noOfRatingsPopUp = 1;
			//$scope.hoveredBook.ratingOfUser = 0;
		}
		
		else{
		//call the book rating service to get the book rating data
			$scope.library.refreshBookRating(bookId);
		}
	};
	
	//set the active record to use it in different controllers
	$scope.saveActiveRecord = function(record){
		$rootScope.activeBookRecord = record;
	};
	//open book details modal...............................................................
		$scope.openBookDetailsModal = function(record){
			$scope.animationsEnabled = true;
			$scope.record=record;
			$rootScope.activeBookRecord = record;
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
		
		// open advance search modal.........................................................
		$scope.showAdvanceSearchModal = function(){
			//$scope.animationsEnabled = true;

			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'advanceBookSearchModal.html',
				controller: 'advanceBookSearchModalCTRL',
				scope:$scope,
				size: 'sm',
//				resolve: {
//					items: function () {
//						return $scope.items;
//					}
//				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				// $log.info('Modal dismissed at: ' + new Date());
			});
		};
		
	
	/*options for the rating system*/
	$scope.optionsReadOnly = {
			values 			: [ 1, 2, 3,4,5 ],
			allowFractional         : true,
			readonly                : true,
			applyHoverCss	: false
			
	};
	
	$scope.enterEvent = function(event){
		if(event.keyCode == 13){
			$scope.searchBooks();
		}
	};
	
	//put the books in the readable page on scrolling
	var putBooksInReadablePage = function(bookType){
		if(!allBooksSearched){
		//$scope.searchBooks();
			usSpinnerService.spin('spinner-1');
		if(readableBooks.length > booksInReadablePageList.length ){
			
			for (var i = booksInReadablePageList.length; i < readableBooks.length; i++) {
				booksInReadablePageList.push(readableBooks[i]);
			}
			blockUI.stop();
			$scope.readableBooks = booksInReadablePageList;
			//usSpinnerService.stop('spinner-1');
		}else{
			scrolledBookPageType = bookType;
			pageNo++;
			if(bookSearchType == 'wildCardSearch'){
			$scope.searchBooks('wildCardSearch', null, false);
			}else if(bookSearchType == 'advanceSearch'){
				$scope.searchBooks('advanceSearch', advSearchCriteriaSaved, false);
			}
			//blockUI.start();
		}
	}else {
		$scope.readablePageScrollEnded = true;
		//put the remaining books in the page 
		if(pageNo>=(totalNoOfRecords/100)){
			for (var i = booksInReadablePageList.length ; i < readableBooks.length; i++) {
				booksInReadablePageList.push(readableBooks[i]);
			}
		}
	}
	};
	
	//put the books in the borrowable page on scrolling
	var putBooksInBorrowablePage = function(bookType){
		if(!allBooksSearched){
		if(borrowableBooks.length > booksInBorrowablePageList.length ){
			blockUI.stop();
			for (var i = booksInBorrowablePageList.length ; i < borrowableBooks.length; i++) {
				booksInBorrowablePageList.push(borrowableBooks[i]);
			}
			$scope.borrowableBooks = booksInBorrowablePageList;
		}else{
			scrolledBookPageType = bookType;
			pageNo++;
			if(bookSearchType == 'wildCardSearch'){
				$scope.searchBooks('wildCardSearch', null, false);
				}else if(bookSearchType == 'advanceSearch'){
					$scope.searchBooks('advanceSearch', advSearchCriteriaSaved, false);
				}
			//blockUI.start();
		}
		}else {
			$scope.borrowablePageScrollEnded = true;
			if(pageNo>=(totalNoOfRecords/100)){
				for (var i = booksInBorrowablePageList.length ; i < borrowableBooks.length; i++) {
					booksInBorrowablePageList.push(borrowableBooks[i]);
				}
			}
		}
	};
	/*.....................set the boolean to know about the clicked tab in library....................................*/
	
	$scope.tabClicked = function(tabTitle){
		if(tabTitle == 'Readable'){
			toggleBorrowableBooks = false;
			toggleReadableBooks = true;
		}else if(tabTitle == 'Borrowable'){
			toggleBorrowableBooks = true;
			toggleReadableBooks = false;
		}
	};
	//method to add the books in scrolled page
	$scope.addBooksInPage = function (bookType) {
		//infinite scroll only if we have clicked on the search button
		if(searchBookButtonClicked) {
		//add the books if the tab is readable
		if(bookType == 'readableTab' && toggleReadableBooks){
			if(!$scope.readable_infinite_scroll_in_progress){
			currentPageInUIReadableTab++;
			putBooksInReadablePage(bookType);
			}
			//add the books if the page is borrowable
		}else if(bookType == 'borrowableTab' && toggleBorrowableBooks){
			if(!$scope.borrowable_infinite_scroll_in_progress){
				currentPageInUIBorrowableTab++;
				putBooksInBorrowablePage(bookType);
			}
			
		}
		}
	};

	//reset the variables for the new book search
	var resetVariables = function(){
		 readableBooks=[];
		 borrowableBooks=[];
		 pageNo = 1;
		 noOfReadableBooksReturned = 20;
		 noOfBorrowableBooksReturned = 20;
		 booksInReadablePageList=[];
		 booksInBorrowablePageList=[];
		 currentPageInUIReadableTab = 1;
		 currentPageInUIBorrowableTab = 1;
		 searchCalledFromScroll = false;
		 allBooksSearched = false;
		 advSearchCriteriaSaved = null;
		 searchTextSearched="";
		 $scope.readablePageScrollEnded = false;
		 $scope.borrowablePageScrollEnded = false;
		 $scope.readable_infinite_scroll_in_progress = false;
		 $scope.borrowable_infinite_scroll_in_progress = false;
	};
	//function to search the books
	var searchTextSearched = "";
	$scope.searchBooks = function(searchType, advSearchCriteria, isNewSearch){
		$scope.readable_infinite_scroll_in_progress = true;
		$scope.borrowable_infinite_scroll_in_progress = true;
		libraryService.setBookShelfClicked(false);
		var dummyShelf = {"shelfName":"dummyShelf"};
		libraryService.setBookShelf(dummyShelf);
		searchBookButtonClicked = true;
		bookSearchType = searchType;
		if(searchType == 'wildCardSearch') {
			//check if the search call is through recursion.. or it's a new search
		 if(isNewSearch){	
		//reset the variables if the text is getting searched different 
		//if(searchTextSearched != $scope.searchBookText){
			resetVariables();
			searchTextSearched = $scope.searchBookText;
		//}
			}
		//start the block ui if it is the first page search
		if(pageNo == 1){
			blockUI.start();
		}else{
			usSpinnerService.spin('spinner-1');
		}
		
		//..................service call............................................
		//get the resource for searching the book with subject and the page no
		var resource = libraryService.searchBook(searchTextSearched, pageNo);
		//make the ajax call 
		resource.call().$promise.then(function(response) {
			if(response != undefined && response.status == 200){
			populateBookSearchResponseInUI(response, searchType);
			$scope.readable_infinite_scroll_in_progress = false;
			$scope.borrowable_infinite_scroll_in_progress = false;
			//usSpinnerService.stop('spinner-1');
			}else{
				//do nothing.
			}
		},
		function(error) {
			$scope.readable_infinite_scroll_in_progress = false;
			$scope.borrowable_infinite_scroll_in_progress = false;
			alert(error);
			blockUI.stop();
			//usSpinnerService.stop('spinner-1');
		}
		);

	}else if(searchType == 'advanceSearch'){
		
		// if(!recursionInProgress){	
		//check if it is a new search
		if(advSearchCriteriaSaved!=null) {
		if(advSearchCriteria['subject'] != advSearchCriteriaSaved['subject']
		|| advSearchCriteria['title'] != advSearchCriteriaSaved['title']
		|| advSearchCriteria['author'] != advSearchCriteriaSaved['author']
		|| advSearchCriteria['publishYearStartLimit'] != advSearchCriteriaSaved['publishYearStartLimit']
		|| advSearchCriteria['publishYearEndLimit'] != advSearchCriteriaSaved['publishYearEndLimit']
		||advSearchCriteria['title'] != advSearchCriteriaSaved['title']
		||advSearchCriteria['place'] != advSearchCriteriaSaved['place']
		||advSearchCriteria['isbn'] != advSearchCriteriaSaved['isbn']){
			
			resetVariables();
		//}
		}
		}
		advSearchCriteriaSaved = advSearchCriteria;
		//reset the variables if the text is getting searched different 
		if(pageNo==1){
		//resetVariables();
		blockUI.start();
		}
		
		//..................service call............................................
		//get the resource for searching the book with subject and the page no
		var advanceSearchServiceResource = libraryService.advanceBookSearch(pageNo);
		//make the ajax call 
		advanceSearchServiceResource.call(advSearchCriteriaSaved).$promise.then(function(response) {
			if(response != null && response.status == 200){
			populateBookSearchResponseInUI(response, searchType);
			}
		},
		function(error) {
			alert(error);
			blockUI.stop();
		}
		);
	};
	
	};

	var populateBookSearchResponseInUI = function(response, searchType){
		if(response != null) {
		if(response.readableBooks.length == 0 && response.borrowableBooks.length == 0){
			if(pageNo<=(response.bookNumFound)/100){
				pageNo++;
				$scope.searchBooks(searchType);
			}
			blockUI.stop();
		}else {
			
			if(response.readableBooks.length >0) {
				for(var i=0; i<response.readableBooks.length; i++){
					readableBooks.push(response.readableBooks[i]);
				}
			}
			if(response.borrowableBooks.length >0) {
				for(var i=0; i<response.borrowableBooks.length; i++){
					borrowableBooks.push(response.borrowableBooks[i]);
				}
			}
			if(pageNo == 1){
				booksInReadablePageList = [];
				booksInBorrowablePageList = [];
				noOfReadableBooksReturned = readableBooks.length;
				noOfBorrowableBooksReturned = borrowableBooks.length;
				for(var i = 0;i<readableBooks.length; i++){
					booksInReadablePageList.push(readableBooks[i]);
				}
				for(var i = 0;i<borrowableBooks.length; i++){
					booksInBorrowablePageList.push(borrowableBooks[i]);
				}
				$scope.readableBooks = booksInReadablePageList;
				$scope.borrowableBooks = booksInBorrowablePageList;

				$scope.tabs = [
				               {title:'Readable', page: 'app/library/readable/readable.tpl.html', icon:'assets/img/open-books/open-book.jpg'},
				               {title:'Borrowable', page: 'app/library/borrowable/borrowable.tpl.html', icon:'assets/img/open-books/open-book.jpg'},
				               ];
				blockUI.stop();
			}
			
			if(pageNo>=(response.bookNumFound)/100){
				allBooksSearched = true;
				blockUI.stop();
			}
			
			//set the books in the page after the page was scrolled for borrowable or readable
			if(scrolledBookPageType == 'borrowableTab'){
				scrolledBookPageType = "";
				putBooksInBorrowablePage();
				//call the method to put the borrowable books in the page
			}else if(scrolledBookPageType == 'readableTab'){
				scrolledBookPageType = "";
				putBooksInReadablePage();
				//call the method to put the readable books in the page after scrolled
			}
			//blockUI.stop();
			//pageNo++;

			//back ground the process of searching books from page no 2 to the total no of books
			totalNoOfRecords = response.bookNumFound;
			if(pageNo>=(response.bookNumFound)/100){
				allBooksSearched = true;
				recursionInProgress = false;
				blockUI.stop();
				return;
			}else{
				//blockUI.stop();
				recursionInProgress = true;
				//$scope.searchBooks(searchType, advSearchCriteriaSaved, false);
			}
			blockUI.stop();
		}	
	
	}
	};
});