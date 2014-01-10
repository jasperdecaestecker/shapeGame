var Lever = (function()
{
	var arrChangeBlockades, cellBitmap, leverPositie;

	function Lever(x, y , width, height, arrChangeBlockades)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.leverPositie = 0;
		this.arrChangeBlockades = arrChangeBlockades.split(",");
		console.log(this.arrChangeBlockades[0]);

		this.container = new createjs.Container(); 
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	Lever.prototype.draw = function()
	{
		var imageData = {images: ["images/lever.png"], frames: {width:80, height:45} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		this.cellBitmap = new createjs.Sprite(tilesetSheet);
		this.cellBitmap.x = this.cellBitmap.y = 0;
		this.container.addChild(this.cellBitmap);
		this.cellBitmap.gotoAndStop(0);
	}

	Lever.prototype.change = function()
	{
		if(this.leverPositie == 0)
		{
			this.leverPositie = 1;
		}
		else
		{
			this.leverPositie = 0;
		}
		this.cellBitmap.gotoAndStop(this.leverPositie);
		
	}	

	return Lever;

})();