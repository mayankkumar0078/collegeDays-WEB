/* notes controller*/
angular.module('notes').controller('NotesCtrl',	function notesCtrl($scope, libraryService, blockUI,
		$mdDialog, $mdMedia, $modal, $rootScope, $timeout, $q, $log, ngDialog, notesService) {

	//scope objects

	$scope.a = {};
	$scope.a.yourRepositoryIsDisplayed = true;

	$scope.showCollegeTypeSection = true;
	$scope.showCollegeSection = true;
	$scope.showProgramSection = true;
	$scope.showSpecialisationSection = true;
	$scope.showSubjectSection = true;
	$scope.showSemesterSection = true;

	$scope.multiselect = {};
	$scope.multiselect.selectedCollegeTypes = [];
	$scope.multiselect.selectedColleges = [];
	//$scope.multiselect.selectedColleges = [];
	$scope.multiselect.selectedSpecialisations = [];
	//$scope.multiselect.selectedSpecialisations = [];
	$scope.multiselect.selectedPrograms = [];
	$scope.multiselect.selectedSubjects = [];



	$scope.notes = {};
	$scope.notes.count = 0;
	$scope.notes.notesList = [];
	$scope.notes.searchCriteria = {};
	$scope.notes.searchCriteria.pageSize = 10;
	$scope.notes.searchCriteria.pageNo = 1;
	
	$scope.shelfRadioButtonGroup = "";

	$scope.$watch(function () { return notesService.getNotes(); }, 
			function (newValue, oldValue) {
		if(newValue != undefined && oldValue != undefined && newValue != oldValue){
			$scope.notes.notesList = newValue.notesList;
			$scope.notes.count = newValue.count;
		}
	});

	$scope.$watch(function () { return notesService.getMultiselect(); }, 
			function (newValue, oldValue) {
		if(newValue != undefined && oldValue != undefined && newValue != oldValue){
			$scope.multiselect = newValue;
		}
	});

	$scope.removeCollegeCriteria = function(college){
		//remove the selected college form $scope.multiselect.selectedColleges
		for(var index in $scope.multiselect.selectedColleges){
			if($scope.multiselect.selectedColleges[index].collegeId == college.collegeId){
				$scope.multiselect.selectedColleges.splice(index, 1);
			}
		}
	};
	$scope.removeProgramCriteria = function(program){
		//remove the selected college form $scope.multiselect.selectedColleges
		for(var index in $scope.multiselect.selectedPrograms){
			if($scope.multiselect.selectedPrograms[index].programId == program.programId){
				$scope.multiselect.selectedPrograms.splice(index, 1);
			}
		}
	};
	$scope.removeSpecialisationCriteria = function(specialisation){
		//remove the selected college form $scope.multiselect.selectedColleges
		for(var index in $scope.multiselect.selectedSpecialisations){
			if($scope.multiselect.selectedSpecialisations[index].specialisationId == specialisation.specialisationId){
				$scope.multiselect.selectedSpecialisations.splice(index, 1);
			}
		}
	};
	$scope.removeSubjectCriteria = function(subject){
		//remove the selected college form $scope.multiselect.selectedColleges
		for(var index in $scope.multiselect.selectedSubjects){
			if($scope.multiselect.selectedSubjects[index].subjectId == subject.subjectId){
				$scope.multiselect.selectedSubjects.splice(index, 1);
			}
		}
	};

	$scope.addNotesInPage = function(){
		if($scope.notes.notesList.length < $scope.notes.count){
			console.log('Called............');
			//increment the page from current
			notesService.getAllNotes().call($scope.notes.searchCriteria).$promise.then(function(response){
				if(response.status == 200){
					$scope.notes.notesList = $scope.notes.notesList.concat(response.notesList);
					$scope.notes.searchCriteria.pageNo++;
				}
			});
		}
	};
	
	//set the active record to use it in different controllers
	$scope.saveActiveNotesRecord = function(record){
		$rootScope.activeNotesRecord = record;
	};
	
	//variables
	$scope.showCreateNewShelf = true;
	
	
	 $scope.showCreateNewShelfTextBox = function(){
		  $scope.showCreateNewShelf = false;
	  };
	  
	  $scope.enableCreateNewShelfLink = function(){
		  $scope.showCreateNewShelf = true;
	  };
	
	  //check if the shelves have been loaded.
	  if($rootScope.shelves == undefined && $rootScope.loggedInUser != undefined){
		  //get the note shelves for the user on page load
		  var shelfResource = libraryService.retrieveUserShelves($rootScope.loggedInUser.userEmail);
		  shelfResource.call().$promise.then(function(response) {
			  if(response != undefined && response.status == 200 && response.userShelfDocument != undefined){
				  $rootScope.shelves = response.userShelfDocument.shelves; 
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
	  }
	

	//method : called when user clicks on any of the repository
	$scope.openNotesSection = function(userSelectedNotesRepository) {
		$scope.a.yourRepositoryIsDisplayed = false;
		$scope.selectedRepositoryNotes = userSelectedNotesRepository.notesList;
		$scope.selectedRepository = userSelectedNotesRepository;
	};

	$scope.publishNotes = function(ev){

		$mdDialog.show({
			controller: 'publishNotesCtrl',
			templateUrl: 'publishNotes.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
		})
		.then(function(answer) {
			console.log('answer is: '+answer);
		}, function() {
			console.log('error answer is: '+answer);
		});

	};
	//method : called when clicked on the back button on your notes page
	$scope.backToRepository = function(){
		$scope.a.yourRepositoryIsDisplayed = true;
	};
	//method : create new notes repository
	$scope.createNewNotesRepository = function(ev) {
		$mdDialog.show({
			controller: notesRepoDialogCtrl,
			templateUrl: 'enterRepositoryNameDialog.tmpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
		})
		.then(function(answer) {
			console.log('answer is: '+answer);
		}, function() {
			console.log('error answer is: '+answer);
		});
	};

	//method : make an array
	$scope.makeList = function(value){
		return new Array(value);

	};
});
//controller: notes repository dialog controller
function notesRepoDialogCtrl($scope, $mdDialog) {
	$scope.userNotesRepository = {name:""};
	$scope.enterNotesRepoHint = true;
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}