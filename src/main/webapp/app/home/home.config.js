/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
var homeModule = angular.module('home', ['ui.router', 'ui.bootstrap','ngDialog'
]);

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
 
homeModule.config(function config($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            views: {
                "main": {
                    controller: 'HomeCtrl',
                    templateUrl: 'app/home/home.tpl.html'
                }
            },
            data: {pageTitle: 'College Days'}
        })
        .state('homePageKnowMore', {
            url: '/bookReadHelp',
            views: {
                "main": {
                    controller: 'readBookHelpCTRL',
                    templateUrl: 'app/help/readBookHelp/readBookHelp.tpl.html'
                }
            },
            data: {pageTitle: 'Online book Read Help'}
        })
        ;
    });



