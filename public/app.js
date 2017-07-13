angular.module('app', ['ui.router'])
    .config( function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                template: '<login-directive></login-directive>'
            })
            .state('home', {
                url: '/',
                template: '<home-directive></home-directive>',
                resolve: {
                    isLoggedIn: isLoggedIn
                }
            })
            .state('ball', {
                url: '/ball',
                template: '<ball-directive></ball-directive>',
                resolve: {
                    isLoggedIn: isLoggedIn
                }
            })



    });

function isLoggedIn($http, $state){
    return $http.get('/api/isLoggedin').then(function(res){
        console.log(res);
        return res
    }).catch(function(err){
        console.log(err);
        $state.go('login')
    })
}