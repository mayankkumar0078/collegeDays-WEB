angular.module('collegeDays').
service('SessionUtilService', function($resource) {
	
    var service = this;
    service.saveToSessionStorage = function (key, data) {
        try {
            if (typeof (Storage) !== "undefined") {
                sessionStorage.setItem(key, JSON.stringify(data));
            }
        } catch (e) {
        }
    };
    
    service.removeFromSessionStorage = function (key) {
        try {
            if (typeof (Storage) !== "undefined") {
                if (sessionStorage.getItem(key) != null) {
                    sessionStorage.removeItem(key);
                }
            }
        } catch (e) {
        }
    };
    
    service.loadFromSessionStorage = function (key) {
        var data = null;
        try {
            if (typeof (Storage) !== "undefined") {
                data = JSON.parse(sessionStorage.getItem(key));
            }
        } catch (e) {
        }
        return data;
    };
});