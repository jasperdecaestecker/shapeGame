var Lever = (function()
{
	var arrChangeBlockades, cellBitmap, leverPositie;

	function Lever(x, y , width, height, arrChangeBlockades)
	{
		/*console.log(arrChangeBlockades);
		this.arrChangeBlockades = [];
		this.arrChangeBlockades.push(arrChangeBlockades.split(" "));

		

		for(var i = 0; i < arrChangeBlockades.length; i++)
		{
			console.log(arrChangeBlockades[i]);
		}*/

		//this.arrChangeBlockades = arrChangeBlockades;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.leverPositie = 0;

		this.container = new createjs.Container(); 

		/*this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;*/
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	Lever.prototype.draw = function()
	{
		var imageData = {images: ["lever.png"], frames: {width:70, height:45} }; 
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		this.cellBitmap = new createjs.Sprite(tilesetSheet);
		this.container.addChild(this.cellBitmap);
				//cellBitmap.gotoAndStop(layerData.data[i] - 1);
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