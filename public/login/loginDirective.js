angular.module('app')
    .directive('loginDirective', () => {
        return {
            templateUrl: './login/login.html',
            restrict: 'E',
            scope: {},
            link: (scope, element, attributes) => {

            },
            controller: ($scope) => {
            }
        }
    });