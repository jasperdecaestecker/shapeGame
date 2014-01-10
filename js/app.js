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
	var arrTooltips;
	var menu;


	var tileset;
	var mapData;
	var vehicle;

	var prevPlayerY = 0;
	var startButton;

	var delayAnimationB, delayAnimationCountB;

	function init()
	{
		//chape
		stage = new  createjs.Stage("cnvs");
		width = stage.canvas.width;
		height = stage.canvas.height;

		possibleShapes = ["square","circle","triangle","rectangle"];

		this.playerFollowOffsetY = this.playerFollowOffsetX = 0;

		this.currentLevel = 10;
		checkCookie();
		console.log("maxLevelReached= " + this.maxLevelReached);

		makeMenu();

		this.delayAnimation = 6;
		this.delayAnimationCount = 1;

		this.delayAnimationB = 20;
		this.delayAnimationCountB = 1;

		this.delayShooting = 60;
		this.delayShootingCount = 1;

		//

		ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.setPaused(false);
		ticker.addEventListener("tick",update);

		// comment volgende voor startscherm te tonen
		startButtonClicked();
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
		arrTooltips = [];

		if(this.currentLevel == 20)
		{
			dropShape1 = false;
			dropShape2 = false;
		}

		startGame(levelNumber);
	}

	function startGame(levelNumber)
	{
		loadMap(levelNumber);

		/*ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.addEventListener("tick",update);*/

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

		var imageData = {images: ["images/lucht3.png"], frames: {width:800, height:400} }; 
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
				var tooltip = new Tooltip(0, 0, 100,100,"press space to jump",1);
				//tooltip.pop();
				this.world.addChild(tooltip.container);
				arrTooltips.push(tooltip);
				break;
			case 2:	
				arrShapeVolgorde = ["square","square","triangle"];
				break;
			case 3:
				arrShapeVolgorde = ["triangle","square","circle"];
				break;	
			case 4:
				arrShapeVolgorde = ["circle","square","square","rectangle","triangle"];	
				break;
			case 5:
				var ladder = new Ladder(360,637,40,300);
				this.world.addChild(ladder.container);
				ladders.push(ladder);

				var ladder = new Ladder(220,383,40,280);
				this.world.addChild(ladder.container);
				ladders.push(ladder);
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
				this.playerFollowOffsetY = -100;
				var movingPlatform = new MovingPlatform(100,500,300,300,120,20,2,"yellow");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(1);

				var movingPlatform = new MovingPlatform(500,100,400,400,120,20,2,"yellow");
				this.world.addChild(movingPlatform.container);
				arrMovingPlatforms.push(movingPlatform);
				movingPlatform.attach(2);

				arrShapeVolgorde = ["triangle","square","circle"];
				break;	
			case 11:
				this.playerFollowOffsetY = 0;	
			case 20:
				var blockade = new Blockade(200,520,20,20,possibleShapes[Math.floor(Math.random() * possibleShapes.length)],0);
				this.world.addChild(blockade.container);
				arrDropShapes.push(blockade);

				var blockade = new Blockade(560,520,20,20,possibleShapes[Math.floor(Math.random() * possibleShapes.length)],0);
				this.world.addChild(blockade.container);
				arrDropShapes.push(blockade);

				this.playerFollowOffsetY = -100;
				boss = new Boss(10,680,80,80);
				this.world.addChild(boss.container);
				arrShapeVolgorde = ["rectangle","rectangle","square"];
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

	function makeMovingPlatform()
	{
		//arrMovingPlatforms.push()
	
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
		if(e.keyCode == 69) // 69 hihi
		{
			actionKeyPressed = false;
		}
	}

	function keydown(e)
	{
		keys[e.keyCode] = true;
		//console.log(e.keyCode);
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
					if(this.currentLevel == 20)
					{
						if(i == 0)
						{
							dropShape1 = true;	
							/*arrDropShapes[i].blockadeShape = "rectangle";
							arrDropShapes[i].draw();*/
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

						console.log("blockade1Id:" + blockade1Id);
						console.log("blockade2Id:" + blockade2Id);

						//console.log("arrMovingPlatforms[blockade1Id-1].attachId: " + arrMovingPlatforms[blockade1Id-1].attachId);
						//console.log("arrMovingPlatforms[blockade1Id-2].attachId: " + arrMovingPlatforms[blockade2Id-1].attachId);


						var tempX = blockades[blockade1Id-1].x;
						var tempY =  blockades[blockade1Id-1].y;

						blockades[blockade1Id-1].changePosition(blockades[blockade2Id-1].x,blockades[blockade2Id-1].y);
						blockades[blockade2Id-1].changePosition(tempX,tempY);

						//var tempId = blockade1Id;
						arrLevers[i].arrChangeBlockades[0] = blockade2Id;
						arrLevers[i].arrChangeBlockades[1] = blockade1Id;

						for(var j = 0; j < arrMovingPlatforms.length; j++)
						{	
							if(arrMovingPlatforms[j].attachId != null)
							{
								arrMovingPlatforms[j].attachId = arrLevers[i].arrChangeBlockades[j];
							}
						}


						/*if(arrMovingPlatforms[blockade1Id-1].attachId != null)
						{
							arrMovingPlatforms[blockade1Id-1].dettach();
							arrMovingPlatforms[blockade1Id-1].attach(blockade2Id);
						}

						if(arrMovingPlatforms[blockade2Id-1].attachId != null)
						{
							arrMovingPlatforms[blockade2Id-1].dettach();
							arrMovingPlatforms[blockade2Id-1].attach(blockade1Id);
						}*/

						//if(arrMovingPlatforms[blockade1Id-1].attachId)



						/*for(var j = 0; j < arrMovingPlatforms.length; j++)
						{		
	//console.log("j :" + j);
							if(arrMovingPlatforms[j].attachId != null)
							{
							
								console.log("arrMovingPlatforms[j].attachId :" + arrMovingPlatforms[j].attachId);
								console.log(arrMovingPlatforms[j].attachId);
								arrMovingPlatforms[j].dettach();

								if(j == 0)
								{
									arrMovingPlatforms[j].attach(arrLevers[i].arrChangeBlockades[1]);
								}
								else
								{
									arrMovingPlatforms[j].attach(arrLevers[i].arrChangeBlockades[0]);
								}
								
							}
						}	*/
							//arrMovingPlatforms[0].attach(0);

						
					}
				break;
			}
		}

	
		

	}

	function update()
	{
		if(ticker.getPaused())
		{
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

			this.world.followPlayerX(player,width,this.playerFollowOffsetX);
			this.world.followPlayerY(player,height,this.playerFollowOffsetY);

			player.update();


			/*if(arrTooltips.length != 0)
			{
				if(player.x > 200)
				{
					arrTooltips[0].container.x = player.x;
					arrTooltips[0].container.y = player.y;
					arrTooltips[0].pop();
				}
			}*/
			


			// gevallen door de grond = mors dood	
			if(player.y > this.world.height)
			{
				player.x = startLocation.x;
				player.y = startLocation.y;
				restartLevel();
				/*if(this.currentLevel == 20)
				{
					
					clearLevel();
					restartLevel();
					startLevel(this.currentLevel);
				}
				else
				{
					restartLevel();
				}*/
			}
		}

		stage.update();
		
	}

	function checkIfBossLevel()
	{
		if(this.currentLevel == 20)
		{
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
				//boss.nextShape(shape);
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

			console.log(usingLadder);

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
			arrMovingPlatforms[i].update();

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
						player.grounded = true;
						player.jumping = false;
						playerisOnMovingTrajectory[i] = true;
						console.log(i);
			
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
				if(this.currentLevel <= this.maxLevelReached)
				{
					
				}
				setCookie("maxLevelReached",this.currentLevel+1,365);
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