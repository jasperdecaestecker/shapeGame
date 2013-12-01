var Platform = (function()
{
	var shape;

	function Platform(x, y , width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.draw();
	}

	Platform.prototype.draw = function()
	{
		this.shape.graphics.c();
		this.shape.graphics.f("#000000");
		this.shape.graphics.dr(0,0,this.width,this.height);
		this.shape.graphics.ef();
	}

	return Platform;

})();