angular.module('app', ['ui.router'])
    .config( ($stateProvider, $urlRouterProvider) => {
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                template: '<login-directive></login-directive>'
            })
            .state('home', {
                url: '/',
                template: '<home-directive></home-directive>'
            });



    });