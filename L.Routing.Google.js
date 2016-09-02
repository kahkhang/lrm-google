(function() {
	'use strict';

	var GoogleMapsAPI = require('googlemaps');
	var polyline = require('polyline');
    var gmAPI;
	L.Routing = L.Routing || {};

	L.Routing.Google = L.Class.extend({
		options: {
		    mode: 'driving',
		    units: 'metric'
		},
		initialize: function(apiObj, options) {
			console.log(apiObj);
		    this._apiObj = apiObj;
		    gmAPI = new GoogleMapsAPI(apiObj);
			L.Util.setOptions(this, options);
		},
		_decodePolyline: function(geometry) {
			var coords = polyline.decode(geometry, 5),
				latlngs = new Array(coords.length),
				i;
			for (i = 0; i < coords.length; i++) {
				latlngs[i] = new L.LatLng(coords[i][0], coords[i][1]);
			}

			return latlngs;
		},
		_flatten: function(arrs){
			var arr = [], i;
			for(i = 0; i < arrs.length; i++) arr = arr.concat(arrs[i]);
			return arr;
		},
		route: function(waypoints, callback, context, options) {
			var that = this;
		    var directions = this.options;
		    directions.origin = waypoints[0].latLng.lat + ',' + waypoints[0].latLng.lng;
		    directions.destination = waypoints[waypoints.length-1].latLng.lat + ',' + waypoints[waypoints.length-1].latLng.lng;
		    if(waypoints.length > 2){
		        directions.waypoints = 
		            'optimize:true|via:' + 
		            waypoints.slice(1, waypoints.length-1).map(function(waypoint){
    		            return waypoint.latLng.lat + ',' + waypoint.latLng.lng;
    		        }).join('|');
		    }
		    directions.mode = this.options.mode;
			console.log(directions);
		    gmAPI.directions(directions, function(err, result){
                if(err){
	                callback.call(context, {
						status: result.status,
						message: err
					});
                }
                else{
                	callback.call(context, null, result.routes.map(function(route){
                		var iroute = {};
                		iroute.name = route.summary;
                		iroute.summary =  {
							totalDistance: that._flatten(route.legs.map(function(leg){
					                			return leg.steps.map(function(step){
					                				return step.distance.value;
					                			});
					                	   })).reduce(function(previousValue, currentValue) {
										   		return previousValue + currentValue;
										   }),
							totalTime: that._flatten(route.legs.map(function(leg){
				                			return leg.steps.map(function(step){
				                				return step.duration.value;
				                			});
				                	   })).reduce(function(previousValue, currentValue) {
										   		return previousValue + currentValue;
									   })
						};
                		iroute.coordinates = 
	                		that._flatten(route.legs.map(function(leg){
	                			return that._flatten(leg.steps.map(function(step){
	                				return that._decodePolyline(step.polyline.points);
	                			}));
	                		}));
	                	iroute.waypoints = waypoints;
	                	iroute.instructions = 
	                		that._flatten(route.legs.map(function(leg){
	                			return that._flatten(leg.steps.map(function(step){
	                				return {
	                					distance: step.distance.value,
	            						time: step.duration.value,
	            						text: step.html_instructions
	                				};
	                			}));
	                		}));
	                	console.log(iroute);
	                	return iroute;
                	}));
                }
            });
			return this;
		}
	});

	L.Routing.google = function(apiObj, options) {
		return new L.Routing.Google(apiObj, options);
	};

	module.exports = L.Routing.Google;
})();