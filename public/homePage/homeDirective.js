angular.module('app').directive('homeDirective', function() {
    return {
        restrict: 'E',
        scope: {

        },
        controller: function($scope, $timeout, googleService, userService) {
            let map;
            let mapElement;
            let center;
            let buttonArray = [];
            let markerArray = [];




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
                        let infowindows = [];
                        let results = response.data;
                        for (let result of results) {

                            let div = document.createElement('div');
                            let line1 = document.createElement('h6');
                            line1.innerText = result.name;
                            let line2 = document.createElement('h6');
                            line2.innerText = result.vicinity;
                            let line3 = document.createElement('p');
                            line3.innerText = 'Ballers ' + result.count;
                            let button = document.createElement('button');
                            let text = document.createTextNode('Check in');
                            button.appendChild(text);
                            button.dataset.id = result.id;

                            button.addEventListener('click', function(e) {
                                let id = e.target.dataset.id;
                                let text = e.target.parentElement.children[2];
                                let num = parseInt(text.innerText.split(' ')[1]);


                                if (e.target.innerText === "Check in") {
                                    e.target.innerText = "Check out";
                                    checkIn(id);
                                    num++;
                                    for (let i = 0; i < buttonArray.length; i++) {
                                        let btn = buttonArray[i];
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
                                        let btnEnd = buttonArray[i];
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
                            let image = result.icon;
                            let infowindow = new google.maps.InfoWindow({
                                content: div


                            });
                            infowindows.push(infowindow);
                            let marker = new window.google.maps.Marker({
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

            if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log(position);
                    if (position.coords.latitude !== center.lat && position.coords.longtitude !== center.lng) {
                        center = {lat: position.coords.latitude, lng: position.coords.longitude};
                        map.panTo(center);
                        getPlaces(center);
                    }


                });
            }

            $timeout(function() {

                mapElement = document.getElementById('map');

                center = {lat: 30.307182, lng: -97.755996
                };


                map = new window.google.maps.Map(mapElement, {
                    center: center,
                    zoom: 11
                });

                // var input = document.getElementById('pac-input');
                // var searchBox = new google.maps.places.SearchBox(input);
                // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
                //
                // // Bias the SearchBox results towards current map's viewport.
                // map.addListener('bounds_changed', function() {
                //     searchBox.setBounds(map.getBounds());
                // });






                getPlaces(center);

            }, 100);


        },
        templateUrl: './homePage/homeView.html'
    }
});