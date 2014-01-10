var Tooltip = (function()
{

	function Tooltip(x, y , width, height, text, timeDelay)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.text = text;
		this.timeDelay = timeDelay;
		this.timeDelayCount = 0;
		this.popped = false;
		this.stopped = false;
		this.container = new createjs.Container(); 
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	Tooltip.prototype.draw = function()
	{
		var text = new createjs.Text(this.text, "16px Arial", "#f5f4f3");
		var bgFill = new createjs.Shape();
		bgFill.graphics.c();
		bgFill.graphics.beginFill("#31302f");
		bgFill.graphics.drawRoundRect(0,0,text.getBounds().width+20,30,5);
		bgFill.graphics.endFill();
		bgFill.y-= 5;
		bgFill.x-= 10;
		bgFill.alpha = 0.5;
		this.container.addChild(bgFill);

		var bgShape = new createjs.Shape();
		bgShape.graphics.c();
		bgShape.graphics.setStrokeStyle(2,"round").beginStroke("#31302f");
		bgShape.graphics.drawRoundRect(0,0,text.getBounds().width+20,30,5);
		bgShape.graphics.es();
		bgShape.y-= 5;
		bgShape.x-= 10;
		this.container.addChild(bgShape);

		this.container.addChild(text);
		this.container.alpha = 0;
	}

	Tooltip.prototype.pop = function()
	{
		this.container.alpha = 1;
		this.popped = true;
	} 
	return Tooltip;
})();