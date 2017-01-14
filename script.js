//globals-----------------------------------------------------
let worldWindWindow;

//event listeners------------------------------------------------
window.addEventListener('load', onWindowLoad);
window.addEventListener('resize', setCanvasSize);
document.querySelector('form').addEventListener('submit', findLocation);


//helper functions----------------------------------------------

//sets height and width to 
function setCanvasSize() {
//container that fixes content during window resize
    const canvas = document.querySelector('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}

//onload event handler for window
function onWindowLoad() {
    createLayers();
    requestGroundStations();

    //add dynamic text to footer
    const footerText = document.createElement('span');
    footerText.innerText = `All Rights Reserved. Zachary Bennett © ${(new Date()).getFullYear()}`;
    const footer = document.querySelector('#footer');
    footer.appendChild(footerText);
}

//adds world wind and basic layers to canvas
function createLayers() {
    worldWindWindow = new WorldWind.WorldWindow('worldWindCanvas');
    //adds basic image layers to world wind
    worldWindWindow.addLayer(new WorldWind.BMNGOneImageLayer());
    //worldWindWindow.addLayer(new WorldWind.BMNGLandsatLayer());
    worldWindWindow.addLayer(new WorldWind.BingAerialWithLabelsLayer());

     //add compass layer
    worldWindWindow.addLayer(new WorldWind.CompassLayer());
    worldWindWindow.addLayer(new WorldWind.CoordinatesDisplayLayer(worldWindWindow));
    worldWindWindow.addLayer(new WorldWind.ViewControlsLayer(worldWindWindow));
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
    
    addStationLayer(stationNames, stationLongitudes, stationLatitudes);
}

//create placemark layer - put in load function or new function
function addStationLayer(nameArr, longArr, latArr) {
    //instantiate placemark layer
     var placemarkLayer = new WorldWind.RenderableLayer("Placemarks");

    //instantiate attribute object for placemark and set properties
    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-blue.png";
        placemarkAttributes.imageScale = .4;
        placemarkAttributes.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.3, WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.BLUE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.scale = .8;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

    for(var i = 0; i < nameArr.length; i++) {
        //instantiate placemark object and set properties
        var placemark = new WorldWind.Placemark(new WorldWind.Position(Number(latArr[i]), Number(longArr[i])), true, null);
        placemark.label = nameArr[i];
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        placemark.alwaysOnTop = true;
        placemark.attributes = placemarkAttributes;
        placemarkLayer.addRenderable(placemark);
    }
    //apply layer to map
    worldWindWindow.addLayer(placemarkLayer); 
}

function findLocation(e) {
    e.preventDefault(); //prevent form from refreshing page
    console.log("finding location.....")
    var latitude = e.path[0][0].value; //Latitude
    var longitude = e.path[0][1].value; //Longitude 
    
    var animator = new WorldWind.GoToAnimator(worldWindWindow);
    animator.goTo(new WorldWind.Location(latitude, longitude));
}



// add ability to search a groundStation 
// add ability to search lat and long and be taken to that positiont.