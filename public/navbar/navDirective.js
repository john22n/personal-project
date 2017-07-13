angular.module('app').directive('navDirective', function () {
    return {
        templateUrl: './navbar/navView.html',
        restrict: 'E',
        scope: {

        },
        link: (scope, element, attributes) => {

        },
        controller: ($scope, userService, $rootScope) => {

            if (userService.user.id) {
                $scope.user = userService.user;
            } else {
                userService.guestUser()
                    .then(response => {
                        $scope.user = response.data[0];
                        console.log($scope.user);

                    })
            }

            $rootScope.$on('newUser', function(event, data) {
                if (data) {
                    $scope.user = data;
                }
            })

        }
    }

});