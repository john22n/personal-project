angular.module('app').directive('ballDirective', function() {
    return {
        templateUrl: './ballPage/ballView.html',
        restrict: 'E',
        scope: {},
        link: (scope, element, attribute) =>{

    },
        controller: function ($scope, socketService, googleService) {
            $scope.currentTime = moment().format();
            $scope.currentUser = googleService.user;
            if (!$scope.currentUser.id) {
                $scope.currentUser.first_name = "Guest"
            }
            const socket = socketService.getSocket();
            console.log(socket);
            $scope.users = [];
            $scope.messages = [];

            socket.on('initialData', function(data) {
                $scope.users = data.users;
                $scope.messages = data.messages;
            });

            socket.on('newUser', function(data) {
                $scope.users.push(data);
                $scope.$apply();
            });

            socket.on('newMessage', function(data) {
                $scope.messages.push(data);
                $scope.$apply();
            });

            $scope.createUsername = function(name) {
                $scope.username = name;
                socket.emit('newUser', name);
            }

            $scope.sendMessage = function(message) {
                socket.emit('newMessage', {message, user: $scope.currentUser})
                $scope.message = '';
            }
        }

    }
})