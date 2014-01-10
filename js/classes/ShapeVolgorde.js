var ShapeVolgorde = (function()
{
	var container, currentShapeNumber, shapesUsed;


	function ShapeVolgorde(arrShapes, currentShapeNumber)
	{
		this.arrShapes = arrShapes;
		this.shapesUsed = 0;
		this.currentShapeNumber = currentShapeNumber;
		this.container = new createjs.Container(); 
		this.containerShapes = new createjs.Container(); 

		this.imageData = {images: ["blockadeSprite.png"], frames: {width:40, height:40} }; 
		this.tilesetSheet = new createjs.SpriteSheet(this.imageData);
		this.bgShape = new createjs.Shape();
		this.bgShape.graphics.c();
		this.bgShape.graphics.setStrokeStyle(2,"round").beginStroke("#31302f");
		this.bgShape.graphics.drawRoundRect(0,0,100,30,5);
		this.bgShape.graphics.es();
		this.bgShape.x -= 10;
		this.bgShape.y -= 5;

		var bgFill = new createjs.Shape();
		bgFill.graphics.c();
		bgFill.graphics.beginFill("#31302f");
		bgFill.graphics.drawRoundRect(0,0,100,30,5);
		bgFill.graphics.endFill();
		bgFill.y-= 5;
		bgFill.x-= 10;
		bgFill.alpha = 0.5;
		this.container.addChild(bgFill);

		this.container.addChild(this.containerShapes);
		this.container.addChild(this.bgShape);

		this.draw();

	}

	ShapeVolgorde.prototype.draw = function()
	{
		var count = 0;
		if(this.arrShapes.length - this.currentShapeNumber > 3)
		{
			count = 3;
		}
		else
		{
			count = this.arrShapes.length - this.currentShapeNumber;
		}

		for (var i = 0; i < count; i++) 
    	{
    		var cellBitmap = new createjs.Sprite(this.tilesetSheet);
			switch(this.arrShapes[i + this.currentShapeNumber])
			{
				case "triangle":
					cellBitmap.x = 0 + i *30;
					cellBitmap.gotoAndStop(0);
				break;
				case "circle":
					cellBitmap.x = 0 + i *30;
					cellBitmap.gotoAndStop(1);
				break;
				case "square":
					cellBitmap.x = 0 + i *30;
					cellBitmap.gotoAndStop(2);
				break;
				case "rectangle":
					cellBitmap.x = 0 + i *30;
					cellBitmap.gotoAndStop(3);
					
				break;
			}
		
			cellBitmap.scaleX = cellBitmap.scaleY = 0.5;
			this.containerShapes.addChild(cellBitmap);
		}
			
	}

	ShapeVolgorde.prototype.nextShape = function()
	{
		this.containerShapes.removeAllChildren();
		this.currentShapeNumber++;
		this.draw();
	}

	ShapeVolgorde.prototype.reset = function()
	{
		this.currentShapeNumber = 0;
		this.containerShapes.removeAllChildren();
		this.containerShapes.x = 0;
		this.draw();
	}

	return ShapeVolgorde;

})();
