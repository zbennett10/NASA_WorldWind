//event handlers------------------------------------------------
//window event handlers
window.addEventListener('load', createLayers);
window.addEventListener('resize', setCanvasSize);

//helper functions----------------------------------------------

//sets height and width to 
function setCanvasSize() {
//container that fixes content during window resize
    const canvas = document.querySelector('canvas');
    canvas.height = window.outerHeight;
    canvas.width = window.outerWidth;
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