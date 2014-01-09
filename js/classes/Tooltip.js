var Tooltip = (function()
{
	function Tooltip(x, y , width, height, text, type)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.text = text;
		this.type = type;

		this.container = new createjs.Container(); 

		this.container.x = this.x;
		this.container.y = this.y;

		this.draw();
	}

	Tooltip.prototype.draw = function()
	{
		var text = new createjs.Text("Hello World", "20px Arial", "#ff7700");
		this.container.addChild(text);
		this.container.alpha = 0;
	}

	Tooltip.prototype.pop = function()
	{
		this.container.alpha = 1;
	} 


	return Tooltip;
})();