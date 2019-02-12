
/**
 * The LayerManager manages categorical, observable lists of Layer objects. It itself observable,
 * and it injects some observable properties into the individual Layer objects.
 *
 * @param {Knockout} ko
 * @param {Config} config
 * @param {Constants} constants
 * @param {WorldWind} ww
 * @returns {LayerManager}
 */
define(['knockout', 'model/Config', 'model/Constants', 'worldwind'],
    function (ko,
              config,
              constants,
              ww) {
        "use strict";
        /**
         *
         * @param {Globe} globe
         * @returns {LayerManager}
         */
        var LayerManager = function (globe) {
            var self = this;

            this.globe = globe;
			this.flag_zoom = 0;
			
            /** Background layers are always enabled and are not shown in the layer menu. */
            this.backgroundLayers = ko.observableArray();
			
            /** Base layers are opaque and should be shown exclusive of other base layers. */
            this.baseLayers = ko.observableArray();

            /** Overlay layers may be translucent and/or contain sparce content, and may be stacked with other layers.  */
            this.overlayLayers = ko.observableArray();
			
			this.overlay1Layers = ko.observableArray();

			this.overlay2Layers = ko.observableArray();
            /** Effects layers (like atmosphere) are stacked with other layers.  */
            this.effectsLayers = ko.observableArray();

            /** Data layers are shapes and markers. */
            this.dataLayers = ko.observableArray();

            /** Widget layers are fixed controls on the screen and are not shown in the layer menu. */
            this.widgetLayers = ko.observableArray();

            /**
             * A collection of servers added to the layer manager by the user.
             */
            this.servers = ko.observableArray();

            /**
             * Toggles a layer on and off.
             *
             * @param {WorldWind.Layer} layer The layer to be toggled on or off.
             */
            this.toggleLayer = function (layer) {
                // Update the WorldWind.Layer object
                layer.enabled = !layer.enabled;

                // Update the observable so UI elements can reflect the new state
                layer.layerEnabled(layer.enabled);

                self.globe.redraw();
            };
			
        };
				
        /**
         * Background layers are always enabled and are not shown in the layer menu.
         * @param {WorldWind.Layer} layer
         */
        LayerManager.prototype.addBackgroundLayer = function (layer) {
            var index = this.backgroundLayers().length;

            // Apply fixed options for a background layer
            LayerManager.applyOptionsToLayer(layer, {
                hideInMenu: true,
                enabled: true
            }, constants.LAYER_CATEGORY_BACKGROUND);

            // Add the layer to the WorldWindow
            this.globe.wwd.insertLayer(index, layer);

            // Add a proxy to the background layer observables
            this.backgroundLayers.push(LayerManager.createLayerViewModel(layer));
        };

        /**
         * Loads a set of default layers.
         */
        LayerManager.prototype.loadDefaultLLayers = function () {
            // Define the Globe's default layers
            this.addBaseLayer(new WorldWind.BMNGLayer(), {
                enabled: true,
                hideInMenu: true,
                detailHint: config.imageryDetailHint
            });
            this.addBaseLayer(new WorldWind.BMNGLandsatLayer(), {
                enabled: false,
                detailHint: config.imageryDetailHint
            });
            this.addBaseLayer(new WorldWind.BingAerialWithLabelsLayer(null), {
                enabled: false,
                detailHint: config.imageryDetailHint
            });
            this.addBaseLayer(new WorldWind.BingRoadsLayer(null), {
                enabled: true,
                opacity: 0.7,
                detailHint: config.imageryDetailHint
            });

            this.addDataLayer(new WorldWind.RenderableLayer(constants.LAYER_NAME_MARKERS), {
                enabled: true,
                pickEnabled: true
            });
        };
        /**
         * Base layers are opaque and should be shown exclusive of other base layers.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         */
        LayerManager.prototype.addBaseLayer = function (layer, options) {
            // Determine the index of this layer within the WorldWindow
            var index = this.backgroundLayers().length + this.baseLayers().length;

            // Apply the supplied options to the base layer
            LayerManager.applyOptionsToLayer(layer, options, constants.LAYER_CATEGORY_BASE);

            // Add this layer to the WorldWindow
            this.globe.wwd.insertLayer(index, layer);

            // Add a proxy the the base layer observables
            this.baseLayers.push(LayerManager.createLayerViewModel(layer));
        };

        /**
         * Overlay layers may be translucent and/or contain sparce content, and
         * may be stacked with other layers.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         */
        LayerManager.prototype.addOverlayLayer = function (layer, options) {
            // Determine the index of this layer within the WorldWindow
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length;

            LayerManager.applyOptionsToLayer(layer, options, constants.LAYER_CATEGORY_OVERLAY);

            this.globe.wwd.insertLayer(index, layer);

            // Add a proxy for this layer to the list of overlays
            this.overlayLayers.push(LayerManager.createLayerViewModel(layer));
			
        };
		
		LayerManager.prototype.addOverlay1Layer = function (layer, options) {
            // Determine the index of this layer within the WorldWindow
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length + this.overlay1Layers().length;

            LayerManager.applyOptionsToLayer(layer, options, constants.LAYER_CATEGORY_OVERLAY);

            this.globe.wwd.insertLayer(index, layer);

            // Add a proxy for this layer to the list of overlays
            this.overlay1Layers.push(LayerManager.createLayerViewModel(layer));
        };

		LayerManager.prototype.addOverlay2Layer = function (layer, options) {
            // Determine the index of this layer within the WorldWindow
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length + this.overlay1Layers().length + this.overlay2Layers().length;

            LayerManager.applyOptionsToLayer(layer, options, constants.LAYER_CATEGORY_OVERLAY);

            this.globe.wwd.insertLayer(index, layer);

            // Add a proxy for this layer to the list of overlays
            this.overlay2Layers.push(LayerManager.createLayerViewModel(layer));
        };
        /**
         * Effect layers may be stacked with other layers.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         */
        LayerManager.prototype.addEffectLayer = function (layer, options) {
            // Determine the index of this layer within the WorldWindow
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length + this.overlay1Layers().length + this.overlay2Layers().length + this.effectsLayers().length;

            LayerManager.applyOptionsToLayer(layer, options, constants.LAYER_CATEGORY_EFFECT);

            this.globe.wwd.insertLayer(index, layer);

            // Add a proxy for this layer to the list of overlays
            this.effectsLayers.push(LayerManager.createViewsViewModel(layer));
        };

        /**
         * Data layers are shapes and markers.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         */
        LayerManager.prototype.addDataLayer = function (layer, options) {
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length + this.overlay1Layers().length + this.overlay2Layers().length + this.effectsLayers().length
                + this.dataLayers().length;

            LayerManager.applyOptionsToLayer(layer, options, constants.LAYER_CATEGORY_DATA);

            this.globe.wwd.insertLayer(index, layer);

            // Add a proxy for this layer to the list of data layers
            this.dataLayers.push(LayerManager.createLayerViewModel(layer));
        };

        /**
         * Widget layers are always enabled and are not shown in the layer menu.
         * @param {WorldWind.Layer} layer
         */
        LayerManager.prototype.addWidgetLayer = function (layer) {
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length + this.overlay1Layers().length + this.overlay2Layers().length + this.effectsLayers().length
                + this.dataLayers().length + this.widgetLayers().length;

            LayerManager.applyOptionsToLayer(layer, {
                hideInMenu: true,
                enabled: true
            }, constants.LAYER_CATEGORY_BACKGROUND);

            this.globe.wwd.insertLayer(index, layer);
            this.widgetLayers.push(LayerManager.createViewsViewModel(layer));
        };

        LayerManager.prototype.findLayer = function (layerName) {
            var layers = this.globe.wwd.layers,
                i, len;

            if (!layerName) {
                return null;
            }

            for (i = 0, len = layers.length; i < len; i++) {
                if (layers[i].displayName === layerName) {
                    return layers[i];
                }
            }
            return null;
        };


        /**
         * Applys or adds the options to the given layer.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         * @param {String} category
         */
        LayerManager.applyOptionsToLayer = function (layer, options, category) {
            var opt = (options === undefined) ? {} : options;

            // WMT layer type
            layer.category = category;

            // Propagate enabled and pick options to the layer object
            layer.enabled = opt.enabled === undefined ? true : opt.enabled;
            layer.pickEnabled = opt.pickEnabled === undefined ? false : opt.enabled;

            // Add refresh capability
            if (opt.isTemporal) {
                layer.isTemporal = true;
            }

            // Apply the level-of-detail hint, if provided
            if (opt.detailHint) {
                layer.detailHint = opt.detailHint;
            }

            // Apply the opacity, if provided
            if (opt.opacity) {
                layer.opacity = opt.opacity;
            }

            // Create the Knockout LayerViewModel for this layer
            // =================================================
            layer.showInMenu = ko.observable(opt.hideInMenu === undefined ? true : !opt.hideInMenu);

        };

        /**
         * Creates a view model object to represent the layer within the UI.
         * @param {Layer} layer A WorldWind layer object
         * @returns {Object} A lightwieght view model with obserable properties, condusive to cloning
         * in oj.ArrayTableDataSource containers
         */
        LayerManager.nextLayerId = 0;
        LayerManager.createLayerViewModel = function (layer) {
            var viewModel = {
                id:  ko.observable(LayerManager.nextLayerId++),
                category: ko.observable(layer.category),
                name: ko.observable(layer.displayName),
                enabled: ko.observable(layer.enabled),
                legendUrl: ko.observable(layer.legendUrl ? layer.legendUrl.url : ''),
                opacity: ko.observable(layer.opacity)
            };
            // Forward changes from enabled and opacity observables to the the layer object
            viewModel.enabled.subscribe(function (newValue) {
                layer.enabled = newValue;
            });
            viewModel.opacity.subscribe(function (newValue) {
                layer.opacity = newValue;
            });

            return viewModel;
        };
		LayerManager.createViewsViewModel = function (layer) {
            var viewModel = {
                id:  ko.observable(LayerManager.nextLayerId++),
                category: ko.observable(layer.category),
                name: ko.observable(layer.displayName),
                enabled: ko.observable(layer.enabled),
                legendUrl: ko.observable(layer.legendUrl ? layer.legendUrl.url : ''),
                opacity: ko.observable(layer.opacity)
            };
            // Forward changes from enabled and opacity observables to the the layer object
			
            viewModel.enabled.subscribe(function (newValue) {
                layer.enabled = newValue;
            });
            viewModel.opacity.subscribe(function (newValue) {
                layer.opacity = newValue;
            });

            return viewModel;
        };
		LayerManager.prototype.removeLayerViewModel = function(layerCaps)
		{
			var sa = layerCaps.title;
			var uric = layerCaps.parent.parent.request.getCapabilities.getUrl;
			var ides = uric.indexOf("?");
			var sbst = uric.substring(0,ides);
			var layers = this.globe.wwd.layers,i,len;
			for (i = 0, len = layers.length; i < len; i++) 
			{
					if(sa === layers[i].displayName)
					{
						var dmf = layers[i].cachePath;
						var idef = dmf.indexOf("?");
						var sbsf = dmf.substring(0,idef);
						if(sbst === sbsf)
						{
							try
							{
							var lylu = layers[i].legendUrl.url;
							this.overlayLayers.remove(function(viewModel){ return viewModel.name() == sa && viewModel.legendUrl() == lylu});
							this.overlay1Layers.remove(function(viewModel){ return viewModel.name() == sa && viewModel.legendUrl() == lylu});
							this.overlay2Layers.remove(function(viewModel){ return viewModel.name() == sa && viewModel.legendUrl() == lylu});
							this.baseLayers.remove(function(viewModel){ return viewModel.name() == sa && viewModel.legendUrl() == lylu});
							}
							catch(e)
							{
							this.overlayLayers.remove(function(viewModel){ return viewModel.name() == sa});
							this.overlay1Layers.remove(function(viewModel){ return viewModel.name() == sa});
							this.overlay2Layers.remove(function(viewModel){ return viewModel.name() == sa});
							this.baseLayers.remove(function(viewModel){ return viewModel.name() == sa});
							}
						}
						
						
					}
			}
		}
        /**
         *
         * @param serverAddress
         */
        LayerManager.prototype.addServer = function (serverAddress) {
            if (!serverAddress) {
                return;
            }

            serverAddress = serverAddress.trim();
            serverAddress = serverAddress.replace("Http", "http");
            if (serverAddress.lastIndexOf("http", 0) != 0) {
                serverAddress = "http://" + serverAddress;
            }

            var self = this,
                request = new XMLHttpRequest(),
                url = WorldWind.WmsUrlBuilder.fixGetMapString(serverAddress);

            url += "service=WMS&request=GetCapabilities&version=1.3.0";

            request.open("GET", url, true);
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    var xmlDom = request.responseXML,
                        wmsCapsDoc;

                    if (!xmlDom && request.responseText.indexOf("<?xml") === 0) {
                        xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
                    }

                    if (!xmlDom) {
                        alert(serverAddress + " retrieval failed. It is probably not a WMS server.");
                        return;
                    }

                    wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);

                    if (wmsCapsDoc.version) { // if no version, then the URL doesn't point to a caps doc.

                        // Process the servers's capabilities document
                        self.servers.push(self.loadServerCapabilites(serverAddress, wmsCapsDoc));

                    } else {
                        alert(serverAddress +
                            " WMS capabilities document invalid. The server is probably not a WMS server.");
                    }
                } else if (request.readyState === 4) {
                    if (request.statusText) {
                        alert(request.responseURL + " " + request.status + " (" + request.statusText + ")");
                    } else {
                        alert("Failed to retrieve WMS capabilities from " + serverAddress + ".");
                    }
                }
            };

            request.send(null);
        };
		
		

        LayerManager.nextServerId = 0;
        LayerManager.prototype.loadServerCapabilites = function (serverAddress, wmsCapsDoc) {
            var wmsService = wmsCapsDoc.service,
                wmsLayers = wmsCapsDoc.capability.layers,
                server = {
                    id: LayerManager.nextServerId++,
                    address: serverAddress,
                    service: wmsService,
                    title: ko.observable(wmsService.title && wmsService.title.length > 0 ? wmsService.title : serverAddress),
                    layers: ko.observableArray()
                },
                result, i, numLayers;


            // Don't show the top-level layer if it's a grouping layer with the same title as the server title.
            // The NEO server is set up this way, for example.
            if ((wmsLayers.length === 1) && (wmsLayers[0].layers) &&
                (wmsLayers[0].title === wmsCapsDoc.service.title) && !(wmsLayers[0].name && wmsLayers[0].name.length > 0)) {
                wmsLayers = wmsLayers[0].layers;
            }

            this.assembleLayers(wmsLayers, server.layers);

            return server;
        };

        /**
         *
         * @param {type} wmsLayers Array of layer capabilities
         * @param {observableArray} layerNodes Array of layer nodes
         * @returns {observableArray}
         */
        LayerManager.prototype.assembleLayers = function (wmsLayers, layerNodes) {

            for (var i = 0; i < wmsLayers.length; i++) {
                var layer = wmsLayers[i],
                    isLayer = ko.observable(layer.name && layer.name.length > 0 || false),
                    node = {
                        title: layer.title,
                        abstract: layer.abstract,
                        layerCaps: layer,
                        isChecked: ko.observable(false),
                        isFolder: !isLayer,
                        isLayer: isLayer,
                        layers: ko.observableArray()   // children
                    };

                if (layer.layers && layer.layers.length > 0) {
                    this.assembleLayers(layer.layers, node.layers);
                }

                layerNodes.push(node);
            }

            return layerNodes;
        };

        LayerManager.prototype.addLayerFromCapabilities = function (layerCaps, category) {
            if (layerCaps.name) {
                var config = WorldWind.WmsLayer.formLayerConfiguration(layerCaps, null);
                var layer;
				var self = this;
				var	wws = this.globe.wwd;
				self.goToAnimator = new WorldWind.GoToAnimator(wws);
                if (config.timeSequences &&
                    (config.timeSequences[config.timeSequences.length - 1] instanceof WorldWind.PeriodicTimeSequence)) {
                    var timeSequence = config.timeSequences[config.timeSequences.length - 1];
                    config.levelZeroDelta = new WorldWind.Location(180, 180);
                    layer = new WorldWind.WmsTimeDimensionedLayer(config);
                    layer.opacity = 0.8;
                    layer.time = timeSequence.startTime;
//                        this.timeSeriesPlayer.timeSequence = timeSequence;
//                        this.timeSeriesPlayer.layer = layer;
                    layer.timeSequence = timeSequence;
					layer.tiled = true;
					

                    //for (var t = timeSequence.currentTime; t != null; t = timeSequence.next()) {
                    
                    //}
                    //timeSequence.reset();

                } else if (config.timeSequences &&
                    (config.timeSequences[config.timeSequences.length - 1] instanceof Date)) {
                    timeSequence = config.timeSequences[config.timeSequences.length - 1];
                    config.levelZeroDelta = new WorldWind.Location(180, 180);
                    layer = new WorldWind.WmsTimeDimensionedLayer(config);
                    layer.opacity = 0.8;
					
                    layer.time = config.timeSequences[0];
//                        this.timeSeriesPlayer.timeSequence = new WorldWind.BasicTimeSequence(config.timeSequences);
//                        this.timeSeriesPlayer.layer = layer;
                    layer.timeSequence = timeSequence;
                } else {
                    layer = new WorldWind.WmsLayer(config, null);
					
//                        this.timeSeriesPlayer.timeSequence = null;
//                        this.timeSeriesPlayer.layer = null;
                }

                if (layerCaps.styles && layerCaps.styles.length > 0
                    && layerCaps.styles[0].legendUrls && layerCaps.styles[0].legendUrls.length > 0) {
                    // Add the legend url to the layer object so we can
                    // draw an image using the url as the image source
                    layer.legendUrl = layerCaps.styles[0].legendUrls[0];
                }

                // TODO: pass in category; add to selected category
                layer.enabled = true;
				layer.pickEnabled = true;
                if (category === constants.LAYER_CATEGORY_BASE) {
                    this.addBaseLayer(layer);
                } else if (category === constants.LAYER_CATEGORY_OVERLAY) {
					
					if(layer.cachePath.includes("geospatial.springfield-or.gov"))
					{
						
						if(layer.cachePath.includes("_LCL"))
						{
						if((wws.navigator.lookAtLocation.latitude<=45 && wws.navigator.lookAtLocation.latitude>=42) && (wws.navigator.lookAtLocation.longitude<=-120 && wws.navigator.lookAtLocation.longitude>=-125))
						{
							this.addOverlayLayer(layer);
						}
						else
						{
							wws.goToAnimator.goTo(new WorldWind.Position(44.046,-123.022,16155.23383078311));
							this.addOverlayLayer(layer);
						}
						}
						else if(layer.cachePath.includes("_RGL"))
						{
							if((wws.navigator.lookAtLocation.latitude<=45 && wws.navigator.lookAtLocation.latitude>=42) && (wws.navigator.lookAtLocation.longitude<=-120 && wws.navigator.lookAtLocation.longitude>=-125))
						{
							this.addOverlay2Layer(layer);
						}
						else
						{
							wws.goToAnimator.goTo(new WorldWind.Position(44.046,-123.022,16155.23383078311));
							this.addOverlay2Layer(layer);
						}
						}
						else
						{
							if((wws.navigator.lookAtLocation.latitude<=45 && wws.navigator.lookAtLocation.latitude>=42) && (wws.navigator.lookAtLocation.longitude<=-120 && wws.navigator.lookAtLocation.longitude>=-125))
						{
							this.addBaseLayer(layer);
						}
						else
						{
							wws.goToAnimator.goTo(new WorldWind.Position(44.046,-123.022,16155.23383078311));
							this.addBaseLayer(layer);
						}
						}
					}
					else
					{
						
							this.addOverlay1Layer(layer);
			
					}
                } else if (category === constants.LAYER_CATEGORY_DATA) {
                    this.addDataLayer(layer);
                } else {
					
                    this.addBaseLayer(layer);
                }

                return layer;
            }

            return null;
        };

        LayerManager.prototype.removeLayer = function (layerCaps) {
				
				this.removeLayerViewModel(layerCaps);
			this.globe.wwd.removeLayer(layerCaps);
            if (this.timeSeriesPlayer && this.timeSeriesPlayer.layer === layerCaps) {
                this.timeSeriesPlayer.timeSequence = null;
                this.timeSeriesPlayer.layer = null;
            }
            this.globe.redraw();
			//}
			
        };

        return LayerManager;
    }
);

