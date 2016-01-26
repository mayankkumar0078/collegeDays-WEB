angular.module('studentDashboard').controller('shelfCtrl', function shelfCtrl($scope, $parse, 
		$modal, $mdDialog, $mdMedia, Upload, $timeout, libraryService){

	//watch for the change in the list of book shelves changing from other controllers [libraryController]
	  $scope.$watch(function () { return libraryService.getUserBookShelves(); }, 
		  		function (newValue, oldValue) {
		        if (newValue !== oldValue) {
		        	$scope.bookShelves = newValue.bookShelves;
		        }
		        
		    });
	  
	$scope.bookShelves = [
	                      {'shelfName':'maths','books':[
	                                                    {'bookId':'100','title':'title1', 'cover':'assets/img/notes/note1.jpg'}
	                                                    ,{'bookId':'100','title':'title2', 'cover':'assets/img/notes/note1.jpg'}
	                                                    ,{'bookId':'100','title':'title3', 'cover':'assets/img/notes/note1.jpg'}
	                                                    ,{'bookId':'100','title':'title4', 'cover':'assets/img/notes/note1.jpg'}
	                                                    ,{'bookId':'100','title':'title5', 'cover':'assets/img/no_books_preview/no_image.jpg'}
	                                                    ,{'bookId':'100','title':'title6', 'cover':'assets/img/no_books_preview/no_image.jpg'}
	                                                    ]} 
	                                                    ,{'shelfName':'biology','books':[{'bookId':'100','title':'title7', 'cover':'assets/img/no_books_preview/no_image.jpg'}]}
	                                                    ,{'shelfName':'chemistry','books':[{'bookId':'100','title':'title8', 'cover':'assets/img/no_books_preview/no_image.jpg'}]}
	                                                    ,{'shelfName':'science','books':[{'bookId':'100','title':'title9', 'cover':'assets/img/no_books_preview/no_image.jpg'}]},
	                                                    {'shelfName':'fiction','books':[
	                                                                                  {'bookId':'100','title':'title10', 'cover':'assets/img/no_books_preview/no_image.jpg'}
	                                                                                  ,{'bookId':'100','title':'title11', 'cover':'assets/img/no_books_preview/no_image.jpg'}

	                                                                                  ]}
	                                                    ];
	
	//share user book shelves to other controllers like [library controller]
	libraryService.setUserBookShelves($scope.bookShelves);

	$scope.status = ' ';
	$scope.showBooksInFirstRow = function(index){
		if(index == 0){
			$scope.booksInShelfSlides = $scope.bookShelves[0].books;
		}else{

		}
	};

	$scope.showShelfBooks = function(bookShelf, index){

		rowIndex = index;

		//assign the books for the book shelf
		booksInShelfSlides = [];
		if(bookShelf != null && bookShelf.books!=null){
			//share the clicked book shelf to the library controller 
			libraryService.setBookShelf(bookShelf);
			//share the shelf clicked to controllers
			libraryService.setBookShelfClicked(true);
		}
	};

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
			templateUrl: 'app/shelf/imageUpload.tpl.html',
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

