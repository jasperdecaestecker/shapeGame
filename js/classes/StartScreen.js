var StartScreen = (function()
{
	var shape;

	function StartScreen()
	{
		console.log('StartScreen');
		

		this.draw();
	}

	StartScreen.prototype.draw = function()
	{
		console.log('draw startscreen');

		this.shape = new createjs.Shape();
		this.shape.graphics.c();
		this.shape.graphics.f("0F0F0F");
		this.shape.graphics.drawRect(20,20,800,900);
		this.shape.graphics.ef();
		
		console.log('draw shape '+this.shape.height);
	}
	return StartScreen;

})();