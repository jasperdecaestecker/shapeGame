var Ladder = (function()
{
	var shape;

	function Ladder(x, y , width, height)
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

	Ladder.prototype.draw = function()
	{
		this.shape.graphics.c();
		this.shape.graphics.f("0000FF");
		this.shape.graphics.drawRect(0,0,this.width,this.height);
		this.shape.graphics.ef();
		this.shape.alpha = 0.4;
	}
	return Ladder;

})();