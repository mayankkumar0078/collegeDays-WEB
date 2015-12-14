angular.module('library')

.controller('libraryCtrl', function libraryCtrl($scope, libraryService, blockUI,  $modal) {

	$scope.readablePageScrollEnded = false;
	$scope.scrollablePageScrollEnded = false;
	$scope.showBookReviewPage = true;
	$scope.showAddBookToShelfPage = false;
	var toggleReadableBooks = true;
	var toggleBorrowableBooks = false;
	
	//open book details modal...............................................................
		$scope.openBookDetailsModal = function(record){
			$scope.animationsEnabled = true;
			$scope.record=record;
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
	$scope.options = {
			values 			: [ 1, 2, 3,4,5 ],
			cssFractional           : "rating-star-fractional",
			allowFractional         : true,
			readOnly                : true,
			htmlEvent               : null,

			cssValuesSelected 	: [
			                  	   "first-selected",
			                  	   "second-selected",
			                  	   "third-selected",],
			                  	   cssValuesUnselected	: [
			                  	                      	   "first-unselected",
			                  	                      	   "second-unselected",
			                  	                      	   "third-unselected",],
			                  	                      	   /* cssHover		: "rating-star-hover"*/
	};


	$scope.enterEvent = function(event){
		if(event.keyCode == 13){
			$scope.searchBooks();
		}
	};
	var readableBooks=[];
	var borrowableBooks=[];
	var pageNo = 1;
	var noOfReadableBooksReturned = 20;
	var noOfBorrowableBooksReturned = 20;
	var booksInReadablePageList=[];
	var booksInBorrowablePageList=[];
	var currentPageInUIReadableTab = 1;
	var currentPageInUIBorrowableTab = 1;
	var scrolledBookPageType="";
	var allBooksSearched = false;
	var advSearchCriteriaSaved = null;
	var bookSearchType = "";
	var recursionInProgress = false;
	var totalNoOfRecords = 0;
	
	
	//put the books in the readable page on scrolling
	var putBooksInReadablePage = function(bookType){
		if(!allBooksSearched){
		//$scope.searchBooks();
			
		if(readableBooks.length >= booksInReadablePageList.length ){
			blockUI.stop();
			for (var i = booksInReadablePageList.length-1 ; i < readableBooks.length; i++) {
				booksInReadablePageList.push(readableBooks[i]);
			}
			$scope.readableBooks = booksInReadablePageList;
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
		if(borrowableBooks.length >= booksInBorrowablePageList.length ){
			blockUI.stop();
			for (var i = booksInBorrowablePageList.length-1 ; i < borrowableBooks.length; i++) {
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
		
		//add the books if the tab is readable
		if(bookType == 'readableTab' && toggleReadableBooks){
			currentPageInUIReadableTab++;
			putBooksInReadablePage(bookType);
			//add the books if the page is borrowable
		}else if(bookType == 'borrowableTab' && toggleBorrowableBooks){
			currentPageInUIBorrowableTab++;
			putBooksInBorrowablePage(bookType);
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
		 borrowablePageScrollEnded = false;
		 readablePageScrollEnded = false;
		 searchTextSearched="";
		 $scope.readablePageScrollEnded = false;
		 $scope.borrowablePageScrollEnded = false;
	};
	//function to search the books
	var searchTextSearched = "";
	$scope.searchBooks = function(searchType, advSearchCriteria, isNewSearch){
		bookSearchType = searchType;
		if(searchType == 'wildCardSearch') {
			//check if the search call is through recursion.. or it's a new search
		 if(isNewSearch){	
		//reset the variables if the text is getting searched different 
		if(searchTextSearched != $scope.searchBookText){
			resetVariables();
			searchTextSearched = $scope.searchBookText;
		}
			}
		//start the block ui if it is the first page search
		if(pageNo == 1){
			blockUI.start();
		}
		//..................service call............................................
		//get the resource for searching the book with subject and the page no
		var resource = libraryService.searchBook(searchTextSearched, pageNo);
		//make the ajax call 
		resource.call().$promise.then(function(response) {
			populateBookSearchResponseInUI(response, searchType);
		},
		function(error) {
			alert(error);
			blockUI.stop();
		}
		);

		console.log("In the search books method last ");
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
		var advanceSearchService = libraryService.advanceBookSearch(pageNo);
		//make the ajax call 
		advanceSearchService.call(advSearchCriteriaSaved).$promise.then(function(response) {
			
			populateBookSearchResponseInUI(response, searchType);
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