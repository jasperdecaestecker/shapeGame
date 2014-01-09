var MovingPlatform = (function()
{
	var shape;

	function MovingPlatform(startX, endX, startY, endY, width,height,speed,color)
	{
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.speedX = speed;
		this.speedY = speed;
		this.startX = this.x = startX;
		this.endX = endX;
		this.startY = this.y = startY;
		this.endY = endY;
		this.color = color;
		this.container = new createjs.Container();
		this.container.x = this.x;
		this.container.y = this.y;
		this.attachId = null;

		if(this.startX == this.endX)
		{
			this.speedX = 0;
		}

		if(this.startY == this.endY)
		{
			this.speedY = 0;
		}

		if(this.startX > this.endX)
		{
			var temp = this.endX;
			this.endX = this.startX;
			this.startX = temp;
		}

		if(this.startY < this.endY)
		{
			var temp = this.endY;
			this.endY = this.startY;
			this.startY = temp;
		}

		this.draw();
	}

	MovingPlatform.prototype.attach = function(blockadeId)
	{
		this.attachId = blockadeId;
	}

	MovingPlatform.prototype.draw = function()
	{
		var imageData = {images: ["movingPlatformSprite.png"], frames: {width:20, height:20} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		
		// left of platform
		var offset = 0;
		if(this.color == "red")
		{
			offset = 3
		}

		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(0+offset);
		cellBitmap.x = 0;
		cellBitmap.y = 0;
		this.container.addChild(cellBitmap);

		// fill center with with bitmap
		for(var i = 20; i < this.width; i += 20)
		{
			var cellBitmap = new createjs.Sprite(tilesetSheet);
			cellBitmap.gotoAndStop(1+offset);
			cellBitmap.x = i;
			cellBitmap.y = 0;
			this.container.addChild(cellBitmap);
		}

		// right of platform
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(2+offset);
		cellBitmap.x = this.width-20;
		cellBitmap.y = 0;
		this.container.addChild(cellBitmap);
	}

	MovingPlatform.prototype.update = function()
	{
		if(this.startX != this.endX)
		{
			if(this.x > this.endX || this.x < this.startX)
			{
				this.speedX *= -1;
			}
			this.x += this.speedX;
			this.container.x = this.x;
		}
		if(this.startY != this.endY)
		{
			if(this.y > this.startY || this.y < this.endY)
			{
				this.speedY *= -1;
			}
			this.y += this.speedY;
			this.container.y = this.y;
		}
		
		//this.draw();
	}
	return MovingPlatform;

})();