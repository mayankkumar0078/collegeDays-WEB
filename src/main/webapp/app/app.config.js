// Declare app level module which depends on controllers, services, directives and filters module.
var module = angular.module('collegeDays',['home','library', 'ui.router','blockUI','notes',
                                           'ui.bootstrap','ngResource','awesome-rating','ngDialog','infinite-scroll'
                                           ,'nsPopover','xeditable','angularSpinner','ui.select','ngFileUpload']);

module.run(function(editableOptions) {
	  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
	});

module.config(function(blockUIConfig,$stateProvider, $urlRouterProvider){
	blockUIConfig.message = 'Please wait.. !';
	blockUIConfig.autoBlock = false;
	$urlRouterProvider.otherwise('/home');
});

module.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setTheme('bigPurple', {color: 'purple', radius: 20});
    usSpinnerConfigProvider.setTheme('smallPurple', {color: 'purple', radius: 6});
}]);
