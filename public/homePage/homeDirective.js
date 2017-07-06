angular.module('app').directive('homeDirective', function() {
    return {
        restrict: 'E',
        scope: {

        },
        controller: function($scope, $timeout, googleService) {
            let map;
            let mapElement;
            let center;
            let geoJSON;
            let request;
            let gettingData = false;
            let openWeatherMapKey = '93166548de27d485e8548e0244444cd3';
            let count = 0;

            // Have a check in function on the infowindow that adds a user to the court
            // You need a table with courts
            // You need a table with court_players
            if (googleService.user.id) {
                console.log("Found user", googleService.user)
                $scope.user = googleService.user
            } else {
                googleService.getUser()
                    .then(response => {
                        $scope.user = response
                    })
            }
            function checkin() {
                count++;

            }



            // function getWeather() {
            //     google.maps.event.addListener(map, 'idle', checkIfDataRequested);
            //     // Sets up and populates the info window with details
            //     map.data.addListener('click', function(event) {
            //         infowindow.setContent(
            //             "<img src=" + event.feature.getProperty("icon") + ">"
            //             + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
            //             + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
            //             + "<br />" + event.feature.getProperty("weather")
            //         );
            //         infowindow.setOptions({
            //             position:{
            //                 lat: event.latLng.lat(),
            //                 lng: event.latLng.lng()
            //             },
            //             pixelOffset: {
            //                 width: 0,
            //                 height: -15
            //             }
            //         });
            //         infowindow.open(map);
            //     });
            //
            //     var checkIfDataRequested = function() {
            //         // Stop extra requests being sent
            //         while (gettingData === true) {
            //             request.abort();
            //             gettingData = false;
            //         }
            //         getCoords();
            //     };
            //     // Get the coordinates from the Map bounds
            //     var getCoords = function() {
            //         var bounds = map.getBounds();
            //         console.log(bounds)
            //         var NE = bounds.getNorthEast();
            //         var SW = bounds.getSouthWest();
            //         getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
            //     };
            //     // Make the weather request
            //     var getWeather = function(northLat, eastLng, southLat, westLng) {
            //         gettingData = true;
            //         var requestString = "http://api.openweathermap.org/data/2.5/box/city?box="
            //             + westLng + "," + northLat + "," //left top
            //             + eastLng + "," + southLat + "," //right bottom
            //             + map.getZoom()
            //             + "&cluster=yes&format=json"
            //             + "&APPID=" + openWeatherMapKey;
            //         request = new XMLHttpRequest();
            //         request.onloadend = processResults;
            //         request.onprogress = function(err) {console.log(err)}
            //         request.open("GET", requestString, true);
            //         request.send();
            //     };
            //     // Take the JSON results and proccess them
            //     var processResults = function() {
            //         console.log(this);
            //         var results = JSON.parse(this.responseText);
            //         if (results.list.length > 0) {
            //             resetData();
            //             for (var i = 0; i < results.list.length; i++) {
            //                 geoJSON.features.push(jsonToGeoJson(results.list[i]));
            //             }
            //             drawIcons(geoJSON);
            //         }
            //     };
            //     var infowindow = new window.google.maps.InfoWindow();
            //     // For each result that comes back, convert the data to geoJSON
            //     var jsonToGeoJson = function (weatherItem) {
            //         var feature = {
            //             type: "Feature",
            //             properties: {
            //                 city: weatherItem.name,
            //                 weather: weatherItem.weather[0].main,
            //                 temperature: weatherItem.main.temp,
            //                 min: weatherItem.main.temp_min,
            //                 max: weatherItem.main.temp_max,
            //                 humidity: weatherItem.main.humidity,
            //                 pressure: weatherItem.main.pressure,
            //                 windSpeed: weatherItem.wind.speed,
            //                 windDegrees: weatherItem.wind.deg,
            //                 windGust: weatherItem.wind.gust,
            //                 icon: "http://openweathermap.org/img/w/"
            //                 + weatherItem.weather[0].icon  + ".png",
            //                 coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
            //             },
            //             geometry: {
            //                 type: "Point",
            //                 coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
            //             }
            //         };
            //         // Set the custom marker icon
            //         map.data.setStyle(function(feature) {
            //             return {
            //                 icon: {
            //                     url: feature.getProperty('icon'),
            //                     anchor: new google.maps.Point(25, 25)
            //                 }
            //             };
            //         });
            //         // returns object
            //         return feature;
            //     };
            //     // Add the markers to the map
            //     var drawIcons = function (weather) {
            //         map.data.addGeoJson(geoJSON);
            //         // Set the flag to finished
            //         gettingData = false;
            //     };
            //     // Clear data layer and geoJSON
            //     var resetData = function () {
            //         geoJSON = {
            //             type: "FeatureCollection",
            //             features: []
            //         };
            //         map.data.forEach(function(feature) {
            //             map.data.remove(feature);
            //         });
            //     };
            //     console.log("Here?")
            //
            // }


            function getPlaces(center) {
                googleService.getPlaces(center)
                    .then(function(response) {
                        console.log(response);
                        var infowindows = [];
                        let results = response.data.results;
                        for (let result of results) {
                            let image = result.icon;
                            let infowindow = new google.maps.InfoWindow({
                                content: result.name + '<br />' + result.vicinity +
                                    '<br /><button id="checkin" onclick="checkin()">checkIn</button>' +
                                    '<br />' + '<p>ballers</p>' + count


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


                            })
                            // marker.addListener('mouseout', function() {
                            //     $timeout(function() {
                            //         infowindow.close();
                            //     }, 4000);
                            // })



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
                // console.log(mapElement);
                // console.log(window.google);
                center = {lat: 34.7776825, lng: -96.79572639999999
                };
                map = new window.google.maps.Map(mapElement, {
                    center: center,
                    zoom: 12
                });

                //getWeather()
                getPlaces(center)

            }, 100)

        },
        templateUrl: './homePage/homeView.html'
    }
});