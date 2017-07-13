angular.module('app').directive('homeDirective', function() {
    return {
        restrict: 'E',
        scope: {

        },
        controller: function($scope, $timeout, googleService, userService) {
            var map;
            var mapElement;
            var center;
            var buttonArray = [];
            var markerArray = [];




            if (userService.user.id) {
                $scope.user = userService.user
            } else {
                userService.getUser()
                    .then(response => {
                        if (response.id) {
                            $scope.user = response
                        } else {
                            userService.guestUser()
                                .then(response => {
                                    $scope.user = response.data[0]

                                }).catch((err)=>{
                                console.log(err);
                            })

                        }
                    })
            }
            //pass user id court id
            function checkIn(google_id) {
                userService.checkIn(google_id, $scope.user.id)
                    .then(function(response) {
                        console.log(response)
                    })
            }
            function checkOut(google_id) {
                userService.checkOut(google_id, $scope.user.id).then(function (response) {
                    console.log(response);
                })
            }



            function getPlaces(center) {
                googleService.getPlaces(center)
                    .then(function(response) {
                        console.log(response);
                        var infowindows = [];
                        var results = response.data;
                        for (var result of results) {

                            var div = document.createElement('div');
                            var line1 = document.createElement('h6');
                            line1.innerText = result.name;
                            var line2 = document.createElement('h6');
                            line2.innerText = result.vicinity;
                            var line3 = document.createElement('p');
                            line3.innerText = 'Ballers ' + result.count;
                            var button = document.createElement('button');
                            var text = document.createTextNode('Check in');
                            button.appendChild(text);
                            button.dataset.id = result.id;

                            button.addEventListener('click', function(e) {
                                var id = e.target.dataset.id;
                                var text = e.target.parentElement.children[2];
                                var num = parseInt(text.innerText.split(' ')[1]);


                                if (e.target.innerText === "Check in") {
                                    e.target.innerText = "Check out";
                                    checkIn(id);
                                    num++;
                                    for (let i = 0; i < buttonArray.length; i++) {
                                        var btn = buttonArray[i];
                                        btn.disabled = true;
                                        if (btn.dataset.id === id) {
                                            console.log(markerArray[i]);
                                            markerArray[i].setIcon({url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png", scaledSize: new google.maps.Size(25, 25)})
                                        }
                                    }
                                    e.target.disabled = false
                                } else {
                                    e.target.innerText = "Check in";
                                    checkOut(id);
                                    num--;
                                    for (let i = 0; i < buttonArray.length; i++) {
                                        var btnEnd = buttonArray[i];
                                        btnEnd.disabled = false;
                                        if (btnEnd.dataset.id === id) {
                                            markerArray[i].setIcon();
                                        }


                                    }

                                }
                                text.innerText = "Ballers " + num

                            });
                            buttonArray.push(button);
                            div.appendChild(line1);
                            div.appendChild(line2);
                            div.appendChild(line3);
                            div.appendChild(button);
                            var image = result.icon;
                            var infowindow = new google.maps.InfoWindow({
                                content: div


                            });
                            infowindows.push(infowindow);
                            var marker = new window.google.maps.Marker({
                                map: map,
                                position: {
                                    lat: result.geometry.location.lat,
                                    lng: result.geometry.location.lng
                                },
                                title: result.name + "\n" + result.vicinity
                            ,});
                            marker.addListener('click', function() {
                                for (let infowindow of infowindows) {
                                    infowindow.close()
                                }
                                infowindow.open(map, marker);


                            });
                            markerArray.push(marker);
                        }
                    })

            }
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position);
                if (position.coords.latitude !== center.lat && position.coords.longtitude !== center.lng) {
                    center = {lat: position.coords.latitude, lng: position.coords.longitude};
                    map.panTo(center);
                    getPlaces(center);
                }


            });
            $timeout(function() {
                mapElement = document.getElementById('map');

                center = {lat: 34.7776825, lng: -96.79572639999999
                };
                map = new window.google.maps.Map(mapElement, {
                    center: center,
                    zoom: 11
                });

                getPlaces(center);

            }, 100);


        },
        templateUrl: './homePage/homeView.html'
    }
});