var Player = (function()
{
	var shape, currentPlayerShape;
	var playerShapes = ["square","triangle","circle"];
	var circlePositie;
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

		this.container.x = this.x;
		this.container.y = this.y;

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
				this.shape.alpha = 0; // shape niet verwijderen, maar hiden, makkelijker voor te debuggen.
				//var imageData = {images: ["manneke.png"], frames: {width:40, height:48} }; 

				var imageData = {images: ["cirkelke.png"], frames: {width:43, height:48} }; 
				var tilesetSheet = new createjs.SpriteSheet(imageData);
				var cellBitmap = new createjs.Sprite(tilesetSheet);
				cellBitmap.x = -20;
				cellBitmap.y = - 26;

				this.circlePositie = 0;
				//cellBitmap.gotoAndStop(layerData.data[i] - 1);
				this.container.addChild(cellBitmap);
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
		this.currentPlayerShape = shape;
		this.draw(this.currentPlayerShape);
	}

	Player.prototype.animation = function(shape)
	{
		console.log('update');
		if(this.circlePositie == 0)
		{
			this.circlePositie = 1;
		}
		else
		{
			this.circlePositie = 0;
		}
		this.cellBitmap.gotoAndStop(this.circlePositie);
	}

	Player.prototype.update = function()
	{
		if(this.grounded)
		{
			this.velY = 0;
		}

		this.x += this.velX;
		this.y += this.velY;
		this.container.x = this.x;
		this.container.y = this.y;
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.velY += this.gravity;
		this.velX *= this.friction;
	}

	return Player;

})();