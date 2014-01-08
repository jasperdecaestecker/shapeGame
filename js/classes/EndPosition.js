var EndPosition = (function()
{
	var shape, container;

	function EndPosition(x, y , width, height)
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

	EndPosition.prototype.draw = function()
	{
		var imageData = {images: ["vlag.png"], frames: {width:24, height:64}}; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		this.container.addChild(cellBitmap);
	}
	return EndPosition;

})();