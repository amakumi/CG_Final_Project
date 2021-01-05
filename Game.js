export function createScene(engine,canvas,createMenu) {
    var gameScene = new BABYLON.Scene(engine);
    var gamePlay = true;

    engine.displayLoadingUI();
    gameScene.enablePhysics();
    gameScene.collisionsEnabled = true;

    // debug UI
    gameScene.debugLayer.show();

    gameScene.gravity = new BABYLON.Vector3(0, -.55, 0);
    gameScene.getPhysicsEngine().setGravity(gameScene.gravity); 
   
    var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-80, 33, 0), gameScene);
 
    camera.speed = 0.2;
    //camera.parent = env;
    camera.rotation.y = 46;

    // Attach the camera to the canvas
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1,1.25,1);
    camera.attachControl(canvas, true); 
    //gameScene.activeCameras.push(camera);

    // CONTROLS

    //Controls  WASD
    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D

    //Jump
    function jump(){
        camera.cameraDirection.y = 1.0;
        //setTimeout(10);
    }

    let justJumped = false;
    document.body.onkeyup = function(e){
        if(e.keyCode == 32 && !justJumped) {
            //your code
            justJumped = true;
            setTimeout(() => justJumped = false, 1000);
            console.log("jump");
            jump();
            //setTimeout(jump, 1000);
        }
    }

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 300.0, gameScene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", gameScene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", gameScene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial; 

    // IN-GAME UI
    var gameUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("gameUI");
    gameUI.rootContainer.top = "2%";
    gameUI.rootContainer.left = "5%";
    gameUI.rootContainer.bottom = "2%";
    //gameUI.layer.layerMask = 1;

    var settings = BABYLON.GUI.Button.CreateSimpleButton("Settings Button", "Settings");
        settings.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        settings.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        settings.width = 0.08;
        settings.height = 0.03;
        settings.top = "0%";
        settings.color = "white";
        settings.fontSize = 16;
        settings.fontFamily = "Verdana";
        settings.background = "transparent";
        settings.cornerRadius = 15;
        var settingsOpened = false;

    settings.onPointerEnterObservable.add(function () {
        settings.background = "brown";
    });

    settings.onPointerOutObservable.add(function () {
        settings.background = "transparent";
    });
    // Opens the settings bar
    settings.onPointerUpObservable.add(function() {
        if (settingsOpened == false) {
            settings.textBlock.text = "Back";
            settingsOpened = true;
            gameUI.addControl(quit);
            gameUI.addControl(fog);
            gameUI.addControl(music);
            music.isVisible = true;
            fog.isVisible = true;
            quit.isVisible = true;
        }
        else {
            settings.textBlock.text = "Settings";
            settingsOpened = false;
            fog.isVisible = false;
            music.isVisible = false;
            quit.isVisible = false;
        }
    });

    var quit = BABYLON.GUI.Button.CreateSimpleButton("Quit Button", "Quit");
        quit.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        quit.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        quit.width = 0.08;
        quit.height = 0.03;
        quit.top = "15%";
        quit.color = "white";
        quit.fontSize = 16;
        quit.fontFamily = "Verdana";
        quit.background = "transparent";
        quit.cornerRadius = 15;

    quit.onPointerEnterObservable.add(function () {
        quit.background = "brown";
    });

    quit.onPointerOutObservable.add(function () {
        quit.background = "transparent";
    });

    quit.onPointerUpObservable.add(function() {
            engine.stopRenderLoop();
            gamePlay = false;
            //canvas.requestPointerLock();

            var menu = createMenu(engine,canvas,createScene);
            engine.runRenderLoop(function()
            {
                menu.render();
            })
    });

    var fog = BABYLON.GUI.Button.CreateSimpleButton("Fog Button", "Fog Off");
        fog.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        fog.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        fog.width = 0.08;
        fog.height = 0.03;
        fog.top = "5%";
        fog.color = "white";
        fog.fontSize = 16;
        fog.fontFamily = "Verdana";
        fog.background = "transparent";
        fog.cornerRadius = 15;
    //
        fog.onPointerEnterObservable.add(function () {
        fog.background = "brown";
    });

    fog.onPointerOutObservable.add(function () {
        fog.background = "transparent";
    });

    fog.onPointerUpObservable.add(function() {
        if (fogEnabled == false) {
            var fogToggle = toggleFog();
            fog.textBlock.text = "Fog On";
            engine.runRenderLoop(function()
            {
                fogToggle.render();
            });
        }
        else {
            fog.textBlock.text = "Fog Off";
            fogOff();
        }
            
    });

    //Fog
    // set option to change fog density in-game
    var fogEnabled = false;
    gameScene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    gameScene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
    gameScene.fogDensity = 0;

    var toggleFog = function() {
        console.log("fog toggling");
        console.log("fog on");
        fogEnabled = true;
        gameScene.fogDensity = 0.007;
        
        return gameScene;
    }

    function fogOff() {
        fogEnabled = false;
        gameScene.fogDensity = 0;
    }

    var music = BABYLON.GUI.Button.CreateSimpleButton("Music Button", "Music Off");
        music.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        music.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        music.width = 0.08;
        music.height = 0.03;
        music.top = "10%";
        music.color = "white";
        music.fontSize = 16;
        music.fontFamily = "Verdana";
        music.background = "transparent";
        music.cornerRadius = 15;

    music.onPointerEnterObservable.add(function () {
        music.background = "brown";
    });

    music.onPointerOutObservable.add(function () {
        music.background = "transparent";
    });

    music.onPointerUpObservable.add(function() {
        if (musicEnabled == false) {
            music.textBlock.text = "Music On";
            toggleBgm();
        }
        else {
            music.textBlock.text = "Music Off";
            musicOff();
        }
            
    });

    //bgm
    // set option to change music in-game
    var musicEnabled = false;
    var bgm = new BABYLON.Sound("bgm", "/sound/ambiance.mp3", gameScene, null, { loop: true, autoplay: false });

    var toggleBgm = function() {
        console.log("bgm toggling");
        console.log("bgm on");
        musicEnabled = true;
        bgm.play();
        
        return gameScene;
    }

    function musicOff() {
        musicEnabled = false;
        bgm.stop();
    }

    gameUI.addControl(settings);


    //Controls...Mouse
    //We start without being locked.
    var isLocked = false;

    // On click event, request pointer lock
    gameScene.onPointerDown = function () {
        
        //true/false check if we're locked, faster than checking pointerlock on each single click.
        if (!isLocked) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }
        
    };


    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function () {
        var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
        
        // If the user is already locked
        if (!controlEnabled) {
            //camera.detachControl(canvas);
            isLocked = false;
        } else {
            //camera.attachControl(canvas);
            isLocked = true;
        }
    };

    // Pause Text
    var pause_text = new BABYLON.GUI.TextBlock('Pause');
    pause_text.fontSize = 100;
    pause_text.color = "white";
    pause_text.text = "Paused";
    gameUI.addControl(pause_text);
    pause_text.isVisible = false;

    // Pause Function
    /*window.addEventListener("keydown", function (evt) {
        // space key down
        if (evt.keyCode === 80 && gamePlay) {
            if(!pause) {
                pause_text.isVisible = true;
                pause = true;
                //engine.stopRenderLoop();
            }
            else {
                pause_text.isVisible = false;
                pause = false;
                gameScene.animationsEnabled = false;
                engine.runRenderLoop(function(){
                    gameScene.render();
                });
            }
        }
    });*/

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

    // import village
    var env = BABYLON.SceneLoader.ImportMesh("","./assets/", "scene.glb", gameScene, function(object) { 
        object.forEach((mesh,index) => {

            mesh.receiveShadows = true;

            mesh.checkCollisions = true;

            mesh.doNotSyncBoundingInfo = true;
            mesh.convertToUnIndexedMesh = true;
            mesh.manualUpdateOfWorldMatrixInstancedBuffer = true;
            mesh.checkOnlyOnce = true;
        });
    });
    engine.hideLoadingUI();
        
    var testsphere = BABYLON.MeshBuilder.CreateSphere("testball", {diameter: 10}, gameScene);
    testsphere.position.y = 200;
    testsphere.physicsImpostor = new BABYLON.PhysicsImpostor(testsphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 12.1 }, gameScene);


    var testbox = BABYLON.MeshBuilder.CreateBox("testbox", {diameter: 20}, gameScene);
    testbox.position = new BABYLON.Vector3(90,300,  0);

    testbox.physicsImpostor = new BABYLON.PhysicsImpostor(testbox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2.1 }, gameScene);

    var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", {diameter: 20}, gameScene);
    sphere1.position = new BABYLON.Vector3(90,200,0);

    sphere1.physicsImpostor = new BABYLON.PhysicsImpostor(sphere1, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 13.1 }, gameScene);


    //Geometry
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, gameScene);

    var box1 = BABYLON.MeshBuilder.CreateBox("Box1", {height: 3, width: 3, depth: 3}, gameScene);

    var baseGround = BABYLON.MeshBuilder.CreateGround("baseGround", {width: 500, height: 500, subdivsions: 4}, gameScene);

    // Physics impostor
    baseGround.physicsImpostor = new BABYLON.PhysicsImpostor(baseGround, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction:0.5, restitution: 2.7 }, gameScene);

    var grassMaterial = new BABYLON.StandardMaterial("grasses", gameScene);
    grassMaterial.diffuseTexture = new BABYLON.Texture("./assets/grass.jpg", gameScene);
    grassMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    baseGround.material = grassMaterial;

    //Light
    gameScene.ambientColor = new BABYLON.Color3(1,1,1);
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1,1,0), gameScene);
    var gl = new BABYLON.GlowLayer("sphere", gameScene);
    light1.intensity = 0.5;

    //Color
    var myMaterial = new BABYLON.StandardMaterial("myMaterial", gameScene);

    myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
    myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    myMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
    myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    sphere.material = myMaterial;


    //Position   
    sphere.position = new BABYLON.Vector3(50,50,0);
    box1.position.y = 60.5;
    box1.rotation.y = 1;
    baseGround.position.y = 2;

    // Create a particle system
    // set particle system to snow or similar 

    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, gameScene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("assets/leave.png", gameScene);
    //particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);

    // Where the particles come from
    particleSystem.emitter = box1; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 2, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(500, 2, 70); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 5.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 5.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    // Emission rate
    particleSystem.emitRate = 30000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(0, -1, 0);
    particleSystem.direction2 = new BABYLON.Vector3(-100, 10, 100);
    particleSystem.direction3 = new BABYLON.Vector3(0, -5, 10);
    particleSystem.direction4 = new BABYLON.Vector3(10, -10, 10);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();


    //Animation
    const FPS = 60;
    var animationBox = new BABYLON.Animation("myAnimation", "rotation.y", FPS, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // An array with all animation keys
    var keys = []; 

    //At the animation key 0, the value of scaling is "1"
    keys.push({
    frame: 0,
    value: 1
    });

    //At the animation key 20, the value of scaling is "0.2"
    keys.push({
    frame: 20,
    value: 6
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
    frame: 100,
    value: 1
    });

    animationBox.setKeys(keys);
    box1.animations = [];
    box1.animations.push(animationBox);

    gameScene.beginAnimation(box1, 0, FPS, true, 0.2);

    return gameScene;

};