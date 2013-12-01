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

	function init()
	{
		


		stage = new  createjs.Stage("cnvs");
		width = stage.canvas.width;
		height = stage.canvas.height;

		startLocation = {x:0,y: 10};

		loadMap();

		world = new World(600,420);

		world.boundH = -(world.height - height);
		world.boundW = -(world.width - width);

		//player = new Player(Math.round(world.width/2),world.height-20,20,20,0);
		player = new Player(startLocation.x,startLocation.y,20,20,0);
		player.gravity = world.gravity;
		player.friction = world.friction;
		

		boxes = [];
		blockades = [];
		keys = [];
		buildBounds();

		

		buildBlockades();
		buildPlatforms();

		//level1 = new Level(1);
		//level1.

		world.addChild(player.shape);
		stage.addChild(world.container);

		ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.addEventListener("tick",update);

		window.onkeyup = keyup;
		window.onkeydown = keydown;
	}


	function loadMap()
	{

		var flickerAPI = "test.json";
		  $.getJSON( flickerAPI, 
		  {
		    tags: "mount rainier",
		    tagmode: "any",
		    format: "json"
		  })
		    .done(function( data ) 
		    {
		    	console.log(data);
				worldHeight = data.height * data.tileheight;
				worldWidth = data.height * data.tileweight;
		        console.log(data.layers[0].data);
		        arrMap = Array();
		        //arrMap.push(arr);

		    });

		/*var xml = "<map>" +
		"<line>+ + + + x + + + + + x x x x +</line>" +
		"<line>x x + + x + + + + x x + + + +</line>" +
		"<line>+ + + x x + + + + + x + + + x</line>" +
		"<line>+ + + + + + x + + + + + x x +</line>" +
		"<line>x + + + + + x x + x x + + + +</line>" +
		"<line>+ + + x x + + + + + + + + + x</line>" +
		"<line>+ + + x x + + + + + + x + x x</line>" +
		"<line>+ + + + + + + x + + x x x x x</line>" +
		"<line>+ x x x x x x + + + x + + + x</line>" +
		"<line>+ + + + + + + + x x + + + + +</line>" +
		"<line>+ x + + + + + + + x + + x x +</line>" +
		"<line>+ x x + + + + + + + + + + + e</line>" +
		"</map>";

		arrMap = Array();

		xmlDoc = $.parseXML( xml );
		$xml = $( xmlDoc );
		$title = $xml.find("line").each(function()
		{
			gridHeight++;
			var line = $(this).text();
			
			var arr = line.split(" ");
			gridWidth = arr.length;
		
			arrMap.push(arr);
		});

		console.log(arrMap);*/
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
		

	}

	function buildBlockades()
	{
		var blockade = new Blockade(140,180,20,20,1);
		world.addChild(blockade.shape);
		blockades.push(blockade);

		var blockade = new Blockade(270,380,20,20,2);
		world.addChild(blockade.shape);
		blockades.push(blockade);
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



		/*for(var i = 0;i < 10; i++)
		{
		
			var platform = new Platform(50+(i*90),world.height-50-(i*50),50,20);
			world.addChild(platform.shape);
			boxes.push(platform);
		}*/
	}

	function buildBounds()
	{
		boxes.push(new Bound(0,world.height-1,world.width,1));
		boxes.push(new Bound(0,0,world.width,1));
		boxes.push(new Bound(0,0,1,world.height));
		boxes.push(new Bound(world.width-1,0,1,world.height));
	}	

	init();
})();