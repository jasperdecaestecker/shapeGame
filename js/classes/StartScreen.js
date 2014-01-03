var StartScreen = (function()
{
	var shape, backgroundC, container;
	var shapeType;

	function StartScreen()
	{
		console.log('StartScreen');


		this.container = new createjs.Container();
		this.container.x = this.x;
		this.container.y = this.y;


		this.background = new createjs.Shape();
		this.background.x = this.x;
		this.background.y = this.y;
		this.background = 1000;
		this.background = 1000;
		this.shapeType = "background";
		this.draw();


		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.width = 50;
		this.height = 50;
		this.shapeType = "shape";
		this.draw();
	}

	StartScreen.prototype.draw = function()
	{
		console.log('draw startscreen');

		switch (this.shapeType)
		{
			case "background":
				/*this.background.graphics.c();
				this.background.graphics.f("000000");
				this.background.graphics.drawRect(0,0,this.width,this.height);
				this.background.graphics.ef();
				this.container.addChild(this.background);*/
			break;

			case "shape":
				this.shape.graphics.c();
				this.shape.graphics.f("10F3FE");
				this.shape.graphics.drawRect(0,0,this.width,this.height);
				this.shape.graphics.ef();
				this.container.addChild(this.shape);
			break;
		}

		
		


	}
	return StartScreen;

})();