/* notes controller*/
angular.module('notes').controller('notesCtrl',	function notesCtrl($scope, libraryService, blockUI,
						$mdDialog, $mdMedia, $modal, $rootScope, $timeout, $q, $log) {

					var self = this;
					self.simulateQuery = false;
					self.isDisabled = false;
					//self.states = loadAll();
					self.querySearch = querySearch;	
					self.selectedItemChange = selectedItemChange;
					self.searchTextChange = searchTextChange;
					self.newCollege = newCollege;
					function newCollege(college) {
						alert("Sorry! You'll need to create a Constituion for "
								+ college + " first!");
					}

					/**	
					 * Search for states... use $timeout to simulate remote
					 * dataservice call.
					 */
					function querySearch(query) {
						var results = query ? $scope.colleges
								.filter(createFilterFor(query)) : $scope.colleges, deferred;
						if (self.simulateQuery) {
							deferred = $q.defer();
							$timeout(function() {
								deferred.resolve(results);
							}, Math.random() * 1000, false);
							return deferred.promise;
						} else {
							return results;
						}
					}
					function searchTextChange(text) {
						$log.info('Text changed to ' + text);
					}
					function selectedItemChange(item) {
						$log.info('Item changed to ' + JSON.stringify(item));
					}
					/**
					 * Build `states` list of key/value pairs
					 */
				/*	function loadAll() {
						var allColleges = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
						return allStates.split(/, +/g).map(function(state) {
							return {
								value : state.toLowerCase(),
								display : state
							};
						});
					}*/
					/**
					 * Create filter function for a query string
					 */
					function createFilterFor(query) {
						var lowercaseQuery = angular.lowercase(query);
						return function filterFn(college) {
							return (college.collegeFullName.indexOf(lowercaseQuery) === 0);
						};

					}

					//scope objects
					$scope.a = {};
					$scope.a.yourRepositoryIsDisplayed = true;
					//user notes 
					$scope.userNotesDocumentList = [];
					var userNotesDocument = {};
					var userNotesDocumentList = [];
					var notesRepositoryList = [];
					
					var notesRepository = {};
					var notesList = [];
					var notes1= {};
					var notes2= {};
					notes1.collegeName = "SMVDU";
					notes1.branchFullname = "Computer Science";
					notes1.branchShortName = "CSE";
					notes1.semester = "Sem1";
					notes1.subject = "Computer Fundamentals";
					notes1.topic = "How the operating system works";
					notes1.likedBy = [];
					notes1.likes = 4;
					notes1.userComments = []; 
					notes1.files = [];
					notesList.push(notes1);
					
					notes2.collegeName = "IITK";
					notes2.branchFullname = "Electrical";
					notes2.branchShortName = "EE";
					notes2.semester = "Sem2";
					notes2.subject = "Elctric machines";
					notes2.topic = "How to cut the power of machines";
					notes2.likedBy = [];
					notes2.likes = 14;
					notes2.userComments = []; 
					notes2.files = [];
					notesList.push(notes2);
					
					notesRepository.notesList = notesList;
					notesRepository.notesRepositoryName = "Computer Science sem-1";
					notesRepositoryList.push(notesRepository);
					userNotesDocument.notesRepositoryList = notesRepositoryList;
					userNotesDocumentList.push(userNotesDocument);
					$scope.userNotesDocumentList = userNotesDocumentList;
					
					//hard code the filter section data 
					//college types
					$scope.semesters = [{"semesterId":1, "semesterName":"sem1"}];
					$scope.courseTypes = [{"courseTypeId":1, "courseTypeName":"Engineering","noOfYears":4, "noOfSemesters":8}];
					$scope.collegeTypes = [{"collegeTypeId":1, "collegeTypeName":"IIT"},
					                       {"collegeTypeId":2, "collegeTypeName":"Deemed"},
					                       {"collegeTypeId":3, "collegeTypeName":"Private"},
					                       {"collegeTypeId":4, "collegeTypeName":"Govt"}];
					$scope.colleges = [{"collegeId":1, "collegeFullName":"Sri Mata Vaishno Devi University","collegeShortName":"SMVDU", "collegeTypeName":"Deemed"},
					                  {"collegeId":2, "collegeFullName":"Jammu University","collegeShortName":"JU", "collegeTypeName":"Govt"},
					                  {"collegeId":3, "collegeFullName":"IIT Kanpur","collegeShortName":"IITK", "collegeTypeName":"IIT"},
					                  {"collegeId":4, "collegeFullName":"Amity University","collegeShortName":"AU", "collegeTypeName":"Private"},
					                  {"collegeId":5, "collegeFullName":"IIT Mumbai","collegeShortName":"IITM", "collegeTypeName":"IIT"},
					                  {"collegeId":6, "collegeFullName":"Vellore Institute Of Technology","collegeShortName":"VIT", "collegeTypeName":"Deemed"}];
					$scope.branches = [{"branchId":1, "branchFullName":"Computer Science & Engineering", "branchShortName":"CSE", "courseType":"Engineering"},
					                   {"branchId":2, "branchFullName":"Electronics & Communication", "branchShortName":"ECE", "courseType":"Engineering"},
					                   {"branchId":3, "branchFullName":"Mechanical Engineering", "branchShortName":"ME", "courseType":"Engineering"},
					                   {"branchId":4, "branchFullName":"Industrial Bio Technology", "branchShortName":"IBT", "courseType":"Engineering"}];
					
					$scope.subjects = [{"subjectId":1, "subjectFullName":"Computer Fundamentals", "subjectShortName":"CFIT", "courseType":"Engineering"},
					                   {"subjectId":1, "subjectFullName":"Operating System", "subjectShortName":"CFIT", "courseType":"Engineering"},
					                   {"subjectId":1, "subjectFullName":"Computer Fundamentals", "subjectShortName":"CFIT", "courseType":"Engineering"},
					                   {"subjectId":1, "subjectFullName":"Computer Fundamentals", "subjectShortName":"CFIT", "courseType":"Engineering"},
					                   {"subjectId":1, "subjectFullName":"Computer Fundamentals", "subjectShortName":"CFIT", "courseType":"Engineering"}];
					
					//set current user's notes
					//call a service to populate current user notes
					$scope.currentUserNotesDocument = userNotesDocument;
					
					//method : called when user clicks on any of the repository
					$scope.openNotesSection = function(userSelectedNotesRepository) {
						$scope.a.yourRepositoryIsDisplayed = false;
						$scope.selectedRepositoryNotes = userSelectedNotesRepository.notesList;
						$scope.selectedRepository = userSelectedNotesRepository;
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