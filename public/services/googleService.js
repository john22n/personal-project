angular.module('app').service('googleService',['$http', function($http) {

    this.getPlaces = function(location) {
        return $http.get('/api/places?lat=' + location.lat + '&lng=' + location.lng)
    };

}]);