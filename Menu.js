export function Menu (engine,canvas,createScene) {
    var menuScene = new BABYLON.Scene(engine);
    var gamePlay = false;
        
    var camera = new BABYLON.FreeCamera("menuCamera", new BABYLON.Vector3(0, 0, 0), menuScene);

    //UI
    var menuUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("menuUI");
        var title = new BABYLON.GUI.TextBlock("Hicksville");
        title.text = "HICKSVILLE";
        title.color = "brown";
        title.fontSize = 156;
        title.top = "-25%";
        title.fontFamily = "Times New Roman";

        var play = BABYLON.GUI.Button.CreateSimpleButton("Play Button", "Play");
        play.width = 0.2;
        play.height = 0.1;
        play.color = "white";
        play.fontSize = 36;
        play.fontFamily = "Verdana";
        play.background = "transparent";
        play.cornerRadius = 15;

        play.onPointerEnterObservable.add(function () {
            play.background = "brown";
        });

        play.onPointerOutObservable.add(function () {
            play.background = "transparent";
        });

        play.onPointerUpObservable.add(function(){
            engine.stopRenderLoop();
            gamePlay = true;
            canvas.requestPointerLock();

            var game = createScene(engine,canvas,Menu);
            engine.runRenderLoop(function()
            {
                game.render();
            })
        });
        menuUI.addControl(title);
        menuUI.addControl(play);
        

    return menuScene;
}