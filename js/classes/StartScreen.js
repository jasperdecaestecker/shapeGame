var StartScreen = (function()
{
	var shape, background;

	function StartScreen()
	{
		console.log('StartScreen');

		this.background = new createjs.Shape();
		this.background.x = this.x;
		this.background.y = this.y;
		this.background = 1000;
		this.background = 1000;

		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.width = 1000;
		this.height = 1000;

		this.draw();
	}

	StartScreen.prototype.draw = function()
	{
		console.log('draw startscreen');

		/*this.background.graphics.c();
		this.background.graphics.f("000000");
		this.background.graphics.drawRect(0,0,this.width,this.height);
		this.background.graphics.ef();*/

		this.shape.graphics.c();
		this.shape.graphics.f("10F3FE");
		this.shape.graphics.drawRect(0,0,this.width,this.height);
		this.shape.graphics.ef();
	}
	return StartScreen;

})();