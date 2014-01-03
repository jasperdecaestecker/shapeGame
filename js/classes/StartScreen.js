var StartScreen = (function()
{
	var shape, backgroundC, container;
	var shapeType;

	function StartScreen(shapeType)
	{
		console.log('StartScreen');


		this.container = new createjs.Container();
		this.container.x = this.x;
		this.container.y = this.y;

		this.shapeType = shapeType;

		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.width = 50;
		this.height = 50;
		this.draw();
	}

	StartScreen.prototype.draw = function()
	{
		console.log('draw startscreen');

		switch (this.shapeType)
		{
			case "background":
			console.log("background");
				this.shape.graphics.c();
				this.shape.graphics.f("000000");
				this.shape.graphics.drawRect(0,0,1000,1000);
				this.shape.graphics.ef();
			break;

			case "shape":
			console.log("shape");
				this.shape.graphics.c();
				this.shape.graphics.f("10F3FE");
				this.shape.graphics.drawRect(0,0,this.width,this.height);
				this.shape.graphics.ef();
			break;
		}

		
		


	}
	return StartScreen;

})();