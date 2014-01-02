var EndPosition = (function()
{
	var shape, container;

	function EndPosition(x, y , width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.shape = new createjs.Shape();
		this.container = new createjs.Container();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	EndPosition.prototype.draw = function()
	{
		this.shape.graphics.c();
		this.shape.graphics.f("FF0000");
		this.shape.graphics.drawRect(0,0,this.width,this.height);
		this.shape.graphics.ef();
		var imageData = {images: ["vlag.png"], frames: {width:24, height:64} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		//cellBitmap.gotoAndStop(layerData.data[i] - 1);
		this.container.addChild(this.shape);
		this.container.addChild(cellBitmap);
	}
	return EndPosition;

})();