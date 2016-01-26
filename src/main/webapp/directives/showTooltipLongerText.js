var app = angular.module('collegeDays');

app.directive('showTooltip', function() {
    var MAX_SIZE = 0;
    return {
        restrict: 'A',
        scope: { label: '=showTooltip' },
        link: function (scope, element, attrs) {  
        	MAX_SIZE = attrs.width;
            if ((scope.label || '').length > MAX_SIZE) {                
                element.text(scope.label.substring(0, MAX_SIZE)+'...');
                element.attr('title', scope.label);                
            } else {
                element.text(scope.label);
            }
        }
    };
});