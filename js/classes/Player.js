var Player = (function()
{
	var shape, currentPlayerShape;
	var playerShapes = ["square","triangle","circle"];
	//var currentPlayerShape = 0;

	function Player(x,y,width,height,currentPlayerShape)
	{
		this.currentPlayerShape = currentPlayerShape;

		this.x = x;
		this.y = y;

		this.velX = 0;
		this.velY = 0;
		this.speed = 3;
		this.friction = 0.8;
		this.grounded = true;
		this.jumping = false;
		this.gravity = 0.3;

		this.width = width;
		this.height = height;
		

		this.container = new createjs.Container(); 
		this.shape = new createjs.Shape();

		this.shape.x = this.x;
		this.shape.y = this.y;


		
		
		this.draw();
	}

	Player.prototype.draw = function()
	{
		//console.log(playerShapes[playerShapeNumber]);
		switch(this.currentPlayerShape)
		{
			case "square":
				this.shape.graphics.c();
				this.shape.graphics.f("00FF00");
				this.shape.graphics.drawRect(0,0,this.width,this.height);
				this.shape.graphics.ef();
			break;
			case "circle":
				this.shape.graphics.c();
				this.shape.graphics.f("00FF00");
				this.shape.graphics.drawCircle(0,0,this.height);
				this.shape.graphics.ef();
				/*var imageData = {images: ["manneke.png"], frames: {width:40, height:48} }; 
				var tilesetSheet = new createjs.SpriteSheet(imageData);
				var cellBitmap = new createjs.Sprite(tilesetSheet);
				cellBitmap.x = this.x;
				cellBitmap.y = this.y;
				//cellBitmap.gotoAndStop(layerData.data[i] - 1);


		//this.whale = new createjs.Container(); 
		//this.shape = new createjs.Shape();
		console.log(cellBitmap);
		this.container.addChild(cellBitmap);*/


			break;
			case "triangle":
				this.shape.graphics.c();
				this.shape.graphics.f("00FF00");
				this.shape.graphics.mt(0,0);
				this.shape.graphics.lt(this.width,this.height);
				this.shape.graphics.lt(0,this.height);
				this.shape.graphics.lt(0,0);
				this.shape.graphics.ef();
			break;


			
			
		}
	}

	Player.prototype.nextShape = function(shape)
	{
		//console.log("currentPlayerShape" + currentPlayerShape);

		this.draw(shape);
		this.currentPlayerShape = shape;

		/*if(this.currentPlayerShape == playerShapes.length-1)
		{
			this.currentPlayerShape = 0;
		}
		else
		{
			this.currentPlayerShape++;
		}
		this.draw(this.currentPlayerShape);*/
	}

	Player.prototype.update = function()
	{

		//console.log("x :" + this.x);
		//console.log("y :" + this.y);
		if(this.grounded)
		{
			this.velY = 0;
		}

		this.x += this.velX;
		this.y += this.velY;
		/*this.container.x = this.x;
		this.container.y = this.x;*/
		this.shape.x = this.x;
		this.shape.y = this.y;
		//this.shape.y = this.y;
		this.velY += this.gravity;
		this.velX *= this.friction;
	}

	return Player;

})();