var Blockade = (function()
{
	var shape, blockadeShape;
	var blockadeShapes = ["square","triangle","circle"];


	function Blockade(x, y , width, height, blockadeShape)
	{
		//console.log(blockadeShape);
		this.blockadeShape = blockadeShape;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.draw();
	}

	Blockade.prototype.draw = function()
	{
		console.log(this.blockadeShape);
		switch(blockadeShapes[this.blockadeShape])
		{
			case "square":
				this.shape.graphics.c();
				this.shape.graphics.f("FF0000");
				this.shape.graphics.drawRect(0,0,this.width,this.height);
				this.shape.graphics.ef();
			break;
			case "circle":
				this.shape.graphics.c();
				this.shape.graphics.f("FF0000");
				this.shape.graphics.drawCircle(0,0,this.height);
				this.shape.graphics.ef();
			break;
			case "triangle":
				this.shape.graphics.c();
				this.shape.graphics.f("FF0000");
				this.shape.graphics.mt(0,0);
				this.shape.graphics.lt(this.width,this.height);
				this.shape.graphics.lt(0,this.height);
				this.shape.graphics.lt(0,0);
				this.shape.graphics.ef();
			break;
		}
	}

	return Blockade;

})();