angular.module('app').service('socketService', function() {

    const socket = io();
    console.log(socket);
    this.getSocket = function() {
        return socket;
    }
})