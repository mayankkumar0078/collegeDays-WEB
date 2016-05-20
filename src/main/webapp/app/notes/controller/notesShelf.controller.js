angular.module('notes').controller('notesShelfCtrl', function shelfCtrl($scope, $parse, $rootScope,
		$modal, $mdDialog, $mdMedia, Upload, $timeout, notesService, libraryService){

	$scope.status = ' ';

	/*this method is called when you click the 'Add To Shelf' link button*/
		$scope.addToShelfButtonClick = function(){
			//find out the current shelf for a particular book saved in the db
			if($rootScope.activeNotesRecord != undefined){
				for(var shelfIndex in $rootScope.shelves){
					if($rootScope.shelves[shelfIndex] != undefined && $rootScope.shelves[shelfIndex].notesList != undefined){
						for(var notesIndex in $rootScope.shelves[shelfIndex].notesList){

							var notes = $rootScope.shelves[shelfIndex].notesList[notesIndex];
							if($rootScope.activeNotesRecord != undefined && 
									$rootScope.activeNotesRecord.id == notes.id){
								//select the shelf radio button
								$scope.shelfRadioButtonGroup = $rootScope.shelves[shelfIndex].shelfName;
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
			if(newValue != undefined){
				if(newValue != oldValue){
					//make the service call to save the current book in the selected shelf
					//make the request
					var notes = $rootScope.activeNotesRecord;//setBookObjectFromRecord($rootScope.activeBookRecord);
					notes.id = $rootScope.activeNotesRecord.id;
					var oldShelfName = oldValue;
					var newShelfName = newValue;
					var request = {"userId":$rootScope.loggedInUser.userEmail,
							"notes":notes,
							"oldShelfName":oldShelfName,
							"newShelfName":newShelfName};

					var resource = notesService.addNotesToShelf();
					//make the ajax call 
					resource.call(request).$promise.then(function(response) {
						if(response != undefined && response.status == 200){
							//put the updated book shelves in the root scope..
							$rootScope.shelves = response.userShelfDocument.shelves;
						/*	if(libraryService.getBookShelfClicked()){
								//find out the book shelf from the list of shelves and publish it to the library
								for(var shelfIndex in $rootScope.bookShelves){
									if($rootScope.bookShelves[shelfIndex].shelfName == oldShelfName){
										//publish it to the library service to use it in library controller
										libraryService.setBookShelf($rootScope.bookShelves[shelfIndex]);
										break;
									}
								}
							}*/
						}else{
							alert("Can't process request right now. Please contact administrator for further details");
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
			if(response != undefined && response.status == 200){
				//set the books for the shelf
				$rootScope.shelves = response.userShelfDocument.shelves;
				$scope.shelfErrorMsg = undefined;
			}else if(response != undefined && response.status != 200){
				alert("Can't process request riht now. Please contact administrator for further details");
			}else if(response != undefined && response.status == 200 && response.code != 200){
				//show the warning message to the user
				$scope.shelfErrorMsg = response.message;
			}
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
				if(response != undefined && response.status == 200){
					//set the books for the shelf
					$rootScope.shelves = response.userShelfDocument.shelves;
					//find the current shelf
					for(var shelfIndex in $rootScope.shelves){
						if(bookShelf.shelfName == $rootScope.shelves[shelfIndex].shelfName){
							libraryService.setBookShelf($rootScope.shelves[shelfIndex]);
							//bookShelf.books = shelves[shelfIndex].books;
							break;
						}
					}
				}else if(response != undefined && response.status != 200){
					alert("Can't process request riht now. Please contact administrator for further details");
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
				if(response != undefined && response.status == 200){
					//set the books for the shelf
					$rootScope.shelves = response.userShelfDocument.shelves;
				}else if(response != undefined && response.status != 200){
					alert("Can't process request riht now. Please contact administrator for further details");
				}
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
			if(response != undefined && response.status == 200){
			var shelves = undefined;
			if(response.userShelfDocument != undefined){
				shelves = response.userShelfDocument.shelves;
			}
			if($rootScope.shelves == undefined){
				$rootScope.shelves = [];
			}
			if(shelves != undefined && $rootScope.shelves != undefined){
				//take the latest book shelf from the book shelves and push it to the scope
				var index = shelves.length - 1;
				$rootScope.shelves.push(shelves[index]);

				//publish the shelf created to the library controller
				//libraryService.setUserBookShelves($scope.bookShelves);
			}
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

