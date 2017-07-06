angular.module('app').directive('navDirective', function () {
    return {
        templateUrl: './navbar/navView.html',
        restrict: 'E',
        scope: {

        },
        link: (scope, element, attributes) => {

        },
        controller: ($scope, googleService) => {
            if (googleService.user.id) {
                console.log("Found user", googleService.user)
                $scope.user = googleService.user
            } else {
                googleService.getUser()
                    .then(response => {
                        $scope.user = response
                    })
            }

        }
    }

})