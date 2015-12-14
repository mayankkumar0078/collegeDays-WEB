/**
 * Login service
 */

angular.module('home').service("loginService", function($resource) {

       //Get the username and password from the database
			this.verifyLogin = function(){
				return $resource("http://localhost:8080/verifyLogin",{},{ call : { method : 'POST',
					isArray: false }});
			};
});
