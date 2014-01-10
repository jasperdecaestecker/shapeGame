var Blockade = (function()
{
	var shape, blockadeShape, blockadeId, container;
	//var blockadeShapes = ["square","triangle","circle"];


	function Blockade(x, y , width, height, blockadeShape, blockadeId)
	{
		//console.log(blockadeShape);
		this.blockadeId = blockadeId;
		this.blockadeShape = blockadeShape;
		this.orgX = x;
		this.orgY = y;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.container = new createjs.Container(); 

		this.container.x = this.x;
		this.container.y = this.y;

		this.draw();
	}

	Blockade.prototype.changePosition = function(x,y)
	{
		this.x = x;
		this.y = y;
		this.container.x = this.x;
		this.container.y = this.y;
	}

	Blockade.prototype.draw = function()
	{
		this.container.removeAllChildren();

		var imageData = {images: ["images/blockadeSprite.png"], frames: {width:40, height:40} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		var cellBitmap = new createjs.Sprite(tilesetSheet);
	
		switch(this.blockadeShape)
		{
			case "triangle":

				cellBitmap.gotoAndStop(0);
			break;
			case "circle":

				cellBitmap.gotoAndStop(1);
			break;
			case "square":

				cellBitmap.gotoAndStop(2);
			break;
			case "rectangle":

				cellBitmap.gotoAndStop(3);
				//this.container.addChild(this.shape);
			break;
		}
		//this.container.addChild(this.shape);
		this.container.addChild(cellBitmap);
	}
	return Blockade;
})();