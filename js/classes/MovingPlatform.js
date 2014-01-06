var MovingPlatform = (function()
{
	var shape;

	function MovingPlatform(x, y , width, height,speed, startX, endX, startY, endY)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.speedX = speed;
		this.speedY = speed;
		this.startX = startX;
		this.endX = endX;
		this.startY = startY;
		this.endY = endY;

		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.draw();
	}

	MovingPlatform.prototype.draw = function()
	{
		this.shape.graphics.c();
		this.shape.graphics.f("#000000");
		this.shape.graphics.dr(0,0,this.width,this.height);
		this.shape.graphics.ef();

		return this.shape;
	}

	MovingPlatform.prototype.update = function()
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
				this.shape.y = this.y;
		}
		



		this.x += this.speedX;
		
		this.shape.x = this.x;
	
		this.draw();
	}


	return MovingPlatform;

})();