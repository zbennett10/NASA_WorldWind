//event handlers------------------------------------------------
//window event handlers
window.addEventListener('load', onWindowLoad);
window.addEventListener('resize', setCanvasSize);

//helper functions----------------------------------------------

//sets height and width to 
function setCanvasSize() {
//container that fixes content during window resize
    const canvas = document.querySelector('canvas');
    canvas.height = window.outerHeight;
    canvas.width = window.outerWidth;
}

//onload event handler for window
function onWindowLoad() {
    createLayers();
    requestGroundStations();
}

//adds world wind and basic layers to canvas
function createLayers() {
    //adds Nasa World Wind to canvas
    const worldWindWindow = new WorldWind.WorldWindow('worldWindCanvas');

    //adds basic image layers to world wind
    worldWindWindow.addLayer(new WorldWind.BMNGOneImageLayer());
    worldWindWindow.addLayer(new WorldWind.BMNGLandsatLayer());
    worldWindWindow.addLayer(new WorldWind.BingAerialWithLabelsLayer());

     //add compass layer
    worldWindWindow.addLayer(new WorldWind.CompassLayer());
    worldWindWindow.addLayer(new WorldWind.CoordinatesDisplayLayer(worldWindWindow));
    worldWindWindow.addLayer(new WorldWind.ViewControlsLayer(worldWindWindow));

    //practice putting a pin on map
    //instantiate placemark object and set properties
    var placemark = new WorldWind.Placemark(new WorldWind.Position(47.684444, -121,129722, 1e2), true, null);
        placemark.label = "Practice";
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

    //instantiate attribute object for placemark and set properties
    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

    //instantiate placemark layer
    var placemarkLayer = new WorldWind.RenderableLayer("Placemarks");

    //apply placemark attributes to placemark
    placemark.attributes = placemarkAttributes;
    placemarkLayer.addRenderable(placemark); //apply placemark to layer
    worldWindWindow.addLayer(placemarkLayer); //apply layer to map
}

//xml request to NASA API for Ground Stations
function requestGroundStations() {
    var xmlRequest = new XMLHttpRequest();
    xmlRequest.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            parseGroundStations(this);
        }
    };
    xmlRequest.open('GET', 'http://sscweb.sci.gsfc.nasa.gov/WS/sscr/2/groundStations', true);
    xmlRequest.send();
}

//parses xml data 
function parseGroundStations(xml) {
    const xmlDoc = xml.responseXML;
    const stationNames =  $.makeArray(xmlDoc.getElementsByTagName("Name")).map(node => node.innerHTML);
    const stationLongitudes = $.makeArray(xmlDoc.getElementsByTagName("Longitude")).map(node => node.innerHTML);
    const stationLatitudes = $.makeArray(xmlDoc.getElementsByTagName("Latitude")).map(node => node.innerHTML);
    

    
    //console.log(stationNames, stationLongitudes, stationLatitudes);
}

//create placemark layer - put in load function or new function
//write function that takes station array data and places a pin on the layer for each station