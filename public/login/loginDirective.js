angular.module('app')
    .directive('loginDirective', () => {
        return {
            templateUrl: './login/login.html',
            restrict: 'E',
            scope: {},
            link: (scope, element, attributes) => {

            },
            controller: ($scope, userService, $state) => {
                $scope.guestUser = function() {
                    userService.guestUser()
                        .then(function(response) {
                            console.log(response + 'this is the guest service call');
                            $state.go('home')
                         })
                        .catch(function(err) {
                            console.warn(err)
                        })

                }

            }
        }
    });