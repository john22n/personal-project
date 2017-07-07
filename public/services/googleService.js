angular.module('app').service('googleService', function($http) {
    this.user = {};
    // this.getPlaces = function(location) {
    //     return $http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDHB0MQwNOEwkkn9eq4svRDT2swYz0qPHo&type=park&radius=8000&name=basketball&location=' + location.lat + ',' + location.lng)
    // }
    this.getPlaces = function(location) {
        return $http.get('/api/places?lat=' + location.lat + '&lng=' + location.lng)
    }

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

    // this.getCourt = function(location) {
    //     return $http.get('/api/places?lat=' + location.lat + '&lng=' + location.lng)
    //         .then(function(response) {
    //             console.log(response);
    //         })
    // }



});