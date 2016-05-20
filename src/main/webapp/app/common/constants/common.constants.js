angular.module('collegeDays').
service('CommonConstants', function() {
	
	var constant = this;
	constant.STORAGE_COLLEGE_TYPE="collegeTypeList";
	constant.STORAGE_UNIVERSITY_TYPE="universityTypeList";
	constant.STORAGE_UNIVERSITY="universityList";
	constant.STORAGE_COLLEGE="collegeList";
	constant.STORAGE_DEGREE="degreeList";
	constant.STORAGE_PROGRAM="programList";
	constant.STORAGE_COLLEGE_PROGRAM="collegeProgramList";
	constant.STORAGE_SPECIALISATION="specialisationList";
	constant.STORAGE_PROGRAM_SPECIALISATION="programSpecialisationList";
	constant.STORAGE_COLLEGE_PROGRAM_SPECIALISATION="collegeProgramSpecialisationList";
	constant.STORAGE_SUBJECT="subjectList";
	constant.STORAGE_PROGRAM_SPECIALISATION_SUBJECT="programSpecialisationSubjectList";
});