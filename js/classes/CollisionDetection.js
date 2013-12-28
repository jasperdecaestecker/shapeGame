var CollisionDetection = (function()
{
	var shape;

	function CollisionDetection()
	{

	}

	CollisionDetection.checkCollision = function(shapeA,shapeB,clippingmode,usingLadder)
	{
		var vX = (shapeA.x + (shapeA.width/2)) - (shapeB.x + (shapeB.width/2));
		var vY = (shapeA.y + (shapeA.height/2)) - (shapeB.y + (shapeB.height/2));

		var hWidths = (shapeA.width/2) + (shapeB.width/2);
		var hHeights = (shapeA.height/2) + (shapeB.height/2);

		var colDir = "";
		if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
		{
			var oX = hWidths - Math.abs(vX);
			var oY = hHeights - Math.abs(vY);

			if(oX >= oY)
			{
				if(vY > 0)
				{
					colDir = "t";
					if(clippingmode)
					{
						if(!usingLadder)
						{
							shapeA.y += oY;
						}
					}
				}
				else
				{
					colDir = "b";
					if(clippingmode)
					{
						if(!usingLadder)
						{
							shapeA.y -= oY;
						}
					}
				}
			}
			else
			{
				if(vX > 0)
				{
					colDir = "l";
					if(clippingmode)
					{
					shapeA.x += oX;
				}
				}
				else
				{
					colDir = "r";
					if(clippingmode)
					{
					shapeA.x -= oX;
				}
				}
			}
		}

		return colDir;
	}

	return CollisionDetection;

})();