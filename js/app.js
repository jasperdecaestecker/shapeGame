(function()
{
	var stage, boxes, player, world, width, height, blockades;
	var ticker, keys;
	var startLocation;
	var level1;
	var possibleShapes;

	var worldHeight = 0;
	var worldWidth = 0;
	var arrMap;

	var tileset;
	var mapData;

	function init()
	{
		stage = new  createjs.Stage("cnvs");
		width = stage.canvas.width;
		height = stage.canvas.height;

		startLocation = {x:0,y: 10};

		boxes = [];		
		blockades = [];

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

		var flickerAPI = "js/maps/map1.json";
		$.getJSON( flickerAPI, 
		{
			format: "json"
		}).done(function(data) 
		{
			mapData = data;
			tileset = new Image();
			tileset.src = "js/maps/tile_map1.png";
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

				// met de gid van de layerdata kan je ook een texture uit een sprite halen voor bv een object.
				/*var cellBitmap = new createjs.Sprite(tilesetSheet);
					cellBitmap.gotoAndStop(layerData.objects[i].gid);
					  cellBitmap.x = startLocation.x
		            cellBitmap.y = startLocation.y
		            world.addChild(cellBitmap);*/
				player = new Player(startLocation.x,startLocation.y,20,20,0);
				player.gravity = world.gravity;
				player.friction = world.friction;
				world.addChild(player.shape);
    		}
		}
		if(layerData.name == "obstakels")
		{
			for ( var i = 0; i < layerData.objects.length; i++) 
    		{
    			var blockade = new Blockade(layerData.objects[i].x-10,layerData.objects[i].y-10,20,20,layerData.objects[i].type);
				world.addChild(blockade.shape);
				blockades.push(blockade);
    		}
		}
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
					var platform = new Platform(cellBitmap.x, cellBitmap.y,tilewidth,tileheight);
					//world.addChild(platform.shape);
					boxes.push(platform);
	            }

				world.addChild(cellBitmap);
			}
		}
	}

	function keyup(e)
	{
		keys[e.keyCode] = false;
	}

	function keydown(e)
	{
		keys[e.keyCode] = true;
	}

	function update()
	{
		if(keys[32])
		{
			// change shape
			player.nextShape();
			keys[32] = false;
		}
		if(keys[37])
		{
			if(player.velX > - player.speed)
			{
				player.velX --;
			}
		}
		if(keys[39])
		{
			if(player.velX < player.speed)
			{
				player.velX ++;
			}
		}
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

		player.grounded = false;			

		for(var i = 0; i < boxes.length; i++)
		{
				//console.log(CollisionDetection.checkCollision(player,boxes[i]));
				switch(CollisionDetection.checkCollision(player,boxes[i],true))
				{
					case "l":
					case "r":
						player.velX = 0;
						break;
						case "t":
						//player.velY *= -1;
						break;
						case "b":
							player.grounded = true;
							player.jumping = false;
								//console.log("b");
						break;
				}
			
		}

		for(var j = 0; j < blockades.length; j ++)
		{
			switch(CollisionDetection.checkCollision(player,blockades[j]))
			{
				case "l":
				case "r":
				case "t":
				case "b":
					if(blockades[j].blockadeShape == player.currentPlayerShape)
					{
						console.log("safe");
					}
					else
					{
						console.log("dead");
						player.x = startLocation.x;
						player.y = startLocation.y;
					}
					break;
			}
		}
				
	
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

	/*function buildBlockades()
	{
		var blockade = new Blockade(140,180,20,20,1);
		world.addChild(blockade.shape);
		blockades.push(blockade);

		var blockade = new Blockade(270,380,20,20,2);
		world.addChild(blockade.shape);
		blockades.push(blockade);

		world.removeChild(blockade.shape);
	}

	function buildPlatforms()
	{
		var platform = new Platform(0,200,150,10);
		world.addChild(platform.shape);
		boxes.push(platform);

		var platform = new Platform(150,450,50,10);
		world.addChild(platform.shape);
		boxes.push(platform);

		var platform = new Platform(250,400,50,10);
		world.addChild(platform.shape);
		boxes.push(platform);

		var platform = new Platform(380,380,50,10);
		world.addChild(platform.shape);
		boxes.push(platform);
	}*/

	function buildBounds()
	{
		//boxes.push(new Bound(0,world.height-1,world.width,1));
		boxes.push(new Bound(0,0,world.width,1));
		boxes.push(new Bound(0,0,1,world.height));
		boxes.push(new Bound(world.width-1,0,1,world.height));
	}	

	init();
})();