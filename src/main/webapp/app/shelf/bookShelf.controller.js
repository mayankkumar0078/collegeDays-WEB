angular.module('studentDashboard').controller('shelfCtrl', function shelfCtrl($scope, $parse, 
		$modal, $mdDialog, $mdMedia, Upload, $timeout){

	$scope.bookShelves = [
	                      {'shelfName':'maths','books':[
	                                                    {'bookId':'100','title':'title1', 'cover':'assets/img/notes/note1.jpg'}
	                                                    ,{'bookId':'100','title':'title1', 'cover':'assets/img/notes/note1.jpg'}
	                                                    ,{'bookId':'100','title':'title1', 'cover':'assets/img/notes/note1.jpg'}
	                                                    ,{'bookId':'100','title':'title1', 'cover':'assets/img/notes/note1.jpg'}
	                                                    ,{'bookId':'100','title':'title1', 'cover':'assets/img/no_books_preview/no_image.jpg'}
	                                                    ,{'bookId':'100','title':'title1', 'cover':'assets/img/no_books_preview/no_image.jpg'}


	                                                    ]}, 
	                                                    ,{'shelfName':'biology','books':[{'bookId':'100','title':'title1', 'cover':'assets/img/no_books_preview/no_image.jpg'}]}
	                                                    ,{'shelfName':'chemistry','books':[{'bookId':'100','title':'title1', 'cover':'assets/img/no_books_preview/no_image.jpg'}]}
	                                                    ,{'shelfName':'science','books':[{'bookId':'100','title':'title1', 'cover':'assets/img/no_books_preview/no_image.jpg'}]},
	                                                    {'shelfName':'maths','books':[
	                                                                                  {'bookId':'100','title':'title1', 'cover':'assets/img/no_books_preview/no_image.jpg'}
	                                                                                  ,{'bookId':'100','title':'title1', 'cover':'assets/img/no_books_preview/no_image.jpg'}

	                                                                                  ]}
	                                                    ];
	
	$scope.status = ' ';
	var rowIndex = 0;
	var booksInShelfSlides = [];

	$scope.showBooksInFirstRow = function(index){
		if(index == 0){

			//$scope.isCollapsed0 = false;
			$scope.booksInShelfSlides = $scope.bookShelves[0].books;
		}else{

			//var collapseString = 'isCollapsed'+index;
			// Get the model
			//var model = $parse(collapseString);
			//var isCollapsed = $scope.$eval(collapseString);

			// Assigns a value to it
			//model.assign($scope, true);
		}
	};

	$scope.showShelfBooks = function(bookShelf, index){

		rowIndex = index;
		//var collapseString = 'isCollapsed'+index;
		// Get the model
		//var model = $parse(collapseString);
		//var isCollapsed = $scope.$eval(collapseString);

		// Assigns a value to it
		//model.assign($scope, !isCollapsed);

		//assign the books for the book shelf
		booksInShelfSlides = [];
		if(bookShelf != null && bookShelf.books!=null){

				
				$scope.booksInShelfSlides = bookShelf.books;

		}
	};

	/*$scope.getBookSlides = function(index){
		return booksInShelfSlides[index];
	};*/

/*	$scope.getSecondIndex = function(index)
	{
		if(booksInShelfSlides[rowIndex] !=null){
			if(index-booksInShelfSlides[rowIndex].length>=0){
				return index-booksInShelfSlides[rowIndex].length;
			}
			else{
				//console.log('Row index: '+ rowIndex+' Index: '+index);
				return index;
			}
		};
	};*/
	
	$scope.renameShelf = function(){
		 $mdDialog.show(
			      $mdDialog.alert()
			        .title('You clicked Rename!')
			        /*.textContent('You clicked the menu item at index ' + index)*/
			        .ok('Nice')
			    );
	};
	
	$scope.deleteShelf = function(event){
		  var confirm = $mdDialog.confirm()
	      .content('<strong>Do You Want To Delete This Shelf ?</strong>')
	      .ariaLabel('Lucky day')
	      .cancel('No')
	      .ok('Yes')
	      
	      .targetEvent(event);
		  
		  $mdDialog.show(confirm).then(function() {
			  //make the ajax call to delete the shelf
			  
		    }, function() {
		     //if no button is clicked in dialog then do nothing
		    	
		    });
	};
	
	  $scope.uploadShelfImage = function(event, bookShelf) {
		    $mdDialog.show({
		      controller: DialogController,
		      templateUrl: 'shelf/imageUpload.tpl.html',
		      parent: angular.element(document.body),
		      targetEvent: event,
		      clickOutsideToClose:true,
		      /*fullscreen: $mdMedia('sm') && $scope.customFullscreen*/
		    })
		    .then(function(upload) {
		    	if(upload!=null || upload != undefined){
		    		
		    	
		    	bookShelf.cover = upload;
		    	bookShelf.shelfName = bookShelf.shelfName+'mm';
		    	}
		     // $scope.digest();
		    }, function() {
		     // $scope.status = 'You cancelled the dialog.';
		    });
		    $scope.$watch(function() {
		      return $mdMedia('sm');
		    }, function(sm) {
		     // $scope.customFullscreen = (sm === true);
		    });
		  };
	
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
	
	function DialogController($scope, $mdDialog) {
		
	    $scope.upload = function (upload) {
	    	$scope.status = 'dataUrl';
	        Upload.upload({
	            url: 'http://localhost:8080/test',
	            method:'POST',
	            data: {
	                file: Upload.dataUrltoBlob(dataUrl)
	            },
	        }).then(function (response) {
	            $timeout(function () {
	                $scope.result = response.data;
	            });
	        }, function (response) {
	            if (response.status > 0) $scope.errorMsg = response.status 
	                + ': ' + response.data;
	        }, function (evt) {
	            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
	        });
	    };
		
		
	    $scope.hide = function() {
	        $mdDialog.hide();
	      };

	      $scope.cancel = function() {
	        $mdDialog.cancel();
	      };

	      $scope.upload = function(upload) {
	        $mdDialog.hide(upload);
	      };
	};
	
	

});

