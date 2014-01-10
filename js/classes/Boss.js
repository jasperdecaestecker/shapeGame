var Boss = (function()
{
	var container;
	var shape;
	var arrProjectiles;
	var projectileId;
	var bossShapes = ["square","circle","triangle"];
	var cellBitmap;

	function Boss(x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speedX = 2;
		this.speedY = 1;
		this.startX = 0;
		this.endX = 700;
		this.hits = 0;
		this.delayShooting = 60;
		this.delayShootingCount = 1;
		this.arrProjectiles = [];
		this.projectileId = 0;
		this.currentShape = bossShapes[this.hits];

		this.shape = new createjs.Shape(); 
		this.container = new createjs.Container(); 
		this.container.x = this.x;
		this.container.y = this.y;
		
	
		this.draw();
	}

	Boss.prototype.draw = function()
	{
		this.container.removeChild(this.cellBitmap);
		this.shape.graphics.c();
		var imageData = {images: ["images/bossSprite.png"], frames: {width:74, height:74} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		this.cellBitmap = new createjs.Sprite(tilesetSheet);

		switch(this.currentShape)
		{
			case "square":

				this.cellBitmap.gotoAndStop(0);
				break;
			case "triangle":

				this.cellBitmap.gotoAndStop(2);
				break;	
			case "circle":

				this.cellBitmap.gotoAndStop(1);

			
			break;
		}

		this.container.addChild(this.cellBitmap);


	
	}

	Boss.prototype.nextShape = function(shape)
	{
		//this.container.removeAllChildren();
		this.currentShape = shape;
		this.draw();
	}

	Boss.prototype.update = function()
	{
		if(this.x > this.endX || this.x < this.startX)
		{
			this.speedX *= -1;
		}
		if(this.startY != this.endY)
		{
			if(this.y > this.startY || this.y < this.endY)
			{
				this.speedY *= -1;
			}
			this.y += this.speedY;
				this.cellBitmap.y = this.y
		}
	
		this.x += this.speedX;
		

		this.cellBitmap.x = this.x;
	

	}

	Boss.prototype.hit = function()
	{
		this.hits++;
		console.log(this.hits);
		this.delayShooting -= 10;
	
		this.speedX *=1.5;
		this.nextShape(bossShapes[this.hits]);
	}

	return Boss;
})();