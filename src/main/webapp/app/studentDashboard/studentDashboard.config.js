var libraryModule = angular.module('library', [
    'ui.router','ngAnimate', 'ui.bootstrap','ngFileUpload', 'ngImgCrop']);


libraryModule.config(function config($stateProvider) {
   /* $stateProvider.state('dashboard', {
        url: '/dashboard',
        views: {
            "main": {
                controller: 'StudentDashboardCtrl',
                templateUrl: 'app/studentDashboard/studentDashboard.tpl.html'
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })*/
    
	$stateProvider.state('library', {
        url: '/library',
        views: {
            "main": {
                controller: 'LibraryCtrl',
                templateUrl: 'app/library/library.tpl.html',
                
            }
        },
        data: {pageTitle: 'Library'}
    })

.state('notes', {
        url: '/notes',
        views: {
            "main": {
                controller: 'NotesCtrl',
                templateUrl: 'app/notes/view/notesDisplay.tpl.html',
                
            }
        },
        data: {pageTitle: 'College Notes'}
    })
/*.state('notes.all', {
        url: '/all',
        parent:'notes',
        views: {
            "main": {
                controller: 'NotesCtrl',
                templateUrl: 'app/notes/view/allNotes.tpl.html',
                
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })  
 
.state('notes.mynotes', {
        url: '/mynotes',
        parent: 'notes',
        views: {
            "main": {
                controller: 'NotesCtrl',
                templateUrl: 'app/notes/view/yourNotes.tpl.html',
                
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })*/
.state('library.bookDetails', {
        url: '/bookDetails',
        views: {
            "bookDetailsModalView": {
                controller: 'HomeCtrl',
                templateUrl: 'app/home/home.tpl.html'
                
            }
        }
    });
});


