/**
 * services for handling notes
 */
angular.module('collegeDays').
service('notesService', function($resource) {
	
	this.notes = [];
	this.multiselect={};
	this.getAllNotes = function(){
		return $resource("http://localhost:9090/user/notes/get/all",{},{call : {method : 'POST', isArray:false}});
	};
	this.setNotes = function(notes){
		this.notes = notes;
	};
	this.getNotes = function(){
		return this.notes;
	};
	
	this.setMultiselect = function(multiselect){
		this.multiselect = multiselect;
	};
	this.getMultiselect = function(){
		return this.multiselect;
	};
	this.addNotesToShelf = function(){
		return $resource("http://localhost:9090/user/shelf/add/notes",{},{call : {method : 'PUT', isArray:false}});
	};
	
});