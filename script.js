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
    worldWindWindow.addLayer(new WorldWind.BingAerialWithLabelsLayer());

     //add compass layer
    worldWindWindow.addLayer(new WorldWind.CompassLayer());
    worldWindWindow.addLayer(new WorldWind.CoordinatesDisplayLayer(worldWindWindow));
    worldWindWindow.addLayer(new WorldWind.ViewControlsLayer(worldWindWindow));
}

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

function parseGroundStations(xml) {
    const xmlDoc = xml.responseXML;
    
}