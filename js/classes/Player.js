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

		
		
		this.draw(currentPlayerShape);
		console.log("current player shape " +currentPlayerShape);
	}

	Player.prototype.draw = function(currentPlayerShape)
	{
		//console.log(playerShapes[playerShapeNumber]);
		console.log("draw");
		switch(currentPlayerShape)
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

	Player.prototype.nextShape = function()
	{
		console.log("next shape " + this.currentPlayerShape);
		switch(this.currentPlayerShape)
		{
			case "square":
			this.currentPlayerShape = "triangle"
			break;
			case "triangle":
			this.currentPlayerShape = "circle";
			break;
			case "circle":
			this.currentPlayerShape = "square";
			break;
		}

		this.draw(this.currentPlayerShape);
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
		this.shape.x = this.x;
		this.shape.y = this.y;
		//this.shape.y = this.y;
		this.velY += this.gravity;
		this.velX *= this.friction;
	}

	return Player;

})();