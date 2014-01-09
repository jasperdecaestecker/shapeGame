var Boss = (function()
{
	var bossShapes = ["square","triangle","circle"];
	var container;
	var shape;

	function Boss(x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speedX = 2;
		this.speedY = 1;
		this.startX = 0;
		this.endX = 600;
		this.lives = 3;

		this.shape = new createjs.Shape(); 
		this.container = new createjs.Container(); 
		this.container.x = this.x;
		this.container.y = this.y;

		this.draw();
	}

	Boss.prototype.draw = function()
	{
		this.shape.graphics.c();
		switch(this.lives)
		{
			case 3:
				this.shape.graphics.f("00FF00");
				break;

		}
		
		this.shape.graphics.drawRect(0,0,this.width,this.height);
		this.shape.graphics.ef();
		this.shape.alpha=1;

		this.container.addChild(this.shape);

	}

	Boss.prototype.nextShape = function(shape)
	{
		this.container.removeAllChildren();
		this.currentPlayerShape = shape;
		this.draw(this.currentPlayerShape);
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
				this.shape.y = this.y;
		}
	
		this.x += this.speedX;
		
		this.shape.x = this.x;
	
		this.draw();
	}

	return Boss;
})();