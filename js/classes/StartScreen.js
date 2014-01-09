var StartScreen = (function()
{
	var container, startButton, background, shape;
	var cellBitmap;

	function StartScreen(x,y,width,height)
	{
		this.width = width;
		this.height = height;
		this.container = new createjs.Container();
		this.shape = new createjs.Shape();
		this.container.x = this.x;
		this.container.y = this.y;

		this.draw();
	}

	StartScreen.prototype.draw = function()
	{
		this.shape.graphics.c();
		this.shape.graphics.f("00FF00");
		this.shape.graphics.drawCircle(0,0,20);
		this.shape.graphics.ef();
		this.shape.x = this.width/2 - 10; 
		this.shape.y = this.height/2 - 10; 

		//bg toevoegen
		var imageData = {images: ["bgmall.png"], frames: {width:800, height:400} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(0);
		cellBitmap.x = 0;
		cellBitmap.y = 0;
		this.container.addChild(cellBitmap);

		console.log('image data '+imageData);

	//this.container.addChild(this.shape);
		//this.container.addChild(this.background);

		// draw startknop
		/*this.startButton = new Button(0,0,120,30,"Start Game","#00FF00","#000000");
		this.startButton.container.x = this.width/2 - this.startButton.width/2;
		this.startButton.container.y = this.height/2 - this.startButton.height/2;
		this.container.addChild(this.startButton.container);*/

		
		//this.shape.addEventListener("click", handleClick);
	}

	function handleClick()
	{
		console.log("klik");
	}
	return StartScreen;

})();