
define(['knockout',
		'model/markers/BasicMarker',
        'jquery',
        'worldwind','require','knockout-jqAutocomplete', 'model/Explorer'],
    function (ko, BasicMarker, $, ww, require, ka, explorer) {
        "use strict";
        /**
         * The view model for the Search panel.
         * @param {Globe} globe The globe that provides the supported projections
		 * @param {MarkerManager} markerManager
         * @constructor
         */
        function SearchViewModel(globe, markerManager) {
            var self = this,
                wwd = globe.wwd,
				markerManager = explorer.markerManager,
				commonAttributes = BasicMarker.commonAttributes();
				
			var ds;
            self.geocoder = new WorldWind.NominatimGeocoder();
            self.goToAnimator = new WorldWind.GoToAnimator(wwd);
            self.searchText = ko.observable();
			this.stringChoices = [];
			 this.selectedTutorial = ko.observable('Global');
         
            this.availableTutorials = ko.observableArray ([
               'Global','Addresses','Taxlot'
            ]);
			
            self.onEnter = function (data, event) {
                if (event.keyCode === 13) {
                    self.performSearch();
                }
                return true;
            };
			
            self.performSearch = function () {
                var queryString = self.searchText();
				var e = document.getElementById("opti");
				var strUser = e.options[e.selectedIndex].value;
				
                if (queryString) {
					if(strUser == "Global")
					{
                    var latitude, longitude;
                    if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
                        var tokens = queryString.split(",");
                        latitude = parseFloat(tokens[0]);
                        longitude = parseFloat(tokens[1]);
                        self.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                    } else {
                        self.geocoder.lookup(queryString, function (geocoder, result) {
                            if (result.length > 0) {
                                latitude = parseFloat(result[0].lat);
                                longitude = parseFloat(result[0].lon);
                                self.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                            }
                        });
                    }
				}
				if(strUser == "Taxlot")
					{
						
						if(!(/^\d*$/.test(queryString)))
						{
							var $featuredialog = $("#dig")
                                    .html('Please enter only TAXLOT number')
                                    .dialog({
                                        autoOpen: false,
                                        title: "Taxlot Error",
                                        width: 'auto',
                                        height: 'auto',
										buttons: [{
													text: "Ok",
													click: function() {
													$(this).dialog('close');
													}
												 }],
                                        create: function(event, ui) {
                                            $(this).css("maxWidth", "600px");
                                        }
                                    });
                                $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
                            }
						else
						{
							
						var trl = "https://geospatial.springfield-or.gov:4003/tax?tax="+queryString;
						fetch(trl)
						.then(res => res.json())
                        .then((out) => {
							if(out[0] === undefined)
							{
								var $featuredialog = $("#dig")
                                    .html('Couldn\'t find given Taxlot Number ')
                                    .dialog({
                                        autoOpen: false,
                                        title: "Taxlot Number Error",
                                        width: 'auto',
                                        height: 'auto',
										buttons: [{
													text: "Ok",
													click: function() {
													$(this).dialog('close');
													}
												 }],
                                        create: function(event, ui) {
                                            $(this).css("maxWidth", "600px");
                                        }
                                    });
                                $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
							
							}
							else
							{
							var lat = out[0].latitude;
							var longi = out[0].longitude;
							//console.log("Before : "+lat+" "+longi);
							self.goToAnimator.goTo(new WorldWind.Position(lat, longi,791.0710861834075));
							lat = parseFloat(lat).toFixed(8);
							longi = parseFloat(longi).toFixed(8);
							setTimeout(function(){markerManager.addMarker(new BasicMarker(
							markerManager,new WorldWind.Position(lat, longi,0), { imageSource: "js/libs/webworldwind/images/pushpins/castshadow-teal.png",name:queryString }));
							
							}, 3000);
							}
						})

						}
					}
					if (strUser == "Addresses")
					{
						if(queryString!=null)
						{
						var trl = "https://geospatial.springfield-or.gov:4003/add?add="+queryString;
						fetch(trl)
						.then(res => res.json())
                        .then((out) => {
							if(out[0] === undefined)
							{
								var $featuredialog = $("#dig")
                                    .html('Couldn\'t find given address ')
                                    .dialog({
                                        autoOpen: false,
                                        title: "Address Error",
                                        width: 'auto',
                                        height: 'auto',
										buttons: [{
													text: "Ok",
													click: function() {
													$(this).dialog('close');
													}
												 }],
                                        create: function(event, ui) {
                                            $(this).css("maxWidth", "600px");
                                        }
                                    });
                                $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
							
							}
							else
							{
							var lat = out[0].latitude;
							var longi = out[0].longitude;
							//console.log("Before : "+lat+" "+longi);
							self.goToAnimator.goTo(new WorldWind.Position(lat, longi,791.0710861834075));
							lat = parseFloat(lat).toFixed(8);
							longi = parseFloat(longi).toFixed(8);
							setTimeout(function()
							{
							console.log(queryString);
							markerManager.addMarker(new BasicMarker(
							markerManager,new WorldWind.Position(lat, longi,0), { imageSource: "js/libs/webworldwind/images/pushpins/castshadow-green.png",name:queryString }));
							}, 3000);
							}
						})
					}
					else
					{
						var $featuredialog = $("#dig")
                                    .html('Please enter some text to find the address')
                                    .dialog({
                                        autoOpen: false,
                                        title: "Find Address Error",
                                        width: 'auto',
                                        height: 'auto',
										buttons: [{
													text: "Ok",
													click: function() {
													$(this).dialog('close');
													}
												 }],
                                        create: function(event, ui) {
                                            $(this).css("maxWidth", "600px");
                                        }
                                    });
                                $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
					}
					}
            }
			};
			$('.gos').click(function() {
			self.goToAnimator.goTo(new WorldWind.Position(44.046, -123.022,16155.23383078311));
			});
			$('.ns').click(function() {
                self.goToAnimator.goTo(new WorldWind.Position(37.408866, -122.064426,791.0710861834075));
            });
            $('.kt').click(function() {
                self.goToAnimator.goTo(new WorldWind.Position(11.081597, 76.997963,791.0710861834075));
            });
        }
        return SearchViewModel;
		});
