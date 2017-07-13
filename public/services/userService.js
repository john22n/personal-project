angular.module('app').service('userService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.user = {};
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

    this.getUser = () => {
        return $http.get('/api/user')
            .then(response => {
                this.user = response.data;
                $rootScope.$emit('newUser', this.user)
                return response.data
            })
            .catch((err) =>{
                return err;

            })
    }

    this.getCurrentUser = function() {
        return this.user
    }
}]);