var Won = (function()
{
	var cellBitmap;

	function Won(x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.container = new createjs.Container(); 
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	Won.prototype.draw = function()
	{
		var imageData = {images: ["images/einde.png"], frames: {width:800, height:400} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		this.cellBitmap = new createjs.Sprite(tilesetSheet);
		this.cellBitmap.x = this.cellBitmap.y = 0;
		this.container.addChild(this.cellBitmap);
		this.cellBitmap.gotoAndStop(0);
	}

	return Won;

})();