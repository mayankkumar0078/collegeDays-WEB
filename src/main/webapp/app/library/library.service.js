/**
 * service to get the records from the service
 */
angular.module('collegeDays').
service('libraryService', function($resource) {

//	this is for sharing the books between different controllers

	//book shelf clicked from shelf page
	this.bookShelf = [];
	//check whether any of the book shelf clicked or not 
	this.bookShelfClicked = false;
	
	//set of all book shelves for a user which is coming form bookshelfcontroller
	this.userBookShelves = [];
	
	//share book shelf
	this.getBookShelf = function () {
		return this.bookShelf;
	};
	
	this.setBookShelf = function (bookShelf) {
		 this.bookShelf = bookShelf;
	};
	
	//share bookShelfClicked
	this.getBookShelfClicked = function () {
		return this.bookShelfClicked;
	};
	
	this.setBookShelfClicked = function (bookShelfClicked) {
		this.bookShelfClicked = bookShelfClicked;
	};
	
	//share userBookShelves
	this.getUserBookShelves = function () {
		return this.userBookShelves;
	};
	
	this.setUserBookShelves = function (userBookShelves) {
		this.userBookShelves = userBookShelves;
	};
	
	//search books
	this.searchBook = function(textSearch, pageNo) {
		var toBeSearchedText = "";
		var splitsearchText = textSearch.split(/\s+/);
		if(splitsearchText.length > 0){
			toBeSearchedText = splitsearchText[0];

			for(var i=1;i<splitsearchText.length;i++){
				toBeSearchedText = toBeSearchedText+"+"+splitsearchText[i];
			}

		}

		/*return  $resource("http://openlibrary.org/search.json?q="+toBeSearchedText+"&has_fulltext=true",{}, 
				{query: {method:'GET', isArray: false}});;*/

		return $resource("http://localhost:8080/books/search/bySubject/"+toBeSearchedText+"/"+pageNo,{},{ call : { method : 'GET',
			isArray: false }});
	};

	this.getReadableLinksFromInternetArchieve = function(query) {
		return  $resource(query+"?callback=JSON_CALLBACK",{}, 
				{query: {method:'jsonp', isArray: false}});;
	};

	this.callReadBook = function(){
		return $resource("http://localhost:9092/web/bySubject",{},{ call : { method : 'POST',
			isArray: false }});
	};

	this.getBookInfo = function(){
		return $resource("http://localhost:8080/books/info/byOlids",{},{call : {method : 'POST', isArray:false}});
	};

	this.advanceBookSearch = function(pageNo){
		return $resource("http://localhost:8080/search/books/"+pageNo,{},{call : {method : 'POST', isArray:false}});
	};

	this.getBookReviews = function(bookId){
		return $resource("http://localhost:8080/book/review?bookId="+bookId,{},{call : {method : 'GET', isArray:false}});
	};
	
	this.insertBookReview = function(){
		return $resource("http://localhost:8080/book/review",{},{call : {method : 'POST', isArray:false}});
	};
	
	this.updateBookReview = function(){
		return $resource("http://localhost:8080/book/review",{},{call : {method : 'PUT', isArray:false}});
	};
	
	this.updateBookReviewComment = function(){
		return $resource("http://localhost:8080/book/review/comment",{},{call : {method : 'PUT', isArray:false}});
	};
	
	this.addBookReviewComment = function(){
		return $resource("http://localhost:8080/book/review/comment",{},{call : {method : 'POST', isArray:false}});
	};
	
	this.insertBookRatings = function(){
		return $resource("http://localhost:8080/book/rating/list",{},{call : {method : 'PUT', isArray:false}});
	};
	
	this.updateBookRating = function(){
		return $resource("http://localhost:8080/book/rating",{},{call : {method : 'PUT', isArray:false}});
	};
	
	this.getBookRatings = function(){
		return $resource("http://localhost:8080/book/rating/list",{},{call : {method : 'POST', isArray:false}});
	};
	
	/*this.createNewShelf = function(){
		return $resource("http://localhost:9090/user/shelf/list",{},{call : {method : 'POST', isArray:false}});
	};*/
	
	this.retrieveUserShelves = function(userId){
		return $resource("http://localhost:9090/user/shelf?userId="+userId,{},{call : {method : 'GET', isArray:false}});
	};
	
	this.createNewShelf = function(){
		return $resource("http://localhost:9090/user/shelf",{},{call : {method : 'POST', isArray:false}});
	};
	this.addBookToShelf = function(){
		return $resource("http://localhost:9090/user/shelf/addbook",{},{call : {method : 'PUT', isArray:false}});
	};
	
	this.removeBookFromShelf = function(){
		return $resource("http://localhost:9090/user/shelf/removebook",{},{call : {method : 'PUT', isArray:false}});
	};
	
	this.deleteShelf = function(){
		return $resource("http://localhost:9090/user/shelf/delete",{},{call : {method : 'PUT', isArray:false}});
	};
	
	this.renameShelf = function(){
		return $resource("http://localhost:9090/user/shelf/rename",{},{call : {method : 'PUT', isArray:false}});
	};
	
});