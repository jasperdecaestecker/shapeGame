var StartScreen = (function()
{
	var container, startButton, background;

	function StartScreen(x,y,width,height)
	{
		this.width = width;
		this.height = height;
		this.container = new createjs.Container();
		this.container.x = this.x;
		this.container.y = this.y;

		this.draw();
	}

	StartScreen.prototype.draw = function()
	{
		//draw background
		this.background = new createjs.Shape();
		this.background.graphics.c();
		this.background.graphics.f("000000");
		this.background.graphics.drawRect(0,0,this.width,this.height);
		this.background.graphics.ef();
		this.container.addChild(this.background);

		// draw startknop
		this.startButton = new Button(0,0,120,30,"Start Game","#00FF00","#000000");
		this.startButton.container.x = this.width/2 - this.startButton.width/2;
		this.startButton.container.y = this.height/2 - this.startButton.height/2;
		this.container.addChild(this.startButton.container);
	}
	return StartScreen;

})();