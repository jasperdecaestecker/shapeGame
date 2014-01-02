var StartScreen = (function()
{
	var shape;

	function StartScreen()
	{
		console.log('StartScreen');
		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.width = 800;
		this.height = 900;

		this.draw();
	}

	StartScreen.prototype.draw = function()
	{
		console.log('draw startscreen');


		this.shape.graphics.c();
		this.shape.graphics.f("0F0F0F");
		this.shape.graphics.drawRect(0,0,this.width,this.height);
		this.shape.graphics.ef();

		
		console.log('draw shape '+this.shape.height);
	}
	return StartScreen;

})();