angular.module('collegeDays').
service('CollegeFactory', function($resource, SessionUtilService,CommonConstants, $http, $q) {
	//college type
	return{
		getHttpResponse:function(methodType, url){
		
		  var deferred = $q.defer();

          $http({method: methodType, url: url}).
          success(function (data) {
              deferred.resolve(data);
          }).
          error(function (data, status) {
              deferred.reject(status);
          });
          return deferred.promise;
	}};
});