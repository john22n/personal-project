angular.module('app').service('googleService', function($http) {
    this.user = {};

    this.getPlaces = function(location) {
        return $http.get('/api/places?lat=' + location.lat + '&lng=' + location.lng)
    };

    this.getUser = () => {
        return $http.get('/api/user')
            .then(response => {
                this.user = response.data;
                console.log(this.user);
                return response.data
            })
            .catch((err) =>{
             return err;

        })
    }
});