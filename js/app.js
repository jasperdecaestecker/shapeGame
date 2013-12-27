(function()
{
	var stage, boxes, player, world, width, height, blockades, shapeVolgorde, triggerBlockIds;
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

		startLocation = {x:0,y: 10};

		boxes = [];		
		blockades = [];
		triggerBlockIds = [];
		//blockadesTriggered = [];
		//blockades = {};
		changeShape = false;

		loadMap();

		world = new World(800,400);

		stage.addChild(world.container);

		ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.addEventListener("tick",update);

		window.onkeyup = keyup;
		window.onkeydown = keydown;
	}

	function loadMap()
	{

		var nameMap = "map1";
		var flickerAPI = "js/maps/"+nameMap+".json";
		$.getJSON( flickerAPI, 
		{
			format: "json"
		}).done(function(data) 
		{
			mapData = data;
			tileset = new Image();
			tileset.src = "js/maps/tile_"+nameMap+".png";
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
				startLocation.x = layerData.objects[i].x;
				startLocation.y = layerData.objects[i].y;

				var arrShapes = ["triangle","square","triangle"];
				shapeVolgorde = new ShapeVolgorde(arrShapes,0);


				player = new Player(startLocation.x,startLocation.y,20,20,arrShapes[shapeVolgorde.currentShapeNumber]);
				player.gravity = world.gravity;
				player.friction = world.friction;
				player.grounded = false;


				world.addChild(shapeVolgorde.container);
				world.addChild(player.shape);
				world.addChild(player.container);

				shapeVolgorde.container.x = 20;
				shapeVolgorde.container.y = 20;
    		}
		}
		if(layerData.name == "obstakels")
		{
			for ( var i = 0; i < layerData.objects.length; i++) 
    		{
    			var blockade = new Blockade(layerData.objects[i].x-10,layerData.objects[i].y-10,20,20,layerData.objects[i].type, i);
				world.addChild(blockade.shape);
				blockades.push(blockade);
				//blockades.push(blockade);
			//	console.log(Object.keys(blockades).length);

				//blockade.shape.addEventListener("click", handleClick);
    		}
		}
	}

	function click(event)
	{
		console.log("click");
	}

	function loadRestOfShit()
	{
		world.boundH = -(world.height - height);
		world.boundW = -(world.width - width);

		keys = [];
		buildBounds();
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
					vehicle = new SteeredVehicle(stage.canvas.width, stage.canvas.height, 
						Math.round(Math.random()*stage.canvas.width), 
						Math.round(Math.random()*stage.canvas.height));

					vehicle.setRender(movingPlatform);
					vehicle.setSpeed(8);
					vehicle.setRotation(180);

					var ticker = createjs.Ticker;
					ticker.useRAF = true;
					ticker.setFPS(60);
					ticker.addEventListener("tick", handleTick);

					console.log('vehicle position '+vehicle.x);
					boxes.push(movingPlatform);*/

	            }

				world.addChild(cellBitmap);
			}
		}
	}

	function handleTick()
	{
		vehicle.update();

		stage.update();		
	}

	function keyup(e)
	{
		keys[e.keyCode] = false;
	}

	function keydown(e)
	{
		keys[e.keyCode] = true;
		console.log(e.keyCode);
		//
	}

	function update()
	{
		// 65 A 90 Z 69 E 82 R 
		/*if(keys[65])
		{
			console.log(blockades);

		
		}
		if(keys[90])
		{
			player.nextShape("triangle");
			//console.log(blockadesTriggered);
		}
		if(keys[69])
		{
			player.nextShape("circle");
				player.nextShape("square");
		}*/

		if(keys[38])
		{
			if(player.grounded && !player.jumping)
			{
				player.grounded = false;
				player.jumping = true;
				player.velY -= player.speed * 2;
				//console.log("jump");
			}
		}
		if(keys[32])
		{
			// change shape
			keys[32] = false;
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



		/*if(keys[40])
		{
			if(player.grounded && !player.jumping)
			{
				player.velY+=player.speed * 5;
				player.grounded = false;
				player.jumping = true;
				//player.velY -= player.speed * 2;
				//console.log("jump");
			}
		}*/

		//player.grounded = false;			

		for(var i = 0; i < boxes.length; i++)
		{
			switch(CollisionDetection.checkCollision(player,boxes[i],true))
			{
				case "l":
				case "r":
					player.velX = 0;
					break;
					case "t":
					 player.velY *= -1;
					break;
					case "b":
						player.grounded = true;
						player.jumping = false;
					break;
			}


		}

		checkBlockadesCollision();

		/*for(var j = 0; j < blockades.length; j ++)
		{
			var pt = blockades[j].shape.globalToLocal(player.x, player.y);
		
			if(blockades[j].shape.hitTest(pt.x,pt.y))
			{
				console.log(blockades[j]);
			}

			var pt = player.shape.localToLocal(10, 0, blockades[j].shape);
		
			if(blockades[j].shape.hitTest(pt.x,pt.y))
			{
				console.log(blockades[j]);
			}


		}*/

	

				
	
		world.followPlayerX(player,width,0);
		world.followPlayerY(player,height,0);

		player.update();
		stage.update();

		// gevallen door de grond = mors dood	
		if(player.y > height)
		{
			player.x = startLocation.x;
			player.y = startLocation.y;
		}


	}

	function checkBlockadesCollision()
	{
		for(var j = 0; j < blockades.length; j ++)
		{
			switch(CollisionDetection.checkCollision(player,blockades[j]))
			{
				case "l":
				case "r":
				case "t":
				case "b":
					var triggeredBlockId = blockades[j].blockadeId;
					if($.inArray(triggeredBlockId, triggerBlockIds) == -1)
					{
						if(blockades[j].blockadeShape == player.currentPlayerShape)
						{
							triggerBlockIds.push(triggeredBlockId);
							world.removeChild(blockades[j].shape);
							console.log(triggerBlockIds);
							shapeVolgorde.nextShape();
							player.nextShape(shapeVolgorde.arrShapes[shapeVolgorde.currentShapeNumber]);
						}
						else
						{
							console.log("dead");
							player.x = startLocation.x;
							player.y = startLocation.y;
						}
					}
					break;
			}
		}
	}

	function buildBounds()
	{
		//boxes.push(new Bound(0,world.height-1,world.width,1));
		boxes.push(new Bound(0,0,world.width,1));
		boxes.push(new Bound(0,0,1,world.height));
		boxes.push(new Bound(world.width-1,0,1,world.height));
	}	

	init();
})();