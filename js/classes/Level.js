var Level = (function()
{
	var blockades, boxes;


	function Level(levelNumber)
	{
		this.levelNumber = levelNumber;
		/*this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.draw();*/

		this.buildBlockades();
		this.buildPlatforms;
	}

	Level.prototype.buildBlockades = function()
	{
		switch(this.levelNumber)
		{
			case 1:
					var blockade = new Blockade(Math.round(world.width/2)-300,world.height-21,20,20,0);
					//world.addChild(blockade.shape);
					blockades.push(blockade);
				break;
		}
	}

	Level.prototype.buildPlatforms = function()
	{
		switch(this.levelNumber)
		{
			case 1:
				var platform = new Platform(0,200,150,10);
				//world.addChild(platform.shape);
					boxes.push(platform);

				for(var i = 0;i < 10; i++)
				{
				
					var platform = new Platform(50+(i*90),world.height-50-(i*30),50,20);
					//world.addChild(platform.shape);
					boxes.push(platform);
				}
				break;
			}
	}

	Level.prototype.buildMovingPlatforms = function()
	{
		var platform = new Platform(0,200,150,10);
		boxes.push(platform);

		for(var i = 0;i < 10; i++)
		{	
			var platform = new Platform(50+(i*90),world.height-50-(i*30),50,20);
			boxes.push(platform);
		}
	}

	return Level;

})();
