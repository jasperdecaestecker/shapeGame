var ShapeVolgorde = (function()
{
	var container, currentShapeNumber;


	function ShapeVolgorde(arrShapes, currentShapeNumber)
	{
		this.arrShapes = arrShapes;
		this.currentShapeNumber = currentShapeNumber;
		this.container = new createjs.Container(); 

		console.log("make shapeVolgorde");
		this.draw();

	}

	ShapeVolgorde.prototype.draw = function()
	{
		for (var i = 0; i < this.arrShapes.length; i++) 
    	{
    		var shape = new createjs.Shape();
			switch(this.arrShapes[i])
			{
				case "square":
					shape.graphics.c();
					shape.graphics.f("FF0000");
					shape.graphics.drawRect(0,0,20,20);
					shape.graphics.ef();
					//console.log("makeSquare");
				break;
				case "circle":
					shape.graphics.c();
					shape.graphics.f("FF0000");
					shape.graphics.drawCircle(0,0,20);
					shape.graphics.ef();
				break;
				case "triangle":
					shape.graphics.c();
					shape.graphics.f("FF0000");
					shape.graphics.mt(0,0);
					shape.graphics.lt(20,20);
					shape.graphics.lt(0,20);
					shape.graphics.lt(0,0);
					shape.graphics.ef();
				break;
			}
			shape.x = 0 + i*30;
			shape.y = 0;
			this.container.addChild(shape);

		}
	}

	ShapeVolgorde.prototype.nextShape = function()
	{
		this.arrShapes.splice(currentShapeNumber,1);
		//this.currentShapeNumber++;
		this.container.removeAllChildren();
		this.draw();

	}

	return ShapeVolgorde;

})();
