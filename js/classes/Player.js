var Player = (function()
{
	var shape, currentPlayerShape;
	//var playerShapes = ["square","triangle","circle","rectangle"];
	var circlePositie;
	//var currentPlayerShape = 0;
	var cellBitmap;
	var spritePos;

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


		this.circlePositie = 0;


		this.shape.x = this.x;
		this.shape.y = this.y;

		/*this.shape.x = this.x;
		this.shape.y = this.y;*/


		this.container.x = this.x;
		this.container.y = this.y;

		this.draw();

		this.spritePos = 0;
	}

	Player.prototype.draw = function()
	{
		var imageData = {images: ["images/playerSprite.png"], frames: {width:40, height:48} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		this.cellBitmap = new createjs.Sprite(tilesetSheet);
		this.container.removeChild(this.cellBitmap);
		switch(this.currentPlayerShape)
		{
			
			case "circle":
				this.shape.graphics.c();
				this.shape.graphics.f("00FF00");
				this.shape.graphics.drawCircle(0,0,this.height/2);
				this.shape.graphics.ef();
				this.shape.x = 20;
				this.shape.y += this.height/2;
				this.shape.alpha = 0; // shape niet verwijderen, maar hiden, makkelijker voor te debuggen.
				this.cellBitmap.gotoAndStop(0);
				this.cellBitmap.x = 0;
				this.cellBitmap.y = -8;
				this.circlePositie = 0;
			break;
			case "triangle":
				this.shape.graphics.c();
				this.shape.graphics.f("00FF00");
				this.shape.graphics.mt(0,this.height);
				this.shape.graphics.lt(this.width,this.height);
				this.shape.graphics.lt(this.width/2,0);
				this.shape.graphics.ef();
				this.shape.x = 0;
				this.shape.y = 0;
				this.shape.alpha = 0;
				this.container.addChild(this.shape);
				this.cellBitmap.x = 0;
				this.cellBitmap.y = -9;
				this.cellBitmap.gotoAndStop(1);
			break;
			case "square":
				this.shape.graphics.c();
				this.shape.graphics.f("00FF00");
				this.shape.graphics.drawRect(0,0,this.width,this.height);
				this.shape.graphics.ef();
				this.shape.x = 0;
				this.shape.y = 0;
				this.shape.alpha=0;
				this.cellBitmap.x = 0;
				this.cellBitmap.y = -9;
				this.cellBitmap.gotoAndStop(2);
			break;
			case "rectangle":
				this.shape.graphics.c();
				this.shape.graphics.f("00FF00");
				this.shape.graphics.drawRect(0,0,this.width,this.height);
				this.shape.graphics.ef();
				this.shape.x = 0;
				this.shape.y = 0;
				this.shape.alpha=0;
				this.cellBitmap.x = 0;
				this.cellBitmap.y = -9;
				this.cellBitmap.gotoAndStop(3);
			break;
		}

		this.container.addChild(this.cellBitmap);
	}

	Player.prototype.nextShape = function(shape)
	{
		this.container.removeAllChildren();
		this.currentPlayerShape = shape;
		this.draw(this.currentPlayerShape);
	}

	Player.prototype.animation = function()
	{
		switch(this.currentPlayerShape)
		{
			case 'circle':
				if(this.spritePos == 0)
				{
					this.cellBitmap.gotoAndStop(0);
					this.spritePos = 1;
				}
				else if(this.spritePos == 1)
				{
					this.cellBitmap.gotoAndStop(4);
					this.spritePos = 0;
				}
			break;
			case 'square':
				if(this.spritePos == 0)
				{
					this.cellBitmap.gotoAndStop(2);
					this.spritePos = 1;
				}
				else if(this.spritePos == 1)
				{
					this.cellBitmap.gotoAndStop(6);
					this.spritePos = 0;
				}
			break;
			case 'triangle':
				if(this.spritePos == 0)
				{
					this.cellBitmap.gotoAndStop(1);
					this.spritePos = 1;
				}
				else if(this.spritePos == 1)
				{
					this.cellBitmap.gotoAndStop(5);
					this.spritePos = 0;
				}
			break;
			case 'rectangle':
				if(this.spritePos == 0)
				{
					this.cellBitmap.gotoAndStop(3);
					this.spritePos = 1;
				}
				else if(this.spritePos == 1)
				{
					this.cellBitmap.gotoAndStop(7);
					this.spritePos = 0;
				}
			break;
		}
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
		/*this.shape.x = this.x;
		this.shape.y = this.y;*/
		this.velY += this.gravity;
		this.velX *= this.friction;
	}

	return Player;

})();