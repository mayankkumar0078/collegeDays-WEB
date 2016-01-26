var libraryModule = angular.module('library', [
    'ui.router', 'ui.bootstrap','ngAnimate','ngMaterial'
]);

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
 
/*libraryModule.config(function config($stateProvider) {
        $stateProvider.state('library', {
            url: '/library',
            views: {
                "studentPage": {
                    controller: 'libraryCtrl',
                    templateUrl: 'app/library/library.tpl.html',
                    parent : 'studentDashboard'
                }
            },
            data: {pageTitle: 'Home Page - Sample Tool'}
        });
    });*/

