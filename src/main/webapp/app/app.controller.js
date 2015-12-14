angular.module('collegeDays')

    .controller('AppCtrl', function AppCtrl($scope, blockUI) {
        "use strict";

        $scope.test="Test Inputb Box";
        $scope.$on('$stateChangeSuccess', function (event, toState) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle;
            }
        });
    });