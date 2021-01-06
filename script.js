
//put stuff here first

import { Menu } from './Menu.js';
import { createScene } from './Game.js';

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

// Loading screen
BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
        document.getElementById("customLoadingScreenDiv").style.display = "initial";
        // Do not add a loading screen if there is already one
        return;
    }
    
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Loadingsome.gif/600px-Loadingsome.gif' />";
    var customLoadingScreenCss = document.createElement('style');
    customLoadingScreenCss.type = 'text/css';

    document.getElementsByTagName('head')[0].appendChild(customLoadingScreenCss);
    this._resizeLoadingUI();
    window.addEventListener("resize", this._resizeLoadingUI);
    document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function() {
    document.getElementById("customLoadingScreenDiv").style.display = "none";
    console.log("Scene is now loaded");
}


//This is executed first upon launching the whole thing
var scene = Menu(engine,canvas,createScene);
var pause = false;

// register before rendering the pause feature        
scene.registerBeforeRender(function() {
    if(pause) {
        console.log("pausing..");
        //engine.stopRenderLoop();
        //scene.animationsEnabled = false;
        //animationBox.pause();
        //particleSystem.pause();
    }

    return scene;

});

engine.runRenderLoop(function() {
    scene.render();
})

window.addEventListener("resize", function() {
    engine.resize();
});