/**
 * services for storing the college schems related master data
 * This data don't change with user interaction
 */
angular.module('collegeDays').
service('CollegeService', function($resource, $q, SessionUtilService,CommonConstants,CollegeFactory) {

	//college types
	this.getCollegeTypes = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_COLLEGE_TYPE) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/college-type/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_COLLEGE_TYPE, response.collegeTypes);
					return response.collegeTypes;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_COLLEGE_TYPE));
		}
	};
	//university types
	this.getUniversityTypes = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_UNIVERSITY_TYPE) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/university-type/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_UNIVERSITY_TYPE, response.universityTypes);
					return response.universityTypes;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_UNIVERSITY_TYPE));
		}
	};

	//university
	this.getUniversities = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_UNIVERSITY) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/university/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_UNIVERSITY, response.universities);
					return response.universities;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_UNIVERSITY));
		}
	};

	//college
	this.getColleges = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_COLLEGE) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/college/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_COLLEGE, response.colleges);
					return response.colleges;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_COLLEGE));
		}
	};
	//degree
	this.getDegrees = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_DEGREE) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/degree/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_DEGREE, response.degrees);
					return response.degrees;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_DEGREE));
		}
	};

	//program
	this.getPrograms = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_PROGRAM) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/program/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_PROGRAM, response.programs);
					return response.programs;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_PROGRAM));
		}
	};

	//college program
	this.getCollegePrograms = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_COLLEGE_PROGRAM) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/college-program/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_COLLEGE_PROGRAM, response.collegePrograms);
					return response.collegePrograms;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_COLLEGE_PROGRAM));
		}
	};
	//specialisation
	this.getSpecialisations = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_SPECIALISATION) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/specialisation/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_SPECIALISATION, response.specialisations);
					return response.specialisations;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_SPECIALISATION));
		}
	};

	//program specialisation
	this.getProgramSpecialisations = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_PROGRAM_SPECIALISATION) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/program-specialisation/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_PROGRAM_SPECIALISATION, response.programSpecialisations);
					return response.programSpecialisations;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_PROGRAM_SPECIALISATION));
		}
	};

	//college program specialisation
	this.getCollegeProgramSpecialisations = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_COLLEGE_PROGRAM_SPECIALISATION) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/college-program-specialisation/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_COLLEGE_PROGRAM_SPECIALISATION, response.collegeProgramSpecialisations);
					return response.collegeProgramSpecialisations;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_COLLEGE_PROGRAM_SPECIALISATION));
		}
	};
	
	//subject
	this.getSubjects = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_SUBJECT) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/subject/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_SUBJECT, response.subjects);
					return response.subjects;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_SUBJECT));
		}
	};

	//specialisation subject
	this.getProgramSpecialisationSubjects = function(){

		if(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_PROGRAM_SPECIALISATION_SUBJECT) == undefined){
			//call the service to load
			return CollegeFactory.getHttpResponse('GET','http://localhost:8086/program-specialisation-subject/all').then(function(response){
				if(response.status == 200){
					SessionUtilService.saveToSessionStorage(CommonConstants.STORAGE_PROGRAM_SPECIALISATION_SUBJECT, response.programSpecialisationSubjects);
					return response.programSpecialisationSubjects;
				}
			});
		}else{
			return $q.when(SessionUtilService.loadFromSessionStorage(CommonConstants.STORAGE_PROGRAM_SPECIALISATION_SUBJECT));
		}
	};

});