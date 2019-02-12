
define(['knockout',
        'jquery', 'jqueryui',
        'model/Constants'],
    function (ko, $, jqueryui,constants) {

        /**
         * The view model for the Home panel.
         * @constructor
         */
        function HomeViewModel(globe) {
			
            var self = this,layerManager = globe.layerManager;

            this.globe = globe;
            this.timeZoneDetectEnabled = globe.timeZoneDetectEnabled;
            this.use24Time = globe.use24Time;
            this.servers = layerManager.servers;
            self.serverAddress = ko.observable("https://geospatial.springfield-or.gov:8443/geoserver/BASE_LCL/wms?");
			
	
            self.onAddServer  = function() {
                layerManager.addServer(self.serverAddress());
                return true;
            };
            this.onServerLayerClicked = function(layerNode, event){
                if (!layerNode.isChecked()) {
                    // TODO: Open dialog to select a layer category
                    layerManager.addLayerFromCapabilities(layerNode.layerCaps, constants.LAYER_CATEGORY_OVERLAY);
                    //blinker(1);
					
                    blink("ul:first > li:nth-child(2)", 5, 100);
                } else {
                    
                    layerManager.removeLayer(layerNode.layerCaps);
                }
                return true;

            };
			self.onremoveServer = function(layerNode) {
				
				idnum = this.id;
				var f = 1;
				var dil = "";
				var tempd;
				
				var layerlist = [];
				var layerlistur = [];
				var lycm;
				var layerfl = [];
				var layersuc = globe.wwd.layers, len;
				var layersucur = [];
				var prstr = "";
				var layercapsdet = [];
				var layerlength =layerNode.layers._latestValue.length;
				for(var i=0;i<layerNode.layers._latestValue.length; i++){
					layerlist[i] = layerNode.layers._latestValue[i]['title'];
					tempd = layerNode.layers._latestValue[i].layerCaps.parent.parent.request.getCapabilities.getUrl;
					var ides = tempd.indexOf("?");
					layerlistur[i] = tempd.substring(0,ides);
				}
				
                for (var j = 0, len = layersuc.length; j < len; j++) 
				{
					
					for(var k = 0; k < layerlist.length; k++)
					{
						if (layersuc[j].displayName == layerlist[k]) 
						{
							
						var terb = layersuc[j].cachePath;
						var idej = terb.indexOf("?");
						layersucur[j] = terb.substring(0,idej);
						if(layerlistur[k] == layersucur[j])
						{
						prstr += "";
						layerfl[j] = layersuc[j].displayName;
						prstr += "<br>";
						prstr += f;
						prstr += ". "+layerfl[j]+"\n";
						f++;
						}
						}
					}
                }
				if (prstr == "")
				{	
					dil = "<br>Are you sure?  Removing this Source will remove all these layers related to this source";
				}
				else
				{
					dil = "<br>Are you sure?  Removing this Source will remove all these following layers in this source";
				}
				var $popdialog = $("#podp")
				.dialog({
                        autoOpen: false,
						resizable: false,
                        title: "Remove Server",
                        buttons: [
							{
                                text: "Yes",
                                click: function(event, ui) 
							{			
									if(layerfl.length>0)
									{
										for(var i=0;i<layerfl.length;i++)
										{
											for(var j=0;j<layerNode.layers._latestValue.length;j++)
											{
												if(layerfl[i]===layerNode.layers._latestValue[j]['title'])
												{
													
													
													layercapsdet[i] = layerNode.layers._latestValue[j]['layerCaps'];
													
													layerManager.removeLayer(layercapsdet[i]);
												}
											}
										}
									}
									
									var elem = document.getElementById("server-layers-"+idnum);
									var pr = elem.parentNode;
									var eld = pr.parentNode;
									eld.removeChild(pr);
									$(this).closest('.ui-dialog-content').dialog('close');
        					}
                            },
                            {
                                text: "No",
                                click: function() 
								{
									$(this).closest('.ui-dialog-content').dialog('close'); 
                                }
                            }
                        ], 
						open : function(event, ui) {
							$("#podp").html(dil+''+prstr);
						}
                    });
                $popdialog.dialog("open").parent(".ui-dialog").css("background", "black").css("opacity", "0.7").find(".ui-dialog-content").css("color", "white").css("opacity", "1.0").prev(".ui-dialog-titlebar").css("background", "grey").prev(".ui-dialog-titlebar").css("border", "grey");          
			};
            
			layerManager.addServer("https://geospatial.springfield-or.gov:8443/geoserver/BASE_LCL/wms?");
			layerManager.addServer("https://geospatial.springfield-or.gov:8443/geoserver/ENVIR_LCL/wms?");
			layerManager.addServer("https://geospatial.springfield-or.gov:8443/geoserver/FAC_LCL/wms?");
			layerManager.addServer("https://geospatial.springfield-or.gov:8443/LANDBS_LCL/wms?");
			layerManager.addServer("https://geospatial.springfield-or.gov:8443/PSAP_LCL/wms?");
			layerManager.addServer("https://geospatial.springfield-or.gov:8443/ENVIR_NTL/wms?");
			layerManager.addServer("https://geospatial.springfield-or.gov:8443/ENVIR_RGL/wms?");
			
        }
		
        return HomeViewModel;
	}
	);
	
function blink(elem, times, speed) {
    if (times > 0 || times < 0) {
        if ($(elem).hasClass("blink"))
            $(elem).removeClass("blink");
        else
            $(elem).addClass("blink");
    }

    clearTimeout(function () {
        blink(elem, times, speed);
    });

    if (times > 0 || times < 0) {
        setTimeout(function () {
            blink(elem, times, speed);
        }, speed);
        times -= .5;
    }
}