var homeModule = angular.module('home');

homeModule.controller('menuCtrl', function menuCtrl($scope, $parse, $modal, loginService, 
		$location, ngDialog,$timeout) {
	
	
	   $scope.hidden = false;
	   $scope.isOpen = false;
	   $scope.hover = false;

	      // On opening, add a delayed property which shows tooltips after the speed dial has opened
	      // so that they have the proper position; if closing, immediately hide the tooltips
	      $scope.$watch('demo.isOpen', function(isOpen) {
	        if (isOpen) {
	          $timeout(function() {
	            $scope.tooltipVisible = $scope.isOpen;
	          }, 600);
	        } else {
	          $scope.tooltipVisible = $scope.isOpen;
	        }
	      });

	      $scope.items = [
	        { name: "Twitter", icon: "img/icons/twitter.svg", direction: "bottom" },
	        { name: "Facebook", icon: "img/icons/facebook.svg", direction: "top" },
	        { name: "Google Hangout", icon: "img/icons/hangout.svg", direction: "bottom" }
	      ];
	      
});
















var homeModule = angular.module('home');

homeModule.controller('menuCtrl', function menuCtrl($scope, $timeout, $mdSidenav, $log) {
	
	//for the connect menu header item
	 $scope.hidden = false;
	   $scope.isOpen = false;
	   $scope.hover = false;

	      // On opening, add a delayed property which shows tooltips after the speed dial has opened
	      // so that they have the proper position; if closing, immediately hide the tooltips
	      $scope.$watch('$scope.isOpen', function(isOpen) {
	        if (isOpen) {
	          $timeout(function() {
	            $scope.tooltipVisible = $scope.isOpen;
	          }, 600);
	        } else {
	          $scope.tooltipVisible = $scope.isOpen;
	        }
	      });

	      $scope.items = [
	        { name: "Facebook", icon: "fa fa-facebook", direction: "bottom" },
	        { name: "Twitter", icon: "fa fa-twitter", direction: "top" },
	        { name: "Google Plus", icon: "fa fa-google-plus", direction: "bottom" }
	      ];
	
	
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };

  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;

    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }, 200);
  }

  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }
  }
});