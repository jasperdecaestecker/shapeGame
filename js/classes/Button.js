var Button = (function()
{
	var buttonBg, buttonText;

	function Button(x, y , width, height, text, bgColor, textColor)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.text = text;
		this.bgColor = bgColor;
		this.textColor = textColor;

		this.container = new createjs.Container();
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	Button.prototype.draw = function()
	{
		this.buttonBg = new createjs.Shape();
		this.buttonBg.graphics.c();
		this.buttonBg.graphics.f(this.bgColor);
		this.buttonBg.graphics.drawRect(0,0,this.width,this.height);
		this.buttonBg.graphics.ef();
		this.buttonBg.x = 0;
		this.buttonBg.y = 0;
		this.container.addChild(this.buttonBg);

		//this.container.addEventListener("click", function(event) { alert("clicked"); })

		this.buttonText = new createjs.Text(this.text, "18px Arial", this.textColor); 
		var boundsText = this.buttonText.getBounds();
		this.buttonText.x = this.width/2 - boundsText.width/2;
		this.buttonText.y = this.height/2 - boundsText.height/2;
		this.container.addChild(this.buttonText);
	}


	return Button;

})();