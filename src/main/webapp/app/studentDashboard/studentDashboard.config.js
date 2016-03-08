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
            "": {
                controller: 'libraryCtrl',
                templateUrl: 'app/library/library.tpl.html',
                
            }
        },
        data: {pageTitle: 'Student Dashboard'}
    })

.state('studentDashboard.shelf', {
        url: '/shelf',
        parent:'studentDashboard',
        views: {
            "": {
                controller: 'shelfCtrl',
                templateUrl: 'app/shelf/shelf.tpl.html',
                
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


