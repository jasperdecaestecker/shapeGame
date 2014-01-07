var ShapeVolgorde = (function()
{
	var container, currentShapeNumber, shapesUsed;


	function ShapeVolgorde(arrShapes, currentShapeNumber)
	{
		this.arrShapes = arrShapes;
		this.shapesUsed = 0;
		this.currentShapeNumber = currentShapeNumber;
		this.container = new createjs.Container(); 
		this.draw();
	}

	ShapeVolgorde.prototype.draw = function()
	{
		var imageData = {images: ["blockadeSprite.png"], frames: {width:40, height:40} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
	

		for (var i = 0; i < this.arrShapes.length; i++) 
    	{
    		var shape = new createjs.Shape();
    			var cellBitmap = new createjs.Sprite(tilesetSheet);
			switch(this.arrShapes[i])
			{
				case "square":
					shape.graphics.c();
					shape.graphics.f("FF0000");
					shape.graphics.drawRect(0,0,20,20);
					shape.graphics.ef();
					shape.x = 0 + i*30;
					cellBitmap.x = 0 + i *30;
					cellBitmap.gotoAndStop(2);

					//console.log("makeSquare");
				break;
				case "circle":
					shape.graphics.c();
					shape.graphics.f("FF0000");
					shape.graphics.drawCircle(0,0,10);
					shape.graphics.ef();
					shape.y = 10;
					shape.x = 10 + i*30;
					cellBitmap.x = 0 + i *30;
						cellBitmap.gotoAndStop(1);
				break;
				case "triangle":
					shape.graphics.c();
					shape.graphics.f("FF0000");
					shape.graphics.mt(0,20);
					shape.graphics.lt(20,20);
					shape.graphics.lt(10,0);
					shape.graphics.ef();
					shape.x = 0 + i*30;
					cellBitmap.x = 0 + i *30;
					cellBitmap.gotoAndStop(0);
				break;
			}
		
						cellBitmap.scaleX = cellBitmap.scaleY = 0.5;
			
			//this.container.addChild(shape);
			this.container.addChild(cellBitmap);

		}
	}

	ShapeVolgorde.prototype.nextShape = function()
	{
		console.log(this.currentShapeNumber);
		this.container.removeChildAt(this.currentShapeNumber - this.shapesUsed);
		this.shapesUsed++;
		this.currentShapeNumber++;
		this.container.x -= 30;
	}

	ShapeVolgorde.prototype.reset = function()
	{
		this.shapesUsed = 0;
		this.currentShapeNumber = 0;
		this.container.removeAllChildren();
		this.container.x = 20;
		this.draw();
	}

	return ShapeVolgorde;

})();
