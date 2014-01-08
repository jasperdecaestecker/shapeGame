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


	var worldHeight = 0;
	var worldWidth = 0;
	var arrMap;

	var tileset;
	var mapData;
	var vehicle;

	var prevPlayerY = 0;

	function init()
	{
		stage = new  createjs.Stage("cnvs");
		width = stage.canvas.width;
		height = stage.canvas.height;

		this.playerFollowOffsetY = this.playerFollowOffsetX = 0;

		this.currentLevel = 1;

		this.startScreen = new StartScreen(0,0,800,400);
		stage.addChild(this.startScreen.container);
		this.startScreen.container.addEventListener("click", startButtonClicked);

		stage.update();

		// comment volgende voor startscherm te tonen
		startButtonClicked();
	}
	function startButtonClicked()
	{
		startLevel(this.currentLevel);
		//stage.removeChild(this.startScreen.container);
	}

	function restartLevel()
	{
		// zet de vorm van de getriggerde blockades terug op het scherm
		for(var i = 0; i < arrTriggeredBlockadesIds.length; i ++)
		{
			this.world.addChild(blockades[arrTriggeredBlockadesIds[i]].shape);
		}

		// herpositioneer de blockades op hun originele position
		for(var i = 0; i < blockades.length; i ++)
		{
			blockades[i].changePosition(blockades[i].orgX,blockades[i].orgY);
		}

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
		playerisOnMovingTrajectory = false;
		actionKeyPressed = false;


		if(this.currentLevel == 20)
		{
			this.world = new World(800,800);
		}
		else
		{
			this.world = new World(800,400);
		}
		
		this.world.boundH = -(this.world.height - height);
		this.world.boundW = -(this.world.width - width);
		
		keys = [];
		buildBounds();

		stage.addChild(this.world.container);
		startGame(levelNumber);
	}

	function startGame(levelNumber)
	{
		loadMap(levelNumber);

		ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.addEventListener("tick",update);

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
			tileset.src = "js/maps/tile_map1.png";
			tileset.onLoad = initLayers();
			mapLoaded();
		});
	}

	function mapLoaded()
	{
		//this.startScreen = new StartScreen(0,0,1000,1000);
		//this.world.addChild(this.startScreen.container);
		/*this.startScreen = new StartScreen("background");
		this.world.addChild(this.startScreen.shape);

		this.startScreen = new StartScreen("shape");
		this.world.addChild(this.startScreen.shape);
		this.startScreen.shape.addEventListener("click", startRealLevel);*/
	}

	function initLayers() 
	{
		var w = mapData.tilesets[0].tilewidth;
		var h = mapData.tilesets[0].tileheight;
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
				break;
			case 2:	
				arrShapeVolgorde = ["triangle","triangle","square"];
				break;
			case 3:
				var ladder = new Ladder(160,180,40,140);
				this.world.addChild(ladder.container);
				ladders.push(ladder);

				var ladder = new Ladder(600,152,40,108);
				this.world.addChild(ladder.container);
				ladders.push(ladder);
				arrShapeVolgorde = ["triangle","circle","square"];
				break;	
			case 20:
				this.playerFollowOffsetY = -100;
				boss = new Boss(10,680,80,80);
				this.world.addChild(boss.container);
				arrShapeVolgorde = ["triangle","triangle","square"];
				break;
						
		}
		shapeVolgorde = new ShapeVolgorde(arrShapeVolgorde,0);
		shapeVolgorde.container.x = 20;
		shapeVolgorde.container.y = 20;
		this.world.addChild(shapeVolgorde.container);
	}

	function makeObject(layerData, tilesetSheet, tilewidth, tileheight)
	{
		if(layerData.name == "player")
		{
			for ( var i = 0; i < layerData.objects.length; i++) 
    		{
				console.log(layerData.objects[i].name);
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
    			//lever.container.addEventListener("click", handleClick);
    			arrLevers.push(lever);
    		}
		}
	}

	function makeMovingPlatform()
	{
		//arrMovingPlatforms.push()
		var movingPlatform = new MovingPlatform(100,280,100,20,1,100,300,280,80);
		this.world.addChild(movingPlatform.shape);
		arrMovingPlatforms.push(movingPlatform);
	}

	function handleClick(event)
	{
		for(var j = 0; j < arrLevers.length; j ++)
		{
			arrLevers[j].change();
		}

		var tempX = blockades[0].x;
		var tempY = blockades[0].y;

		blockades[0].changePosition(blockades[1].x,blockades[1].y);
		blockades[1].changePosition(tempX,tempY);
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
	            	//normal platform
					var platform = new Platform(cellBitmap.x, cellBitmap.y,tilewidth,tileheight);
					boxes.push(platform);
					console.log("makePlatform");
	            }

				this.world.addChild(cellBitmap);
			}
		}
	}

	// aanroepen vooraleer je een nieuw level start
	function clearLevel()
	{
		stage.removeChild(this.world.container);
		ticker.removeEventListener("tick",update);
	}

	function keyup(e)
	{
		keys[e.keyCode] = false;
		if(e.keyCode == 69)
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
					console.log("toggle lever" + i);
					arrLevers[i].change();

					var blockade1Id = arrLevers[i].arrChangeBlockades[0] - 1;
					var blockade2Id = arrLevers[i].arrChangeBlockades[1] - 1;

					var tempX = blockades[blockade1Id].x;
					var tempY =  blockades[blockade1Id].y;

					blockades[blockade1Id].changePosition(blockades[blockade2Id].x,blockades[blockade2Id].y);
					blockades[blockade2Id].changePosition(tempX,tempY);


				

					/*blockades[blockade1Id - 1].changePosition(blockades[blockade2Id - 1].x,blockades[blockade1Id - 2].y);
					blockades[blockade1Id - 2].changePosition(tempX,tempY);*/


					/*var tempX = blockades[arrLevers[i].arr].x;
					var tempY = blockades[0].y;

					blockades[0].changePosition(blockades[1].x,blockades[1].y);
					blockades[1].changePosition(tempX,tempY);*/

				break;
			}
		}
	}

	function update()
	{
		//player.animation();

		// E

		if(keys[69] && actionKeyPressed == false)
		{	

			actionKeyPressed = true;
			checkLeverActivated();
			
				//clearLevel();
				//this.currentLevel++;
				//startLevel(this.currentLevel);
		}
		
		

		if(keys[32])
		{
			if(player.grounded && !player.jumping)
			{
				player.grounded = false;
				player.jumping = true;
				player.velY -= player.speed * 2.2;
				//console.log("jump");
			}
		}
		if(keys[37])
		{
			if(player.velX > - player.speed)
			{
				player.velX --;
			}
			player.grounded = false;
			playerisOnMovingTrajectory = false;
		}
		if(keys[39])
		{
			if(player.velX < player.speed)
			{
				player.velX ++;
			}
			player.grounded = false;
			playerisOnMovingTrajectory = false;
		}		

		checkCollisionPlatforms();
		checkLadders();
		checkMovingPlatform();
		checkBlockadesCollision();
		checkIfFinished();

		this.world.followPlayerX(player,width,this.playerFollowOffsetX);
		this.world.followPlayerY(player,height,this.playerFollowOffsetY);

		if(this.currentLevel == 20)
		{
			boss.update();
		}
		player.update();
		stage.update();

		// gevallen door de grond = mors dood	
		if(player.y > this.world.height)
		{
			player.x = startLocation.x;
			player.y = startLocation.y;
			restartLevel();
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
					//player.grounded = true;
					//console.log("usingLadder");
					if(keys[38])
					{
						usingLadder = true;
						player.x = ladders[i].x;
						player.y -= 2;
						
						//console.log(usingLadder);
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
			arrMovingPlatforms[i].update();

			if(playerisOnMovingTrajectory)
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
						playerisOnMovingTrajectory = true;
			
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
				clearLevel();
				this.currentLevel++;
				startLevel(this.currentLevel);

				break;
		}
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
							player.nextShape(shapeVolgorde.arrShapes[shapeVolgorde.currentShapeNumber]);
						}
						else
						{
							console.log("dead");
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