var Blockade = (function()
{
	var shape, blockadeShape, blockadeId;
	var blockadeShapes = ["square","triangle","circle"];


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

		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.draw();
	}

	Blockade.prototype.changePosition = function(x,y)
	{
		this.x = x;
		this.y = y;
		this.shape.x = this.x;
		this.shape.y = this.y;
		if(this.blockadeShape == "circle")
		{
			this.shape.x += this.height/2;
			this.shape.y += this.height/2;
		}

	}

	Blockade.prototype.draw = function()
	{
		switch(this.blockadeShape)
		{
			case "square":
				this.shape.graphics.c();
				this.shape.graphics.f("FF0000");
				this.shape.graphics.drawRect(0,0,this.width,this.height);
				this.shape.graphics.ef();
				//console.log("makeSquare");
			break;
			case "circle":
				this.shape.graphics.c();
				this.shape.graphics.f("FF0000");
				this.shape.graphics.drawCircle(0,0,this.height/2);
				this.shape.graphics.ef();
				this.shape.x += this.height/2;
				this.shape.y += this.height/2;
			break;
			case "triangle":
				this.shape.graphics.c();
				this.shape.graphics.f("FF0000");
				this.shape.graphics.mt(0,this.height);
				this.shape.graphics.lt(this.width,this.height);
				this.shape.graphics.lt(this.width/2,0);
				this.shape.graphics.ef();
			break;
		}
		
	}
	return Blockade;

})();