(function()
{
	var stage, boxes, player, world, width, height, blockades, ladders, shapeVolgorde, arrTriggeredBlockadesIds, usingLadder, endPosition, startScreen;
	var arrLevers;
	var arrMovingPlatforms;
	var currentLevel;
	var ticker, keys;
	var startLocation;
	var level1;
	var possibleShapes;
	var playerisOnMovingTrajectory;
	var playerFollowOffsetY, playerFollowOffsetX;
	var boss;
	var actionKeyPressed;
	var arrProjectiles;
	var arrDropShapes;
	var dropShape1;
	var dropShape2;
	var worldHeight = 0;
	var worldWidth = 0;
	var arrMap;
	var tooltip;
	var menu, chooseLevels;

	var shape;

	var tileset;
	var mapData;
	var vehicle;

	var prevPlayerY = 0;
	var startButton;

	var delayAnimationB, delayAnimationCountB;

	var musicPlaying;

	var cellBitmapPlay;

	function init()
	{
		//chape
		stage = new  createjs.Stage("cnvs");
		width = stage.canvas.width;
		height = stage.canvas.height;

		possibleShapes = ["square","circle","triangle","rectangle"];

		this.playerFollowOffsetY = this.playerFollowOffsetX = 0;

		this.currentLevel = 1;
		checkCookie();
		console.log("maxLevelReached= " + this.maxLevelReached);

		makeMenu();

		this.delayAnimation = 6;
		this.delayAnimationCount = 1;

		this.delayAnimationB = 20;
		this.delayAnimationCountB = 1;

		this.delayShooting = 60;
		this.delayShootingCount = 1;

		this.playedBossLevelOnce = false;
		//

		ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.setPaused(false);
		ticker.addEventListener("tick",update);

		loadSounds();
	}

	function loadSounds()
	{
        this.arrSounds = [
        	{id:"shapeCorrect", src:"shapeCorrect.ogg"},
        	{id:"bossHit", src:"bossHit.ogg"},
            {id:"death", src:"death.ogg"},
            {id:"musicGrass", src:"musicGrass.mp3"},
            {id:"musicBoss", src:"musicBoss.ogg"}
        ];

		createjs.Sound.alternateExtensions = ["mp3"];
        preload = new createjs.LoadQueue(true, "sounds/");
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("complete", doneLoadingSound);
        preload.loadManifest(this.arrSounds);

    	var imageData = {images: ["images/playpauze.png"], frames: {width:24, height:25} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		this.cellBitmapPlay = new createjs.Sprite(tilesetSheet);
		this.cellBitmapPlay.x = 750;
		this.cellBitmapPlay.y = 25;
		this.cellBitmapPlay.gotoAndStop(0);
    	stage.addChild(this.cellBitmapPlay);

    	this.cellBitmapPlay.addEventListener('click',switchSounds);

		this.musicPlaying = "play";
	}

    function switchSounds(e)
    {
    	if(this.musicPlaying=="play")
    	{
			this.cellBitmapPlay.gotoAndStop(1);
			this.musicPlaying= "pause";
			 createjs.Sound.setMute(true);
			//muteSound();
    	}
    	else if(this.musicPlaying == "pause")
    	{
    		this.cellBitmapPlay.gotoAndStop(0);
    		this.musicPlaying = "play";
    		createjs.Sound.setMute(false);
    		//playSound();
    	}
    }

    function doneLoadingSound() 
    {
        createjs.Sound.play("musicGrass", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.2});
        createjs.Sound.setMute(false);
	}	
        

	function makeMenu()
	{
		this.menu = new createjs.Container();

		// BG
		var imageData = {images: ["bgmall.png"], frames: {width:800, height:400} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(0);
		cellBitmap.x = 0;
		cellBitmap.y = 0;
		this.menu.addChild(cellBitmap);

		var imageData = {images: ["images/spriteButtons.png"], frames: {width:499, height:81} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);

		// STARTKNOP
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.x = width/2 - 250;
		cellBitmap.y = 100;
		console.log(cellBitmap.x);
		cellBitmap.gotoAndStop(0);
		cellBitmap.addEventListener("click",startButtonClicked);
		this.menu.addChild(cellBitmap);


		// CHOOSE LEVEL KNOP
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(1);
		cellBitmap.x = width/2 - 250;
		cellBitmap.y = 200;
		cellBitmap.addEventListener("click",chooseLevelClicked);
		this.menu.addChild(cellBitmap);

		//this.menu.addChild(startKnop);

		stage.addChild(this.menu);


		//this.startScreen = new StartScreen(0,0,800,400);
		//stage.addChild(this.startScreen.container);

		
	}

	function chooseLevelClicked()
	{
		console.log(this.maxLevelReached);
		if(this.menu)
		{
			stage.removeChild(this.menu);
		}
		

		this.chooseLevels = new createjs.Container();
		var imageData = {images: ["bgmall.png"], frames: {width:800, height:400} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(0);
		cellBitmap.x = 0;
		cellBitmap.y = 0;
		this.chooseLevels.addChild(cellBitmap);

		var imageData = {images: ["images/backbtn.png"], frames: {width:162, height:62} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(0);
		cellBitmap.x = 14;
		cellBitmap.y = 20;
		this.chooseLevels.addChild(cellBitmap);
		cellBitmap.addEventListener("click",backClicked);

		var countClick = 0;
		for(var i=0;i<3;i++)
		{
			console.log('for 1');
			for (var j=0;j<4;j++)
			{
				console.log('for 2');

				this.shape = new createjs.Shape();
				this.shape.graphics.c();
				this.shape.graphics.f("252323");
				this.shape.graphics.drawCircle(0,0,32);
				this.shape.graphics.ef();
				this.shape.x = 90*j+270; 
				this.shape.y = 90*i+100;
				this.shape.name = countClick;

				if(countClick<maxLevelReached)
				{
					this.shape.addEventListener('click', lvlButtonClicked);
				}
				
				this.chooseLevels.addChild(this.shape);

				this.shape = new createjs.Shape();
				this.shape.graphics.c();
				this.shape.graphics.f("dfdae1");
				this.shape.graphics.drawCircle(0,0,29);
				this.shape.graphics.ef();
				this.shape.x = 90*j+270; 
				this.shape.y = 90*i+100;
				this.shape.name = countClick;

				if(countClick<maxLevelReached)
				{
					this.shape.addEventListener('click', lvlButtonClicked);
				}

				this.chooseLevels.addChild(this.shape);

				this.shape = new createjs.Shape();
				this.shape.graphics.c();
				if(countClick<maxLevelReached)
				{
					this.shape.graphics.f("66bf9d");
				}
				else
				{
					this.shape.graphics.f("a7a7a7");
				}
				
				this.shape.graphics.drawCircle(0,0,25);
				this.shape.graphics.ef();
				this.shape.x = 90*j+270; 
				this.shape.y = 90*i+100;
				this.shape.name = countClick;

				if(countClick<maxLevelReached)
				{
					this.shape.addEventListener('click', lvlButtonClicked);
				}

				this.chooseLevels.addChild(this.shape);

				var showLevel = countClick+1;
				var text = new createjs.Text(showLevel.toString(), "bold 30px Helvetica", "#252323");
	            if(showLevel>9)
	            {
	            	text.x = 90*j+252;
	            }
	            else
	            {
		            text.x = 90*j+263;
	            }
	            text.y = 90*i+82;
	            text.name = countClick;

	            if(countClick<maxLevelReached)
				{
	           		 text.addEventListener('click', lvlButtonClicked);
				}
	            this.chooseLevels.addChild(text);

				countClick++;

			}
		}


		stage.addChild(this.chooseLevels);
	}

	function backClicked(e)
	{
		stage.removeChild(this.chooseLevels);
		makeMenu();
	}

	function lvlButtonClicked(e)
	{
		console.log('clicked '+e.currentTarget.name);
		var lvlClicked = e.currentTarget.name + 1;
		this.currentLevel = lvlClicked;
		startLevel(this.currentLevel);
		
	}

	function startButtonClicked()
	{
		startLevel(this.currentLevel);
		//this.startScreen.container.alpha =

		stage.removeChild(this.menu);
	}

	function restartLevel()
	{
		// zet de vorm van de getriggerde blockades terug op het scherm
		console.log(blockades);
		for(var i = 0; i < arrTriggeredBlockadesIds.length; i ++)
		{
			//console.log(blockades[arrTriggeredBlockadesIds[i]]);
			this.world.addChild(blockades[arrTriggeredBlockadesIds[i]].container);
		}

		// herpositioneer de blockades op hun originele position
		for(var i = 0; i < blockades.length; i ++)
		{
			blockades[i].changePosition(blockades[i].orgX,blockades[i].orgY);
		}

		arrProjectiles = [];
		arrTriggeredBlockadesIds = [];
		shapeVolgorde.reset();
		player.nextShape(shapeVolgorde.arrShapes[shapeVolgorde.currentShapeNumber]);
	}

	function startLevel(levelNumber)
	{
		startLocation = {};
		boxes = [];		
		arrMovingPlatforms = [];
		blockades = [];
		arrTriggeredBlockadesIds = [];
		ladders = [];
		arrLevers = [];
		changeShape = false;
		playerisOnMovingTrajectory = [false];
		actionKeyPressed = false;
		this.arrProjectiles = [];
		arrDropShapes = [];
		keys = [];

		if(this.currentLevel == 12)
		{
			dropShape1 = false;
			dropShape2 = false;
			this.startBoss = false;
			this.elevatorDown = false;
			createjs.Sound.stop();
			createjs.Sound.play("musicBoss", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.2});
		}

		startGame(levelNumber);
	}

	function startGame(levelNumber)
	{
		loadMap(levelNumber);

		window.onkeyup = keyup;
		window.onkeydown = keydown;
	}

	function loadMap(mapNumber)
	{
		var pathToMap = "js/maps/map"+mapNumber+".json";
		$.getJSON( pathToMap, 
		{
			format: "json"
		}).done(function(data) 
		{
			mapData = data;
			tileset = new Image();
			tileset.src = "js/maps/tiles.png";
			tileset.onLoad = initLayers();
			mapLoaded();
		});
	}

	function mapLoaded()
	{
		ticker.setPaused(true);
		/*this.startScreen = new StartScreen("background");
		this.world.addChild(this.startScreen.shape);

		this.startScreen = new StartScreen("shape");
		this.world.addChild(this.startScreen.shape);
		this.startScreen.shape.addEventListener("click", startRealLevel);*/
	}

	function test()
	{
		console.log("click");
	}

	function initLayers() 
	{
		var w = mapData.tilesets[0].tilewidth;
		var h = mapData.tilesets[0].tileheight;

		this.world = new World(mapData.width * w,mapData.height * h);
		this.world.boundH = -(this.world.height - height);
		this.world.boundW = -(this.world.width - width);
		stage.addChild(this.world.container);

		//var bgImagePath = "images/lucht3.png";
		if(this.currentLevel <= 8)
		{
			bgImagePath = "images/lucht3.png";
		}
		else if(this.currentLevel >= 9 && this.currentLevel <= 11)
		{
			bgImagePath = "images/lucht1.png";
		}
		else
		{
			bgImagePath = "images/lucht2.png";
		}
		var imageData = {images: [bgImagePath], frames: {width:800, height:400} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		

		for(var i = 0; i < this.world.height; i += 400)
		{
			for(var j = 0; j < this.world.width; j += 800)
			{
				var cellBitmap = new createjs.Sprite(tilesetSheet);
				cellBitmap.x = j;
				cellBitmap.y = i;
				this.world.addChild(cellBitmap);
			}
		}


		

		buildBounds();

	    var imageData = 
	    {
			images : [ tileset ],
			frames : 
			{
				width : w,
				height : h
			}
		};
		var tilesetSheet = new createjs.SpriteSheet(imageData);
	
		for (var i = 0; i < mapData.layers.length; i++) 
		{
			var layerData = mapData.layers[i];
			if (layerData.type == 'tilelayer')
			{
				initLayer(layerData, tilesetSheet, mapData.tilewidth, mapData.tileheight);
			}
			if(layerData.type == "objectgroup")
			{
				makeObject(layerData, tilesetSheet, mapData.tilewidth, mapData.tileheight);
			}
		}
	}

	function setShapeVolgorde()
	{
		var arrShapeVolgorde = [];
		switch(this.currentLevel)
		{
			case 1:
				arrShapeVolgorde = ["triangle","square"];
				this.tooltip = new Tooltip(0, 0, 100,100,"press space to jump",180);
				this.world.addChild(this.tooltip.container);	
				break;
			case 2:	
				arrShapeVolgorde = ["square","square","triangle"];
				break;
			case 3:
				arrShapeVolgorde = ["triangle","square","circle"];
				break;	
			case 4:
				this.tooltip = new Tooltip(0, 0, 100,100,"press E to use lever",180);
				this.world.addChild(this.tooltip.container);	
				arrShapeVolgorde = ["circle","square","square","rectangle","triangle"];	
				break;
			case 5:
				var ladder = new Ladder(360,637,40,300);
				this.world.addChild(ladder.container);
				ladders.push(ladder);

				var ladder = new Ladder(220,383,40,280);
				this.world.addChild(ladder.container);
				ladders.push(ladder);

				this.tooltip = new Tooltip(0, 0, 120,100,"press up/down to climb ladder",180);
				this.world.addChild(this.tooltip.container);

				arrShapeVolgorde = ["triangle","rectangle","circle","triangle"];
				break;
			case 6:
				var ladder = new Ladder(40,90,40,250);
				this.world.addChild(ladder.container);
				ladders.push(ladder);
				arrShapeVolgorde = ["triangle","circle","square"];
				break;	
			case 7:
				arrShapeVolgorde = ["square","rectangle"];
				var movingPlatform = new MovingPlatform(200,400,320,120,60,20,1,"red");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(1);

				var movingPlatform = new MovingPlatform(700,500,320,120,60,20,1,"yellow");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(2);
				break;	
			case 8:
				var movingPlatform = new MovingPlatform(240,240,280,750,60,20,3,"red");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);

				var movingPlatform = new MovingPlatform(480,480,280,750,60,20,2,"yellow");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				arrShapeVolgorde = ["rectangle","circle","square"];
				break;	
			case 9:
				var movingPlatform = new MovingPlatform(0,0,580,260,100,20,2,"red");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);

				var movingPlatform = new MovingPlatform(540,760,260,480,100,20,2,"yellow");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				arrShapeVolgorde = ["square","rectangle","circle","square","triangle"];
				break;	
			case 10:
				var ladder = new Ladder(40,120,40,270);
				this.world.addChild(ladder.container);
				ladders.push(ladder);

				var ladder = new Ladder(960,30,40,351);
				this.world.addChild(ladder.container);
				ladders.push(ladder);

				this.playerFollowOffsetY = -100;
				var movingPlatform = new MovingPlatform(100,440,300,300,120,20,2,"yellow");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(3);

				var movingPlatform = new MovingPlatform(460,0,420,420,120,20,2,"yellow");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(2);

				arrShapeVolgorde = ["triangle","square","circle","rectangle"];
				break;	
			case 11:
				var movingPlatform = new MovingPlatform(80,350,450,450,60,20,2,"yellow");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(1);

				var movingPlatform = new MovingPlatform(400,100,300,300,60,20,2,"red");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(2);

				var movingPlatform = new MovingPlatform(60,320,160,260,60,20,1,"red");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(3);

				var ladder = new Ladder(220,47,40,490);
				this.world.addChild(ladder.container);
				ladders.push(ladder);
				this.playerFollowOffsetY = 0;	

				arrShapeVolgorde = ["rectangle","square","triangle","triangle","circle","square","circle"];
				break;
			case 12:
				var movingPlatform = new MovingPlatform(320,320,80,540,100,20,2,"red");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);

				var blockade = new Blockade(210,710,20,20,possibleShapes[Math.floor(Math.random() * possibleShapes.length)],0);
				this.world.addChild(blockade.container);
				arrDropShapes.push(blockade);

				var blockade = new Blockade(570,710,20,20,possibleShapes[Math.floor(Math.random() * possibleShapes.length)],0);
				this.world.addChild(blockade.container);
				arrDropShapes.push(blockade);

				this.playerFollowOffsetY = -160;
				boss = new Boss(10,860,80,80);
				this.world.addChild(boss.container);
				arrShapeVolgorde = ["rectangle"];
				break;	
		}

		shapeVolgorde = new ShapeVolgorde(arrShapeVolgorde,0);
		shapeVolgorde.container.x = 20;
		shapeVolgorde.container.y = 20;
		stage.addChild(shapeVolgorde.container);
	}

	function makeObject(layerData, tilesetSheet, tilewidth, tileheight)
	{
		if(layerData.name == "player")
		{
			for ( var i = 0; i < layerData.objects.length; i++) 
    		{
				if(layerData.objects[i].name == "spawnPoint")
				{
					setShapeVolgorde();
					//makeMovingPlatform();
								
					startLocation.x = layerData.objects[i].x;
					startLocation.y = layerData.objects[i].y;
					player = new Player(startLocation.x,startLocation.y,40,40,shapeVolgorde.arrShapes[shapeVolgorde.currentShapeNumber]);
					player.gravity = this.world.gravity;
					player.friction = this.world.friction;
					player.grounded = false;
					this.world.addChild(player.container);

					if(this.currentLevel == 12)
					{
						if(this.playedBossLevelOnce)
						{
							player.x = 380;
							player.y = 440;
						}
					}

				}
				else if(layerData.objects[i].name == "endPoint")
				{
					endPosition = new EndPosition(layerData.objects[i].x,layerData.objects[i].y,24,64);
					this.world.addChild(endPosition.container);
				}
    		}


		}
		if(layerData.name == "obstakels")
		{
			for ( var i = 0; i < layerData.objects.length; i++) 
    		{
    			var blockade = new Blockade(layerData.objects[i].x,layerData.objects[i].y,40,40,layerData.objects[i].type, i);
				this.world.addChild(blockade.container);
				blockades.push(blockade);
    		}
		}

		if(layerData.name == "levers")
		{
			for ( var i = 0; i < layerData.objects.length; i++) 
    		{
    			var lever = new Lever(layerData.objects[i].x,layerData.objects[i].y,70,45,layerData.objects[i].type);
    			this.world.addChild(lever.container);
    			lever.container.addEventListener("click", test);
    			arrLevers.push(lever);
    		}
		}


	}

	function initLayer(layerData, tilesetSheet, tilewidth, tileheight) 
	{
		for ( var y = 0; y < layerData.height; y++) 
	    {
			for ( var x = 0; x < layerData.width; x++) 
	        {
				var cellBitmap = new createjs.Sprite(tilesetSheet);
				var i = x + y * layerData.width;
				cellBitmap.gotoAndStop(layerData.data[i] - 1);

	            cellBitmap.x = x * tilewidth;
	            cellBitmap.y = y * tileheight;

	            if(layerData.name == "platforms" && layerData.data[i] != 0)
	            {
					var platform = new Platform(cellBitmap.x, cellBitmap.y,tilewidth,tileheight);
					boxes.push(platform);
	            }
				this.world.addChild(cellBitmap);
			}
		}
	}

	// aanroepen vooraleer je een nieuw level start
	function clearLevel()
	{
		this.world.container.removeAllChildren();
		stage.removeChild(this.world.container);


		//ticker.removeEventListener("tick",update);
	}

	function keyup(e)
	{
		keys[e.keyCode] = false;
		if(e.keyCode == 69) // 69 hihi //<- vuil! dat komt van Jasper :-)
		{
			actionKeyPressed = false;
		}
	}

	function keydown(e)
	{
		keys[e.keyCode] = true;
		console.log(e.keyCode);
	}

	function checkLeverActivated()
	{
		for(var i = 0; i < arrLevers.length; i++)
		{
			var colDir = CollisionDetection.checkCollision(player,arrLevers[i],false,usingLadder);
			switch(colDir)
			{
				case "l":
				case "r":
				case "t":
				case "b":
					arrLevers[i].change();
					if(this.currentLevel == 12)
					{
						if(i == 0)
						{
							dropShape1 = true;	
						}
						else
						{
							dropShape2 = true;
						}
					}
					else
					{
						var blockade1Id = arrLevers[i].arrChangeBlockades[0];
						var blockade2Id = arrLevers[i].arrChangeBlockades[1];

						var tempX = blockades[blockade1Id-1].x;
						var tempY =  blockades[blockade1Id-1].y;

						blockades[blockade1Id-1].changePosition(blockades[blockade2Id-1].x,blockades[blockade2Id-1].y);
						blockades[blockade2Id-1].changePosition(tempX,tempY);

						arrLevers[i].arrChangeBlockades[0] = blockade2Id;
						arrLevers[i].arrChangeBlockades[1] = blockade1Id;

						for(var j = 0; j < arrMovingPlatforms.length; j++)
						{	
							if(arrMovingPlatforms[j].attachId != null && this.currentLevel != 11)
							{
								arrMovingPlatforms[j].attachId = arrLevers[i].arrChangeBlockades[j];
							}	
						}
					}
				break;
			}
		}
	}

	function update()
	{
		if(ticker.getPaused())
		{
			//cheats
			if(keys[78] && keys[76])
			{
				if(this.currentLevel<12)
				{
					var nextLevel = this.currentLevel+1;
					clearLevel();
					startLevel(nextLevel);
					this.currentLevel = nextLevel;
				}
				else if(this.currentLevel == 12)
				{
					this.currentLevel = 1;
					clearLevel();
					startLevel(this.currentLevel);
				}
			}

			if(keys[80] && keys[76])
			{
				if(this.currentLevel>1)
				{
					var previousLevel = this.currentLevel-1;
					clearLevel();
					startLevel(previousLevel);
					this.currentLevel = previousLevel;
				}
				else if(this.currentLevel == 1)
				{
					this.currentLevel = 12;
					clearLevel();
					startLevel(this.currentLevel);
				}
			}


			if(keys[82] && keys[76])
			{
				clearLevel();
				this.currentLevel = 1;
				startLevel(this.currentLevel);
				setCookie("maxLevelReached",this.currentLevel,365);
				this.maxLevelReached = 1;
			}

			if(keys[65] && keys[76])
			{
				clearLevel();
				this.currentLevel = 12;
				setCookie("maxLevelReached",this.currentLevel,365);
				this.maxLevelReached = 12;
				chooseLevelClicked();
			}

			if(keys[77] && keys[69])
			{
				clearLevel();
				makeMenu();
			}

			if(keys[67] && keys[76])
			{
				clearLevel();
				chooseLevelClicked();
			}

			//keys game
			if(keys[39] || keys[37])
			{
				if(this.delayAnimationCountB % this.delayAnimationB == 0)
				{
					player.animation();
					this.delayAnimationCountB = 1;
				}
				else
				{
					this.delayAnimationCountB++;
				}
			}
			
			if(keys[69] && actionKeyPressed == false)
			{	
				actionKeyPressed = true;
				checkLeverActivated();
			}
			
			if(keys[32])
			{
				if(player.grounded && !player.jumping)
				{
					player.grounded = false;
					player.jumping = true;
					player.velY -= player.speed * 2.2;
				}
			}
			if(keys[37])
			{
				if(player.velX >- player.speed)
				{
					player.velX --;
				}
				player.grounded = false;
				playerisOnMovingTrajectory = [false];
			}
			if(keys[39])
			{
				if(player.velX < player.speed)
				{
					player.velX ++;
				}
				player.grounded = false;
				playerisOnMovingTrajectory = [false];
			}		

			checkCollisionPlatforms();
			checkLadders();
			checkMovingPlatform();
			checkBlockadesCollision();
			checkIfFinished();
			checkIfBossLevel();
			checkTooltip();

			this.world.followPlayerX(player,width,this.playerFollowOffsetX);
			this.world.followPlayerY(player,height,this.playerFollowOffsetY);

			player.update();

			// gevallen door de grond = mors dood	
			if(player.y > this.world.height)
			{
				createjs.Sound.play("death", {interupt:createjs.Sound.INTERRUPT_ANY,volume:0.4});
				player.x = startLocation.x;
				player.y = startLocation.y;
				restartLevel();
				if(this.currentLevel == 12)
				{	
					clearLevel();
					restartLevel();
					startLevel(this.currentLevel);
				}
				
			}
		}

		stage.update();
	}

	function checkTooltip()
	{
		if(this.currentLevel == 1 && player.x > 150 && this.tooltip.popped == false)
		{
			this.tooltip.pop();
		}

		if(this.currentLevel == 4 && player.x > 280 && this.tooltip.popped == false)
		{
			this.tooltip.pop();
		}

		if(this.currentLevel == 5 && player.x > 300 && this.tooltip.popped == false)
		{
			this.tooltip.pop();
		}

		if(this.currentLevel == 1 || this.currentLevel == 4 || this.currentLevel == 5)
		{
			if(this.tooltip.popped && this.tooltip.stopped == false)
			{
				this.tooltip.container.x = 20 + player.x - this.tooltip.container.getBounds().width/2;
				this.tooltip.container.y = player.y - 40;
				this.tooltip.timeDelayCount++;
				if(this.tooltip.timeDelayCount > this.tooltip.timeDelay)
				{
					this.tooltip.stopped = true;
					this.tooltip.container.alpha = 0;
					this.world.addChild(this.tooltip.container);	
				}
			}
		}

		
	}

	function checkIfBossLevel()
	{
		if(player.y > 500 && this.startBoss == false)
		{
			this.elevatorDown = false;
			this.startBoss = true;
		}

		if(this.currentLevel == 12 && this.startBoss)
		{
			this.playedBossLevelOnce = true;
			if(dropShape1)
			{
				arrDropShapes[0].y+=3;
				arrDropShapes[0].container.y+=3;
				if(arrDropShapes[0].container.y > this.world.height)
				{
					dropShape1 = false;
				}
			}
			if(dropShape2)
			{
				arrDropShapes[1].y+=3;
				arrDropShapes[1].container.y+=3;
				if(arrDropShapes[1].container.y > this.world.height)
				{
					dropShape2 = false;
				}
			}

			if(dropShape1 || dropShape2)
			{
				for(var i = 0; i < arrDropShapes.length;i++)
				{
					switch(CollisionDetection.checkCollision(boss,arrDropShapes[i],false,usingLadder))
					{
						case "l":
						case "r":
						case "t":
						case "b":
							if(arrDropShapes[i].blockadeShape == boss.currentShape)
							{
								boss.hit();
								createjs.Sound.play("bossHit", createjs.Sound.INTERRUPT_ANY);
								arrDropShapes[i].blockadeShape = possibleShapes[Math.floor(Math.random() * possibleShapes.length)];
								arrDropShapes[i].draw();
								arrDropShapes[i].changePosition(arrDropShapes[i].orgX,arrDropShapes[i].orgY);
								if(i == 0)
								{
									dropShape1 = false;
								}
								else if(i == 1)
								{
									dropShape2 = false;
								}

								if(boss.hits == 3)
								{
									console.log("won");
									clearLevel();
									this.currentLevel++;
									startLevel(this.currentLevel);
								}
							}
						break;
					}
				}
			}
			
			if(boss.delayShootingCount % boss.delayShooting == 0)
			{
				var shape = possibleShapes[Math.floor(Math.random() * possibleShapes.length)];
				var blockade = new Blockade(boss.x+40,boss.y,40,40,shape, boss.projectileId);
				this.world.addChild(blockade.container);
				this.arrProjectiles.push(blockade);
				boss.projectileId++;
				boss.delayShootingCount = 1;
			}
			else
			{
				boss.delayShootingCount++;
			}
			checkCollisionPlayerWithProjectiles();
			boss.update();
		}
	}

	function checkCollisionPlayerWithProjectiles()
	{
		for(var i = 0; i < this.arrProjectiles.length; i++)
		{
			this.arrProjectiles[i].y-= 3;
			this.arrProjectiles[i].container.y-= 3;
			if(this.arrProjectiles[i].y < 0)
			{
				this.arrProjectiles.splice(i, 1);
			}

			switch(CollisionDetection.checkCollision(player,this.arrProjectiles[i],false,usingLadder))
			{
				case "l":
				case "r":
				case "t":
				case "b":
					if(this.arrProjectiles[i].blockadeShape == player.currentPlayerShape)
					{
						this.world.removeChild(this.arrProjectiles[i].container);
						this.arrProjectiles.splice(i, 1);
						player.nextShape(possibleShapes[Math.floor(Math.random() * possibleShapes.length)]);

						arrDropShapes[0].blockadeShape = possibleShapes[Math.floor(Math.random() * possibleShapes.length)];
						arrDropShapes[0].draw();
						arrDropShapes[0].changePosition(arrDropShapes[0].orgX,arrDropShapes[0].orgY);

						arrDropShapes[1].blockadeShape = possibleShapes[Math.floor(Math.random() * possibleShapes.length)];
						arrDropShapes[1].draw();
						arrDropShapes[1].changePosition(arrDropShapes[1].orgX,arrDropShapes[1].orgY);
					}
					else
					{
						clearLevel();
						restartLevel();
						startLevel(this.currentLevel);
					}
					break;
			}
		}
	}

	function checkCollisionPlatforms()
	{
		if(!usingLadder)
		{
			var breakThisSwitch = false;
			for(var i = 0; i < boxes.length; i++)
			{
				switch(CollisionDetection.checkCollision(player,boxes[i],true,usingLadder))
				{
					case "l":
					case "r":
						player.velX = 0;
						breakThisSwitch = true;
						break;
						case "t":
							if(!usingLadder)
							{
								 player.velY *= -1;
							}
							breakThisSwitch = true;
						break;
						case "b":
							player.grounded = true;
							player.jumping = false;
							breakThisSwitch = true;
						break;
				}
				if(breakThisSwitch)
				{
					return;
				}
			}
		}
	}

	function checkLadders()
	{
		var breakThisSwitch = false;

		for(var i = 0; i < ladders.length; i++)
		{
			var colDir = CollisionDetection.checkCollision(player,ladders[i],false,usingLadder);
			switch(colDir)
			{
				case "l":
				case "r":
				case "t":
				case "b":
					if(keys[38])
					{
						usingLadder = true;
						player.x = ladders[i].x;
						player.y -= 2;
						player.grounded = true;
					}
					else if(keys[40])
					{
						usingLadder = true;
						player.grounded = true;
						player.y += 2;
						player.x = ladders[i].x;
					}

					if(player.y + 12 > ladders[i].y + ladders[i].height)
					{
						player.y -= 2;
						player.grounded = true;
					}
					breakThisSwitch = true;
					break;
				default:
					usingLadder = false;
					break;	
			}

			if(breakThisSwitch)
			{
				return;
			}
		}	
	}

	function checkMovingPlatform()
	{
		for(var i = 0; i < arrMovingPlatforms.length; i++)
		{
			if(this.currentLevel != 12 || this.elevatorDown)
			{
				arrMovingPlatforms[i].update();
			}
			
			if(arrMovingPlatforms[i].attachId != null)
			{
				blockades[arrMovingPlatforms[i].attachId-1].changePosition(arrMovingPlatforms[i].x+(arrMovingPlatforms[i].width/2 - 20),arrMovingPlatforms[i].y-40);
			}

			if(playerisOnMovingTrajectory[i])
			{
				player.x += arrMovingPlatforms[i].speedX;
				player.y += arrMovingPlatforms[i].speedY;
			}

			var colDir = CollisionDetection.checkCollision(player,arrMovingPlatforms[i],true,usingLadder);
			switch(colDir)
			{
				case "l":
				case "r":
					player.velX = 0;
					break;
					case "t":
						if(!usingLadder)
						{
							 player.velY *= -1;
						}
					break;
					case "b":
						if(this.elevatorDown == false && this.startBoss == false)
						{
							console.log(this.elevatorDown);
							this.elevatorDown = true;
						}
						player.grounded = true;
						player.jumping = false;
						playerisOnMovingTrajectory[i] = true;
		
					break;
			}
		}
	}

	function checkIfFinished()
	{
		switch(CollisionDetection.checkCollision(player,endPosition,false,false))
		{
			case "l":
			case "r":
			case "t":
			case "b":
				if(this.currentLevel >= this.maxLevelReached)
				{
					setCookie("maxLevelReached",this.currentLevel+1,365);
				}
				clearLevel();
				this.currentLevel++;
				startLevel(this.currentLevel);
				break;
		}
	}

	function checkCookie()
	{
		var maxLevelReached=getCookie("maxLevelReached");
		if(maxLevelReached!="")
	  	{
	  		this.maxLevelReached = maxLevelReached;
	  	}
	  	else
	  	{
	  		this.maxLevelReached = 1;
	  	}
	}

	function setCookie(cname,cvalue,exdays)
	{
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	function getCookie(cname)
	{
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		  {
		  var c = ca[i].trim();
		  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		  }
		return "";
	}

	function checkBlockadesCollision()
	{
		for(var j = 0; j < blockades.length; j ++)
		{
			switch(CollisionDetection.checkCollision(player,blockades[j],false,false))
			{
				case "l":
				case "r":
				case "t":
				case "b":

					var triggeredBlockId = blockades[j].blockadeId;

					if($.inArray(triggeredBlockId, arrTriggeredBlockadesIds) == -1)
					{
						if(blockades[j].blockadeShape == player.currentPlayerShape)
						{
							createjs.Sound.play("shapeCorrect", {interupt:createjs.Sound.INTERRUPT_ANY,volume:0.3});
							arrTriggeredBlockadesIds.push(triggeredBlockId);
							this.world.removeChild(blockades[j].container);
							shapeVolgorde.nextShape();
							if(shapeVolgorde.arrShapes[shapeVolgorde.currentShapeNumber] != null)
							{
								player.nextShape(shapeVolgorde.arrShapes[shapeVolgorde.currentShapeNumber]);
							}
						}
						else
						{
							createjs.Sound.play("death", {interupt:createjs.Sound.INTERRUPT_ANY,volume:0.4});
							player.x = startLocation.x;
							player.y = startLocation.y;
							restartLevel();
						}
					}
					break;
			}
		}
	}

	function buildBounds()
	{
		//boxes.push(new Bound(0,this.world.height-1,this.world.width,1));
		boxes.push(new Bound(0,0,this.world.width,1));
		boxes.push(new Bound(0,0,1,this.world.height));
		boxes.push(new Bound(this.world.width-1,0,1,this.world.height));
	}	

	init();
})();