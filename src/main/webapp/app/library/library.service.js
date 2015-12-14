/**
 * service to get the records from the service
 */
angular.module('collegeDays').
service('libraryService', function($resource) {

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
	
});