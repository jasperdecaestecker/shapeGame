var Ladder = (function()
{
	var shape, container;

	function Ladder(x, y , width, height)
	{
		console.log('Ladder');
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.shape = new createjs.Shape();
		this.container = new createjs.Container();
		this.container.x = this.x;
		this.container.y = this.y;
		//this.shape.x = this.x;
		//this.shape.y = this.y;
		this.draw();
	}

	Ladder.prototype.draw = function()
	{
		this.shape.graphics.c();
		this.shape.graphics.f("0000FF");
		this.shape.graphics.drawRect(0,0,this.width,this.height);
		this.shape.graphics.ef();
		this.shape.alpha = 0;

		var imageData = {images: ["images/ladder.png"], frames: {width:40, height:27} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		

		// top of Ladder
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(0);
		cellBitmap.x = 0;
		cellBitmap.y = 0;
		this.container.addChild(cellBitmap);

		// fill height with with ladders
		for(var i = 27; i < this.height; i += 27)
		{
			var cellBitmap = new createjs.Sprite(tilesetSheet);
			cellBitmap.gotoAndStop(1);
			cellBitmap.x = 0;
			cellBitmap.y = i;
			this.container.addChild(cellBitmap);
		}
	}
	return Ladder;

})();