define(['knockout', 'jquery', 'jqueryui', 'bootstrap', 'model/Constants', 'model/Explorer'],
    function(ko, $, jqueryui, boostrap, constants, explorer) {

        /**
         * The view model for the Layers panel.
         * @param {Globe} globe The globe that provides the layer manager.
		 * @param {MarkerManager} markerManager
         * @constructor
         */
        function LayersViewModel(globe, markerManager) {
            var self = this,
                layerManager = globe.layerManager, markerManager = explorer.markerManager;
				self.baseLayers = layerManager.baseLayers;
            self.overlayLayers = layerManager.overlayLayers;
            self.overlay1Layers = layerManager.overlay1Layers;
			self.overlay2Layers = layerManager.overlay2Layers;
            self.dataLayers = layerManager.dataLayers;
            self.optionValues = ["WMS Layer", "WMTS Layer", "KML file", "Shapefile"];
            self.selectedOptionValue = ko.observable(self.optionValues[0]);
            self.curr = ko.observable(0.8);
			
            //self.rangeValue = ko.observable(0.8);
            /**
             * An observable array of servers
             */
            /*this.servers = layerManager.servers;

             /**
              * Toggles the selected layer's visibility on/off
              * @param {Object} layer The selected layer in the layer collection
              */
			  self.handler = "intialize";
			 self.markersLayer = globe.layerManager.findLayer(constants.LAYER_NAME_MARKERS);
                self.markers = markerManager.markers;   // observable array
				self.gotoMarker = function (marker) {
                    globe.goto(marker.latitude(), marker.longitude());
                };
			self.editMarker = function (marker) {
                    if (marker.isOpenable()) {
                        globe.selectController.doSelect(marker);
                        marker.open();
                    }
                };
                self.removeMarker = function (marker) {
                    if (marker.isRemovable()) {
                        marker.remove();
                    }
                };
				self.onToggleLayer = function(layer) {
                layer.enabled(!layer.enabled());
                globe.redraw();
                return state = true;
            };
            self.chag = function(data, event, layer) {

                var layerName = event.target.id;
                var layers = globe.wwd.layers,
                    i, len;
                for (i = 0, len = layers.length; i < len; i++) {
                    if (layers[i].displayName === layerName) {
                        layers[i].opacity = data.value;
                        globe.redraw();
                    }
                }
            };

            self.parxm = function(layerName, orgnam, crs, servadd, imgfr, prj, doc) {
                try {
                    var layn = layerName;
                    var xmd = doc;
                    var orgi = orgnam;
                    var srs = crs;
                    var add = servadd;
                    var imfo = imgfr;
                    var proj = prj;
					var spa = " ";
                    var test, property, property1, i, h, text, key = 0,
                        str = " ";
                    var result = [];
                    var prop = [];
                    var propv = [];
                    var serty = "WMS";
                    var users = xmd.getElementsByTagName("Layer");
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        var names = user.getElementsByTagName("Title");
                        for (var j = 0; j < names.length; j++) {
                            if (names[j].childNodes[0].nodeValue === layn) {
                                var abst = user.getElementsByTagName('Abstract')[0].lastChild.nodeValue;
                                var westb = user.getElementsByTagName('westBoundLongitude')[0].lastChild.nodeValue;
                                var eastb = user.getElementsByTagName('eastBoundLongitude')[0].lastChild.nodeValue;
                                var northb = user.getElementsByTagName('northBoundLatitude')[0].lastChild.nodeValue;
                                var southb = user.getElementsByTagName('southBoundLatitude')[0].lastChild.nodeValue;
                            }
                        }
                    }
                    var my_url = add + 'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS=' + orgi + '&STYLES&LAYERS=' + orgi + '&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=50&Y=50&buffer=40&SRS=EPSG:4326&WIDTH=101&HEIGHT=101&BBOX=' + westb + ',' + southb + ',' + eastb + ',' + northb;
                    fetch(my_url)
                        .then(res => res.json())
                        .then((out) => {
                            try {
                                if (out.crs == null) {
                                    str = "Couldnot obtain getfeatureinfo result";
                                } else {
                                    property = out.features[0].properties;
                                    property1 = out.features[0].geometry.type;
                                    h = 1;
                                    for (var name in property) {
                                        prop[i] = name;
                                        str = str.concat(h);
                                        str = str.concat(".");
                                        str = str.concat(prop[i]);
                                        str = str.concat("\n");
                                        h++;
                                       }
                                }
                                var $featuredialog = $("#feature")
                                    .html('Data Name : ' + orgi +
                                        '<br>Data Name Alias(wms_title) : ' + layn +
                                        '<br>Feature Type : ' + property1 +
                                        '<br>Projection(wms_srs) : ' + srs +
                                        '<br>Projection(coordsys_name) : ' + proj +
                                        '<br>Source Name : <a target="_blank" style="color:MediumPurple;" href="'+add+'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities">'+add+'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities</a>'+spa+
                                        '<br>Web Service Type : ' + serty +
                                        '<br>Imge Format Returned : ' + imfo +
                                        '<br>westBoundLongitude : ' + westb +
                                        '<br>northBoundLatitude : ' + northb +
                                        '<br>southBoundLatitude : ' + southb +
                                        '<br>eastBoundLongitude : ' + eastb +
                                        '<br>----------------------------------------------<br>Description : ' + abst +
                                        '<br>----------------------------------------------<br>Attributes : ' + str
                                    )
                                    .dialog({
                                        autoOpen: false,
                                        title: "MetaData",
                                        maxWidth: '1500px',
                                        MaxHeight: '2000px',
                                        create: function(event, ui) {
                                            $(this).css("maxWidth", "1000px");
											$(this).css("minWidth", "600px");
											$(this).css("MaxHeight", "auto");
											$(this).css("MinHeight", "2000px");
                                        }
                                    });
                              $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
                            } catch (e) {
                                var $featuredialog = $("#feature")
                                    .html('Data Name : ' + orgi +
                                        '<br>Data Name Alias(wms_title) : ' + layn +
                                        '<br>Feature Type : ' + property1 +
                                        '<br>Projection(wms_srs) : ' + srs +
                                        '<br>Projection(coordsys_name) : ' + proj +
                                        '<br>Source Name : <a target="_blank" style="color:MediumPurple;" href="'+add+'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities">'+add+'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities</a>'+spa+
                                        '<br>Web Service Type : ' + serty +
                                        '<br>Imge Format Returned : ' + imfo +
                                        '<br>westBoundLongitude : ' + westb +
                                        '<br>northBoundLatitude : ' + northb +
                                        '<br>southBoundLatitude : ' + southb +
                                        '<br>eastBoundLongitude : ' + eastb +
                                        '<br>----------------------------------------------<br>Description : ' + abst +
                                        '<br>----------------------------------------------<br>Attributes : Layers not queryable'
                                    )
                                    .dialog({
                                        autoOpen: false,
                                        title: "MetaData",
                                        maxWidth: '1500px',
                                        MaxHeight: '2000px',
                                        create: function(event, ui) {
                                           $(this).css("maxWidth", "1000px");
											$(this).css("minWidth", "600px");
											$(this).css("MaxHeight", "auto");
											$(this).css("MinHeight", "2000px");
                                        }
                                    });
                                $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
                            }

                        })
                        .catch(function(err) {
                            var $featuredialog = $("#feature")
                                .html('Data Name : ' + orgi +
                                    '<br>Data Name Alias(wms_title) : ' + layn +
                                    '<br>Feature Type : ' + property1 +
                                    '<br>Projection(wms_srs) : ' + srs +
                                    '<br>Projection(coordsys_name) : ' + proj +
                                    '<br>Source Name : <a target="_blank" style="color:MediumPurple;" href="'+add+'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities">'+add+'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities</a>'+spa+
                                    '<br>Web Service Type : ' + serty +
                                    '<br>Imge Format Returned : ' + imfo +
                                    '<br>westBoundLongitude : ' + westb +
                                    '<br>northBoundLatitude : ' + northb +
                                    '<br>southBoundLatitude : ' + southb +
                                    '<br>eastBoundLongitude : ' + eastb +
                                    '<br>----------------------------------------------<br>Description : ' + abst +
                                    '<br>----------------------------------------------<br>Attributes : Layers not queryable'
                                )
                                .dialog({
                                    autoOpen: false,
                                    title: "MetaData",
                                    maxWidth: '1500px',
                                        MaxHeight: '2000px',
                                        create: function(event, ui) {
                                            $(this).css("maxWidth", "1000px");
											$(this).css("minWidth", "600px");
											$(this).css("MaxHeight", "auto");
											$(this).css("MinHeight", "2000px");
                                    }
                                });
                            $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
                        })
                } catch (e) {
                    var $featuredialog = $("#feature")
                        .html('Data Name : ' + orgi +
                            '<br>Data Name Alias(wms_title) : ' + layn +
                            '<br>Feature Type : ' + property1 +
                            '<br>Projection(wms_srs) : ' + srs +
                            '<br>Projection(coordsys_name) : ' + proj +
                            '<br>Source Name : <a target="_blank" style="color:MediumPurple;" href="'+add+'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities">'+add+'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities</a>'+spa+
                            '<br>Web Service Type : ' + serty +
                            '<br>Imge Format Returned : ' + imfo +
                            '<br>westBoundLongitude : ' + westb +
                            '<br>northBoundLatitude : ' + northb +
                            '<br>southBoundLatitude : ' + southb +
                            '<br>eastBoundLongitude : ' + eastb +
                            '<br>----------------------------------------------<br>Description : ' + abst +
                            '<br>----------------------------------------------<br>Attributes : Layers not queryable'
                        )
                        .dialog({
                            autoOpen: false,
                            title: "MetaData",
                            maxWidth: '1500px',
                                        MaxHeight: '2000px',
                                        create: function(event, ui) {
                                            $(this).css("maxWidth", "1000px");
											$(this).css("minWidth", "600px");
											$(this).css("MaxHeight", "auto");
											$(this).css("MinHeight", "2000px");
                            }
                        });
                    $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
                }


            };


            self.chd = function(data, event, layer) {
                try {
                    var layerName = data.name();
					var urtst = data.legendUrl._latestValue;
					
                    var orgnam, crs, servadd, imgfr, prj, wmsCapsDoc;
                    var layers = globe.wwd.layers,
                        i, len;
                    for (i = 0, len = layers.length; i < len; i++) {
                        if (layers[i].displayName === layerName) {
							if(layers[i].legendUrl.url === urtst)
							{
								console.log(layers[i].legendUrl.url);
                            orgnam = layers[i].urlBuilder.layerNames;
                            crs = layers[i].urlBuilder.crs;
                            servadd = layers[i].urlBuilder.serviceAddress;
                            imgfr = layers[i].retrievalImageFormat;
                            prj = layers[i].lastGlobeStateKey;
							}
                        }
                    }
                    var asm;
                    asm = servadd + "SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities";
				
                    var x = new XMLHttpRequest();
                    x.open("GET", asm, true);
                    x.onreadystatechange = function() {
                        if (x.readyState == 4 && x.status == 200) {
                            var doc = x.responseXML;

                            self.parxm(layerName, orgnam, crs, servadd, imgfr, prj, doc);
                        }
                    };
                    x.send(null);
                } catch (e) {
                    var $featuredialog = $("#feature")
                        .html('This layer doesnot have any metadata. Layer doesnot belongs to WMS')
                        .dialog({
                            autoOpen: false,
                            title: "MetaData",
                            maxWidth: '1500px',
                                        MaxHeight: '2000px',
                                        create: function(event, ui) {
                                            $(this).css("maxWidth", "1000px");
											$(this).css("minWidth", "600px");
											$(this).css("MaxHeight", "auto");
											$(this).css("MinHeight", "2000px");
                            }
                        });
                    $featuredialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
                }
            };
			self.smpg = function(Layernm)
			{
				if(Layernm != "Improvement Agreements")
				{
				var tableRows = $("#asej tbody tr"); 
									var rowValues = [];
									tableRows.each(function() { 
									var rowValue = $(this).find(".content").html();
									if (!rowValues[rowValue]) {
									var rowComposite = new Object();
									rowComposite.count = 1;
									rowComposite.row = this;
									rowValues[rowValue] = rowComposite;
									} 
									else 
									{
									var rowComposite = rowValues[rowValue];
									if (rowComposite.count == 1) {
									}
									$(this).remove();
									rowComposite.count++;
									}
									});
			}
			};
            self.cled = function(evlynm, event, layer) {
				var flag = 1;
                globe.wwd.addEventListener('click',handler = function(event) {
					
					var Layernm = "";
					Layernm = evlynm;
                    var x = event.clientX;
                    var y = event.clientY;
                    var orgin, servaddr;
                    var layers = globe.wwd.layers,
                        i = 0, len;
                    for (i = 0, len = layers.length; i < len; i++) {
                        if (layers[i].displayName === Layernm) {
                            orgin = layers[i].urlBuilder.layerNames;
                            servaddr = layers[i].urlBuilder.serviceAddress;
                        }
                    }
                    var pickList = globe.wwd.pick(globe.wwd.canvasCoordinates(x, y));
					var position = pickList.objects[0].position;
                    var xmax1 = position.longitude;
                    var ymin1 = position.latitude;
					
					if(Layernm == "Taxlots" || Layernm == "Improvement Agreements")
					{
						
					var ymin = ymin1 - 0.000001;
					var xmax = xmax1 + 0.000001;
                    var xmin = xmax1 - 0.000001;		
					var ymax = ymin1 + 0.000001;
					
					}
					else if (Layernm == "Streets" || Layernm == "Address" || Layernm == "Rivers")
					{					
					var ymin = ymin1 - 0.0001;
					var xmax = xmax1 + 0.0001;
					var xmin = xmax1 - 0.0001;
					var ymax = ymin1 + 0.0001;
					}
					else
					{
					var ymin = ymin1 - 0.001;
					var xmax = xmax1 + 0.001;
					var xmin = xmax1 - 0.001;
					var ymax = ymin1 + 0.001;
					}
					var latlon = xmin + "," + ymin + "," + xmax + "," + ymax;					
					var test, property, property1, property2, text, key = 0,str = " ";
                    var result = " ";
                    var prop = [];
                    var propv = [];
                    var coln = [];
                    var val = [];                    
                    var my_url = servaddr+'VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS='+orgin+'&STYLES&LAYERS='+orgin+'&INFO_FORMAT=application%2Fjson&FEATURE_COUNT=2&X=50&Y=50&SRS=EPSG%3A4326&WIDTH=101&HEIGHT=101&buffer=40&BBOX='+latlon;
					console.log(my_url);
					orgin ='';
					servaddr = '';
                    fetch(my_url)
                        .then(res => res.json())
                        .then((out) => {
                             if (out.crs == null) {
                                console.log('no object');
                            } else {
                            	property = out.features[0].properties;
                                if (flag == 1) {
									$("#dif").html("");
                                   	result = "<table style='border: 1px solid black;width: 100%;' id='asej'>";
									result += "<thead><tr>";
                                    for (var name in property) {
                                        result += "<th style='border: 1px solid black;' bgcolor='#009ACD' onclick='sortTable(0)'><font color='#ffffff'>" + name + "</font></th>";
                                    }
                                    result += "</tr></thead><tbody><tr>";
                                    for (var name in property) {
                                        result += "<td class='content' style='border: 1px solid black;'>" + property[name] + "</td>";
                                    }
                                    result += "</tr>";
                                    flag--;
                                } else {
									var res;
									res += "<tr>";
                                    for (var name in property) 
									{
                                        res += "<td class='content' style='border: 1px solid black;'>" + property[name] + "</td>";
                                    }
                                    res += "</tr>";
									$('#asej tr:last').after(res);
									
                                }
                                result += "</tbody></table>";
                                $("#dif").append(result);
								self.smpg(Layernm);
                            }
                        })
						
				});
            };
			self.excld = function fnExcelReport(data, event)
			{
            var tab_text="<html xmlns='http://www.w3.org/1999/xhtml' lang='el-GR' lang='el-GR'>";
			var tab_text=tab_text+"<?php Response.AddHeader('Content-Disposition', 'inline;filename='"+data.name()+"'.xls') ?>";
			var tab_text=tab_text+"<meta http-equiv='content-type' content='text/plain; charset=UTF-8'/>";
			var tab_text=tab_text+"<table border='2px'><tr bgcolor='#87AFC6'>";
			var textRange; var j=0;
			tab = document.getElementById('asej');
			for(j = 0 ; j < tab.rows.length ; j++)
			{
				tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
			}
			tab_text=tab_text+"</table>";
			tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");
			tab_text= tab_text.replace(/<img[^>]*>/gi,"");
			tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, "");
			tab_text= tab_text.replace(/<button[^>]*>|<\/button>/gi, "");
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf("MSIE ");
			sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
			return (sa);	    
			};
			self.rmls = function(data, event, layer) {
			 try{
					globe.wwd.removeEventListener('click',handler);
			 }
			 catch(e)
			 {
				 console.log(e);
			 }
			};
            self.tableof = function(data, event, layer) {
				$("#dif").html("");
				self.rmls(data,event,layer);
                var originalContent;0
				var evlynm = data.name();
				self.cled(evlynm, event, layer);
                var $tabotdialog = $("#dif")
                    .dialog({
                        autoOpen: false,
                        title: "Table : "+data.name(),
                        maxWidth: '900px',
						open : function(event, ui) { 
							$("#dif").html("Please click on specific layer for data");
						},
                        buttons: [
							{
                                text: "Clear",
                                click: function(event, ui) 
							{
            						$("#dif").html("");
									self.rmls(data,event,layer);
									self.cled(evlynm, event, layer);
        					}
                            },
                            {
                                text: "Export",
                                click: function() 
								{
									self.excld(data);
                                }
                            }
                        ],
                        create: function(event, ui) {
                            $(this).css("maxWidth", "auto");
                            $(this).css("minWidth", "400px");
                        },
						close : function(event, ui) {
							$("#dif").html("");
							self.rmls(data,event,layer);
						
						}
						
                    });
                $tabotdialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");
            };
			/**
             * Opens a dialog to edit the layer settings.
             * @param {Object} layer The selected layer in the layer collection
             */
            self.onEditSettings = function(layer) {

                $('#opacity-slider').slider({
                    animate: 'fast',
                    min: 0,
                    max: 1,
                    orientation: 'horizontal',
                    slide: function(event, ui) {
                    layer.opacity(ui.value);
                    },
                    step: 0.1
                });
                $("#layer-settings-dialog").dialog({
                    autoOpen: false,
                    title: layer.name()
                });
				$("#opacity-slider").slider("option", "value", layer.opacity());
                $("#layer-settings-dialog").dialog("open");
            };
			/**
             * Opens the Add Layer dialog.
             */
            self.onAddLayer = function() {
                $("#add-layer-dialog").dialog({
                    autoOpen: false,
                    title: "Add Layer"
                });
                $("#add-layer-dialog").dialog("open");
            };
        }

        return LayersViewModel;
    }
);