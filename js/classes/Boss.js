var Boss = (function()
{
	var container;
	var shape;
	var arrProjectiles;
	var projectileId;
	var bossShapes = ["square","circle","triangle"];

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
		this.shape.graphics.c();
		switch(this.currentShape)
		{
			case "square":
				this.shape.graphics.f("00FF00");
				this.shape.graphics.drawRect(0,0,this.width,this.height);
				this.shape.graphics.ef();
				this.container.addChild(this.shape);
				this.shape.x = 0;
				this.shape.y = 0;
				break;
			case "triangle":
				this.shape.graphics.f("00FF00");
				this.shape.graphics.mt(0,this.height);
				this.shape.graphics.lt(this.width,this.height);
				this.shape.graphics.lt(this.width/2,0);
				this.shape.graphics.ef();
				this.shape.x = 0;
				this.shape.y = 0;
				this.container.addChild(this.shape);
				break;	
			case "circle":
				this.shape.graphics.f("00FF00");
				this.shape.graphics.drawCircle(0,0,this.height/2);
				this.shape.graphics.ef();
				this.shape.x = 40;
				this.shape.y = 40;
				this.container.addChild(this.shape);

			
			break;
		}

	
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
				this.shape.y = this.y;
		}
	
		this.x += this.speedX;
		
		//if(this.currentShape == circle)
			
		this.shape.x = this.x;
	
		//this.draw();
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