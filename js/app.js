(function()
{
	var stage, boxes, player, world, width, height, blockades, ladders, shapeVolgorde, arrTriggeredBlockadesIds, usingLadder;
	var arrLevers;
	var currentLevel;
	var ticker, keys;
	var startLocation;
	var level1;
	var possibleShapes;

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

		this.currentLevel = 1;

		startLevel(this.currentLevel);

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
		blockades = [];
		arrTriggeredBlockadesIds = [];
		ladders = [];
		arrLevers = [];
		changeShape = false;

		loadMap(levelNumber);

		this.world = new World(800,400);
		this.world.boundH = -(this.world.height - height);
		this.world.boundW = -(this.world.width - width);
		keys = [];
		buildBounds();

		stage.addChild(this.world.container);

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
			tileset.src = "js/maps/tile_map"+mapNumber+".png";
			tileset.onLoad = initLayers();
		});
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

		loadRestOfShit();
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
						switch(this.currentLevel)
				{
					case 1:
						var ladder = new Ladder(560,60,20,280);
						this.world.addChild(ladder.shape);
						ladders.push(ladder);
						shapeVolgorde = new ShapeVolgorde(["triangle","square","triangle"],0);
						

						break;
					case 2:	
						shapeVolgorde = new ShapeVolgorde(["square","square","triangle"],0);
						break;
				}
					
					
					startLocation.x = layerData.objects[i].x;
					startLocation.y = layerData.objects[i].y;
					player = new Player(startLocation.x,startLocation.y,20,20,shapeVolgorde.arrShapes[shapeVolgorde.currentShapeNumber]);
					player.gravity = this.world.gravity;
					player.friction = this.world.friction;
					player.grounded = false;

					this.world.addChild(player.shape);
					this.world.addChild(player.container);
				}
				else if(layerData.objects[i].name == "endPoint")
				{
					var endPosition = new EndPosition(layerData.objects[i].x,layerData.objects[i].y,24,64);
					this.world.addChild(endPosition.container);


					console.log(endPosition.x);
				}

			

				
				this.world.addChild(shapeVolgorde.container);
			

				shapeVolgorde.container.x = 20;
				shapeVolgorde.container.y = 20;
    		}
		}
		if(layerData.name == "obstakels")
		{
			for ( var i = 0; i < layerData.objects.length; i++) 
    		{
    			var blockade = new Blockade(layerData.objects[i].x-10,layerData.objects[i].y-10,20,20,layerData.objects[i].type, i);
				this.world.addChild(blockade.shape);
				blockades.push(blockade);
    		}
		}

		if(layerData.name == "levers")
		{
			for ( var i = 0; i < layerData.objects.length; i++) 
    		{
    			var lever = new Lever(layerData.objects[i].x-20,layerData.objects[i].y-34,70,45,layerData.objects[i].type);
    			this.world.addChild(lever.container);
    			lever.container.addEventListener("click", handleClick);
    			arrLevers.push(lever);
    		}
		}
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

					//moving platform

					/*var movingPlatform = new Platform(cellBitmap.x, cellBitmap.y,tilewidth,tileheight);

					var movingPlatform = new Platform(cellBitmap.x, cellBitmap.y,tilewidth,tileheight);
					this.world.addChild(movingPlatform.shape);

					vehicle = new SteeredVehicle(stage.canvas.width, stage.canvas.height, 
						Math.round(Math.random()*stage.canvas.width), 
						Math.round(Math.random()*stage.canvas.height));

					vehicle.setRender(movingPlatform.shape);
					vehicle.setSpeed(8);
					vehicle.setRotation(180);

					var ticker = createjs.Ticker;
					ticker.useRAF = true;
					ticker.setFPS(60);
					ticker.addEventListener("tick", handleTick);

					console.log('vehicle position '+vehicle.x);
					boxes.push(movingPlatform);*/

	            }

				this.world.addChild(cellBitmap);
			}
		}
	}

	function handleTick()
	{
		vehicle.update();

		console.log("handletick");

		stage.update();		
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
	}

	function keydown(e)
	{
		keys[e.keyCode] = true;
		console.log(e.keyCode);
	}

	function update()
	{

		// E
		if(keys[69])
		{	
			console.log("e");
			clearLevel();
				this.currentLevel++;
				startLevel(this.currentLevel);
		}

		if(keys[32])
		{
			if(player.grounded && !player.jumping)
			{
				player.grounded = false;
				player.jumping = true;
				player.velY -= player.speed * 2;
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
		}
		if(keys[39])
		{
			if(player.velX < player.speed)
			{
				player.velX ++;
			}
			player.grounded = false;
		}		

		for(var i = 0; i < boxes.length; i++)
		{
			switch(CollisionDetection.checkCollision(player,boxes[i],true,usingLadder))
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
					break;
			}
		}

		
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
						player.y -= 2;
						usingLadder = true;
						player.grounded = true;
					}
					else if(keys[40])
					{
						player.y += 2;
						usingLadder = true;
						player.grounded = true;
					}
					else
					{
						usingLadder = false;
					}
					break;
				default:
					usingLadder = false;
					break;	
			}
		}

		checkBlockadesCollision();

		this.world.followPlayerX(player,width,0);
		this.world.followPlayerY(player,height,0);

		player.update();
		stage.update();

		// gevallen door de grond = mors dood	
		if(player.y > height)
		{
			player.x = startLocation.x;
			player.y = startLocation.y;
			restartLevel();
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
							this.world.removeChild(blockades[j].shape);
							console.log(blockades[j].shape);
							console.log(arrTriggeredBlockadesIds);
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