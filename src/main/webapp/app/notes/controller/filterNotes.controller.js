angular.module('notes').controller('FilterNotesCtrl',	function notesCtrl($scope, libraryService, blockUI,
		$mdDialog, $mdMedia, $modal, $rootScope, $timeout, $q, 
		$log, ngDialog, notesService, SessionUtilService, CommonConstants,
		CollegeService, blockUI) {

	CollegeService.getCollegeTypes().then(function(response){
		$scope.collegeTypes = response;
	});
	CollegeService.getColleges().then(function(response){
		$scope.colleges = response;
		$scope.filteredColleges = $scope.colleges;
	});
	CollegeService.getPrograms().then(function(response){
		$scope.programs = response;
		$scope.filteredPrograms = $scope.programs;
	});
	CollegeService.getCollegePrograms().then(function(response){
		$scope.collegePrograms = response;
		$scope.filteredCollegePrograms = $scope.collegePrograms;
	});

	CollegeService.getSpecialisations().then(function(response){
		$scope.specialisations = response;
		$scope.filteredSpecialisations = $scope.specialisations;
	});
	CollegeService.getProgramSpecialisations().then(function(response){
		$scope.programSpecialisations = response;
	});
	CollegeService.getCollegeProgramSpecialisations().then(function(response){
		$scope.collegeProgramSpecialisations = response;
	});
	
	CollegeService.getSubjects().then(function(response){
		$scope.subjects = response;
		$scope.filteredSubjects = $scope.subjects;
	});
	
	CollegeService.getProgramSpecialisationSubjects().then(function(response){
		$scope.programSpecialisationSubjects = response;
	});
	
	//scope objects
	//var searchCriteria = {};
	//$scope.notes.searchCriteria.collegeIds = [];

	//initially call the notes service to fetch all the notes
	notesService.getAllNotes().call($scope.notes.searchCriteria).$promise.then(function(response){
		blockUI.start();
		if(response.status == 200){
			//set the scope variable
			notesService.setNotes(response);
			blockUI.stop();
		}
	});
	
	$scope.$watch('multiselect.selectedColleges', function (newValue, oldValue){ 
		if (newValue !== oldValue) {

			//if the selected colleges change then we need to trigger the list of programs according to the colleges
			if(oldValue.length > newValue.length){
				//i.e. some values were removed
				removeFromPrograms();
			}else if(oldValue.length < newValue.length){
				//i.e some values added in new list
				addToPrograms();
			}

			//on selection of college refresh the specialisations
			getSpecialisationForCollges();
			//call the service to fetch the notes
			blockUI.start();
		notesService.getAllNotes().call($scope.notes.searchCriteria).$promise.then(function(response){
			if(response.status == 200){
				//set the scope variable
				notesService.setNotes(response);
				blockUI.stop();
			}
		});
		
		//publish multiselect to notes service
		notesService.setMultiselect($scope.multiselect);
		}}, true);

	//this method sets the specialisations based on the colleges selected only
	function getSpecialisationForCollges(){
		$scope.filteredSpecialisations = [];
		$scope.notes.searchCriteria.collegeIds = [];
		if($scope.multiselect.selectedColleges.length == 0){
			$scope.filteredSpecialisations = $scope.specialisations;
		}
		for(var cIndex in $scope.multiselect.selectedColleges){
			//populate the search criteria college Ids
			$scope.notes.searchCriteria.collegeIds.push($scope.multiselect.selectedColleges[cIndex].collegeId);
			for(var cpsIndex in $scope.collegeProgramSpecialisations){
				if($scope.multiselect.selectedColleges[cIndex].collegeId == $scope.collegeProgramSpecialisations[cpsIndex].collegeProgram.college.collegeId){
					$scope.filteredSpecialisations.push($scope.collegeProgramSpecialisations[cpsIndex].specialisation);	
				}
			}
		}
	}
	function addToPrograms(){
		//initialise the filtered program
		$scope.filteredPrograms = [];  

		for(var collegeIndex in $scope.multiselect.selectedColleges){
			for(var collegeProgramIndex in $scope.collegePrograms){
				if($scope.collegePrograms[collegeProgramIndex].college.collegeId == $scope.multiselect.selectedColleges[collegeIndex].collegeId){
					//add all the programs
					if($scope.filteredPrograms.indexOf($scope.collegePrograms[collegeProgramIndex].program) < 0)
						$scope.filteredPrograms.push($scope.collegePrograms[collegeProgramIndex].program);
				}
			}
		}
	}

	function removeFromPrograms(){
		if($scope.multiselect.selectedColleges.length == 0){
			$scope.filteredPrograms = $scope.programs;  
		}else{
			//initialise filtered programs
			$scope.filteredPrograms = [];
			for(var collegeIndex in $scope.multiselect.selectedColleges){
				for(var collegeProgramIndex in $scope.collegePrograms){
					if($scope.collegePrograms[collegeProgramIndex].college.collegeId == $scope.multiselect.selectedColleges[collegeIndex].collegeId){
						console.log('college program id: '+$scope.collegePrograms[collegeProgramIndex].program.programId
								+'name: '+$scope.collegePrograms[collegeProgramIndex].program.programCode
								+'.......... index: '+$scope.filteredPrograms.indexOf($scope.collegePrograms[collegeProgramIndex].program));
						//add all the programs
						//if($scope.filteredPrograms.indexOf($scope.collegePrograms[collegeProgramIndex].program) < 0)
						$scope.filteredPrograms.push($scope.collegePrograms[collegeProgramIndex].program);
					}
				}
			}
		}
	}

	//method : toggle check box for college type
	$scope.toggleCollegeTypeCheckBox = function (item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) {
			list.splice(idx, 1);
			//if there is no college type selected then show all colleges 
			if(list.length == 0){
				$scope.filteredColleges = $scope.colleges;  
			}else{
				//filter colleges by college types 
				$scope.filteredColleges = filterListById($scope.filteredColleges, item.collegeTypeId, 'collegeTypeId');
			}
		}
		else {
			list.push(item);
			$scope.filteredColleges = addItemToList($scope.filteredColleges, $scope.colleges, item.collegeTypeId, 'collegeTypeId');
		}
	};

	//method : toggle check box for college programs
	$scope.toggleProgramCheckBox = function (item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) {
			list.splice(idx, 1);
			//if there is no college program selected then show all subjects 
			/*if(list.length == 0){
				$scope.filteredSubjects = $scope.subjects;  
			}*/
		}
		else {
			list.push(item);
			//$scope.filteredSubjects = addItemToList($scope.filteredSubjects, $scope.subjects, item.collegeProgramId, 'collegeProgramId');
		}
	};

	//put watch on selected programs and manipulate specialisation
	$scope.$watch('multiselect.selectedPrograms', function(newValue, oldValue){
		if(newValue != undefined && oldValue != undefined && newValue != oldValue){
			//check if the college was selected or not
			//if selected then populate from college program specialisations list
			$scope.filteredSpecialisations = [];
			if($scope.multiselect.selectedColleges != undefined && $scope.multiselect.selectedColleges.length > 0
					&& $scope.multiselect.selectedPrograms.length > 0){

				for(var cIndex in $scope.multiselect.selectedColleges){
					for(pIndex in $scope.multiselect.selectedPrograms){

						for(var cpsIndex in $scope.collegeProgramSpecialisations){
							if($scope.multiselect.selectedColleges[cIndex].collegeId == $scope.collegeProgramSpecialisations[cpsIndex].collegeProgram.college.collegeId
									&& $scope.collegeProgramSpecialisations[cpsIndex].collegeProgram.program.programId == $scope.multiselect.selectedPrograms[pIndex].programId){
								$scope.filteredSpecialisations.push($scope.collegeProgramSpecialisations[cpsIndex].specialisation);	
							}
						}
					}

				}

			}else if($scope.multiselect.selectedPrograms.length > 0){
				for(var programIndex in $scope.multiselect.selectedPrograms){
					//loop through the program specialisations and set into the filtered specialisations
					for(var specIndex in $scope.programSpecialisations){
						if($scope.programSpecialisations[specIndex].program.programId == $scope.multiselect.selectedPrograms[programIndex].programId){
							$scope.filteredSpecialisations.push($scope.programSpecialisations[specIndex].specialisation);
						}
					}
				}

			}else if($scope.multiselect.selectedPrograms.length == 0 && $scope.multiselect.selectedColleges.length == 0){
				$scope.filteredSpecialisations = $scope.specialisations;
			}else if($scope.multiselect.selectedPrograms.length == 0 && $scope.multiselect.selectedColleges.length > 0){
				getSpecialisationForCollges();
			}
			//populate the search criteria for programs
			$scope.notes.searchCriteria.programIds = [];
			for(var index in $scope.multiselect.selectedPrograms){
				$scope.notes.searchCriteria.programIds.push($scope.multiselect.selectedPrograms[index].programId);
			}
			//call the service to get the notes
			notesService.getAllNotes().call($scope.notes.searchCriteria).$promise.then(function(response){
				if(response.status == 200){
					//set the scope variable
					notesService.setNotes(response);
				}
			});
			//publish multiselect to notes service
			notesService.setMultiselect($scope.multiselect);
		}
	}, true);

	//watch specialisation
	$scope.$watch('multiselect.selectedSpecialisations',function(newValue, oldValue){
		if(oldValue != undefined && newValue != undefined && newValue != oldValue){
			//prepare the search criteria
			$scope.notes.searchCriteria.specialisationIds = [];
			for(var index in $scope.multiselect.selectedSpecialisations){
				$scope.notes.searchCriteria.specialisationIds.push($scope.multiselect.selectedSpecialisations[index].specialisationId);
			}
			//call the service to get the notes
			notesService.getAllNotes().call($scope.notes.searchCriteria).$promise.then(function(response){
				if(response.status == 200){
					//set the scope variable
					notesService.setNotes(response);
				}
			});
			//publish multiselect to notes service
			notesService.setMultiselect($scope.multiselect);
		}
	}, true);
	
	//watch specialisation
	$scope.$watch('multiselect.selectedSubjects',function(newValue, oldValue){
		if(oldValue != undefined && newValue != undefined && newValue != oldValue){
			//prepare the search criteria
			$scope.notes.searchCriteria.subjectIds = [];
			for(var index in $scope.multiselect.selectedSubjects){
				$scope.notes.searchCriteria.subjectIds.push($scope.multiselect.selectedSubjects[index].subjectId);
			}
			//call the service to get the notes
			notesService.getAllNotes().call($scope.notes.searchCriteria).$promise.then(function(response){
				if(response.status == 200){
					//set the scope variable
					notesService.setNotes(response);
				}
			});
			//publish multiselect to notes service
			notesService.setMultiselect($scope.multiselect);
		}
	}, true);
	
	//mehtod : filter subjects
	$scope.filterSubjects = function(){
		$scope.filteredSubjects = [];
		//when there are selected programs but no specialisations
		if($scope.multiselect.selectedPrograms != undefined && $scope.multiselect.selectedPrograms.length > 0
		   && $scope.multiselect.selectedSpecialisations.length == 0){
			
			for(var pIndex in $scope.multiselect.selectedPrograms){
				for(var pssIndex in $scope.programSpecialisationSubjects){
					if($scope.multiselect.selectedPrograms[pIndex].programId == 
					   $scope.programSpecialisationSubjects[pssIndex].programSpecialisation.program.programId){
						
						//push to filter subject
						$scope.filteredSubjects.push($scope.programSpecialisationSubjects[pssIndex].subject);
					}
				}
			}
		}
		//when only specialisation are selected
		else if($scope.multiselect.selectedPrograms.length == 0
				&& $scope.multiselect.selectedSpecialisations.length > 0){
			
			for(var sIndex in $scope.multiselect.selectedSpecialisations){
				for(var pssIndex in $scope.programSpecialisationSubjects){
					if($scope.multiselect.selectedSpecialisations[sIndex].specialisationId == 
					   $scope.programSpecialisationSubjects[pssIndex].programSpecialisation.specialisation.specialisationId){
						
						//push to filter subject
						$scope.filteredSubjects.push($scope.programSpecialisationSubjects[pssIndex].subject);
					}
				}
			}
		}
		//when both program and specialisation are selected
		else if($scope.multiselect.selectedPrograms.length > 0
				&& $scope.multiselect.selectedSpecialisations.length > 0){
			for(var pIndex in $scope.multiselect.selectedPrograms){
				
				for(var sIndex in $scope.multiselect.selectedSpecialisations){
					for(var pssIndex in $scope.programSpecialisationSubjects){
						if($scope.multiselect.selectedSpecialisations[sIndex].specialisationId == 
						   $scope.programSpecialisationSubjects[pssIndex].programSpecialisation.specialisation.specialisationId
						   && $scope.multiselect.selectedPrograms[pIndex].programId == 
							   $scope.programSpecialisationSubjects[pssIndex].programSpecialisation.program.programId){
							
							//push to filter subject
							$scope.filteredSubjects.push($scope.programSpecialisationSubjects[pssIndex].subject);
						}
					}
				}
				
			}
			
		}
	};
	
	//method : this method filters the data from a collection based on some id
	function  filterListById(list, id, idName){
		for(var index in list){
			if(list[index][idName] == id){
				list.splice(index, 1);
			}  
		};
		return list;
	}

	function addItemToList(tobeFilteredList, mainList, id, idName){
		if(tobeFilteredList.length == mainList.length){
			tobeFilteredList = [];
		}
		for(var index in mainList){
			if(mainList[index][idName] == id){
				tobeFilteredList.push(mainList[index]);
			}
		}
		return tobeFilteredList;
	}
	$scope.exists = function (item, list) {
		return list.indexOf(item) > -1;
	};

	$scope.showHeaderFilterLabels = true;
	$scope.hideFilterLabels = function(){
		$scope.showHeaderFilterLabels = false;
	};
});