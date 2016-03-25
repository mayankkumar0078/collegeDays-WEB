angular.module('studentDashboard').controller('shelfCtrl', function shelfCtrl($scope, $parse, $rootScope,
		$modal, $mdDialog, $mdMedia, Upload, $timeout, libraryService){

	$scope.status = ' ';
	
	/*this method is called when you click the 'Add To Shelf' link button*/
	$scope.addToShelfButtonClick = function(){
		//find out the current shelf for a particular book saved in the db
		if($rootScope.activeBookRecord != undefined){
			for(var shelfIndex in $rootScope.bookShelves){
				if($rootScope.bookShelves[shelfIndex] != undefined && $rootScope.bookShelves[shelfIndex].books != undefined){
					for(var bookIndex in $rootScope.bookShelves[shelfIndex].books){

						var book = $rootScope.bookShelves[shelfIndex].books[bookIndex];
						if($rootScope.activeBookRecord != undefined && 
								$rootScope.activeBookRecord.ia[0] == book.bookId){
							//select the shelf radio button
							$scope.shelfRadioButtonGroup = $rootScope.bookShelves[shelfIndex].shelfName;
							break;
						}
					}
				}
			}
		}
		
	};
/*This method is called when you click on the radio button*/
	$scope.shelfRadioButtonClicked = function(){
		$scope.isShelfRadioButtonClicked = true;
	};
	
		/*Watch the shelf radio button clicked and save it to the db*/
	$scope.$watch('shelfRadioButtonGroup', function (newValue, oldValue) {
		if($scope.isShelfRadioButtonClicked){
			$scope.isShelfRadioButtonClicked = false;
		if(newValue != undefined && oldValue != undefined){
			if(newValue != oldValue){
				//make the service call to save the current book in the selected shelf
				//make the request
				var book = $rootScope.activeBookRecord;//setBookObjectFromRecord($rootScope.activeBookRecord);
				book.bookId = $rootScope.activeBookRecord.ia[0];
				var oldShelfName = oldValue;
				var newShelfName = newValue;
				var request = {"userId":$rootScope.loggedInUser.userEmail,
								"book":book,
								"oldShelfName":oldShelfName,
								"newShelfName":newShelfName};
				
				var resource = libraryService.addBookToShelf();
				//make the ajax call 
				resource.call(request).$promise.then(function(response) {
					if(response.developerMessage == undefined){
						//put the updated book shelves in the root scope..
						$rootScope.bookShelves = response.userShelfDocument.shelves;
						if(libraryService.getBookShelfClicked){
							//find out the book shelf from the list of shelves and publish it to the library
							for(var shelfIndex in $rootScope.bookShelves){
								if($rootScope.bookShelves[shelfIndex].shelfName == oldShelfName){
									//publish it to the library service to use it in library controller
									libraryService.setBookShelf($rootScope.bookShelves[shelfIndex]);
									break;
								}
							}
						}
					}
					
				},
				function(error) {
				}
				);
				
			}
		}
	}
	});
	
	/*This method is called when you click on any of the shelf link left side of page*/
	//This pushes the shelf to the library service
	$scope.showShelfBooks = function(bookShelf, index){
		rowIndex = index;
		//assign the books for the book shelf
		booksInShelfSlides = [];
		if(bookShelf != null){
			//share the clicked book shelf to the library controller 
			libraryService.setBookShelf(bookShelf);
			//share the shelf clicked to controllers
			libraryService.setBookShelfClicked(true);
		}
	};

	var oldBookShelfName = '';
	$scope.setOldShelfToScope = function(bookShelfName){
		oldBookShelfName = bookShelfName;	
	};
	
	$scope.renameShelf = function(bookShelf, shelfIndex){
		var request = {};
		request.userId = $rootScope.loggedInUser.userEmail;
		request.oldShelfName = oldBookShelfName;
		request.newShelfName = bookShelf.shelfName;
	
		//make the ajax call to delete the shelf
		var resource = libraryService.renameShelf();
		//make the ajax call 
		resource.call(request).$promise.then(function(response) {
			//set the books for the shelf
			$rootScope.bookShelves = response.userShelfDocument.shelves;
		}, function error(){ });
	};

	$scope.deleteBookFromShelf = function(event, record){
		var confirm = $mdDialog.confirm()
		.content('<strong>Do You Want To Delete This Book ?</strong>')
		.ariaLabel('Lucky day')
		.cancel('No')
		.ok('Yes')

		.targetEvent(event);

		$mdDialog.show(confirm).then(function() {
			//get the book shelf clicked
			var bookShelf = libraryService.getBookShelf();
			
			//get the books from the book shelf
			var books = bookShelf.books;
			//loop through the books and delete the record from the books
			var request = {};
			request.userId = $rootScope.loggedInUser.userEmail;
			request.bookId = record.bookId;
			request.shelfName = bookShelf.shelfName;
		
			//make the ajax call to delete the shelf
			var resource = libraryService.removeBookFromShelf();
			//make the ajax call 
			resource.call(request).$promise.then(function(response) {
				//set the books for the shelf
				$rootScope.bookShelves = response.userShelfDocument.shelves;
				//find the current shelf
				for(var shelfIndex in $rootScope.bookShelves){
					if(bookShelf.shelfName == $rootScope.bookShelves[shelfIndex].shelfName){
						libraryService.setBookShelf($rootScope.bookShelves[shelfIndex]);
						//bookShelf.books = shelves[shelfIndex].books;
						break;
					}
				}
				
			}, function error(){ });
		}, function() {
			//if no button is clicked in dialog then do nothing

		});
	};
	
	//This deletes the shelf from the rack of shelves for the user
	$scope.deleteShelf = function(bookShelf, event){
		
		var confirm = $mdDialog.confirm()
		.content('<strong>Do You Want To Delete This Shelf ? \nAll Books will be lost...</strong>')
		.ariaLabel('Lucky day')
		.cancel('No')
		.ok('Yes')
		.targetEvent(event);

		$mdDialog.show(confirm).then(function() {
			//make the ajax call to delete the shelf

			var request = {"userId":$rootScope.loggedInUser.userEmail,
						    "shelfName":bookShelf.shelfName};
			
			//ajax call
			var resource = libraryService.deleteShelf();
			resource.call(request).$promise.then(function(response) {
				//set the books for the shelf
				$rootScope.bookShelves = response.userShelfDocument.shelves;
				
			}, function error(){ });
			
			
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

	//create new shelf
	$scope.createNewShelf = function(){
		var user = {"userId":$rootScope.loggedInUser.userEmail,
				"userName":$rootScope.loggedInUser.userName};
		var request = {"user":user, "shelfName" : $scope.newShelfName};
		var resource = libraryService.createNewShelf();
		resource.call(request).$promise.then(function(response){
			var bookShelves = undefined;
			if(response.userShelfDocument != undefined){
				bookShelves = response.userShelfDocument.shelves;
			}
			if($rootScope.bookShelves == undefined){
				$rootScope.bookShelves = [];
			}
			if(bookShelves != undefined && $rootScope.bookShelves != undefined){
				//take the latest book shelf from the book shelves and push it to the scope
				var index = bookShelves.length - 1;
				$rootScope.bookShelves.push(bookShelves[index]);

				//publish the shelf created to the library controller
				//libraryService.setUserBookShelves($scope.bookShelves);
			}
		},
		function error(){

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

