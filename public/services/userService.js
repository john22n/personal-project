angular.module('app').service('userService', function ($http) {

    this.checkIn = function(google_id, user_id) {
        return $http.post('/api/court_player', {google_id, user_id})
    };

    this.checkOut = function(google_id, user_id) {
        console.log(google_id, user_id);
        return $http.delete('/api/remove_player/' + google_id + '/' + user_id)
    };
    this.guestUser = function() {
        return $http.post('/api/guest')
    };

});