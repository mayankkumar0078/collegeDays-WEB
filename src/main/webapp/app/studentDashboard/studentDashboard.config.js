var studentDashboardModule = angular.module('studentDashboard', ['library',
    'ui.router','ngAnimate', 'ui.bootstrap','ngFileUpload', 'ngImgCrop']);


studentDashboardModule.config(function config($stateProvider) {
    $stateProvider.state('studentDashboard', {
        url: '/studentDashboard',
        views: {
            "main": {
                controller: 'studentDashboardCtrl',
                templateUrl: 'app/studentDashboard/studentDashboard.tpl.html'
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })
    
.state('studentDashboard.library', {
        url: '/library',
        parent:'studentDashboard',
        views: {
            "libraryView": {
                controller: 'libraryCtrl',
                templateUrl: 'app/library/library.tpl.html',
                
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })

.state('studentDashboard.notes', {
        url: '/notes',
        parent:'studentDashboard',
        views: {
            "libraryView": {
                controller: 'notesCtrl',
                templateUrl: 'app/notes/notes.tpl.html',
                
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })
.state('studentDashboard.notes.all', {
        url: '/all',
        views: {
            "libraryView": {
                controller: 'notesCtrl',
                templateUrl: 'app/notes/allNotes.tpl.html',
                
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })  
 
.state('studentDashboard.notes.yournotes', {
        url: '/yourNotes',
        views: {
            "libraryView": {
                controller: 'notesCtrl',
                templateUrl: 'app/notes/yourNotes.tpl.html',
                
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })
.state('studentDashboard.library.bookDetails', {
        url: '/bookDetails',
        views: {
            "bookDetailsModalView": {
                controller: 'HomeCtrl',
                templateUrl: 'app/home/home.tpl.html'
                
            }
        }
    });
});


