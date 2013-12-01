var Vector2D = (function(){

	Vector2D.angleBetween = function(v1, v2){
		if(!v1.isNormalized()) v1 = v1.clone().normalize();
		if(!v2.isNormalized()) v2 = v2.clone().normalize();
		return Math.acos(v1.dotProd(v2));
	}

	Vector2D.distanceBetween = function(v1, v2){
		var dx = v2.x - v1.x;
		var dy = v2.y - v1.y;
		var calc = dx * dx + dy * dy;
		console.log(Math.sqrt(calc));
		return Math.sqrt(calc);
	}

	function Vector2D(x,y){
		this.x = x;
		this.y = y;
	}

	Vector2D.prototype.clone = function(){
		return new Vector2D(this.x, this.y);
	};

	Vector2D.prototype.zero = function(){
		this.x = 0;
		this.y = 0;
		return this;
	};

	Vector2D.prototype.isZero = function(){
		return this.x == 0 && this.y == 0;};

	
	Vector2D.prototype.setLength = function(value){
		var a = this.getAngle();
		this.x = Math.cos(a) * value;
		this.y = Math.sin(a) * value;
	};

	Vector2D.prototype.getLength = function(){
		return Math.sqrt(this.getLengthSQ());
	};

	Vector2D.prototype.getLengthSQ = function(){
		return this.x * this.x + this.y * this.y;
	};

	Vector2D.prototype.setAngle = function(value){
		var len = this.getLength();
		this.x = Math.cos(value) * len;
		this.y = Math.sin(value) * len;
	};
	
	Vector2D.prototype.getAngle = function(){
		return Math.atan2(this.y, this.x);
	};

	Vector2D.prototype.equals = function(v2){
		return this.x == v2.x && this.y == v2.y;
	};

	Vector2D.prototype.divide = function(value){
		var v = new Vector2D(this.x / value, this.y / value);
		return v;
	};

	Vector2D.prototype.multiply = function(value){
		return new Vector2D(this.x * value, this.y * value);
	};

	Vector2D.prototype.subtract = function(v2){
		return new Vector2D(this.x - v2.x, this.y - v2.y);
	};

	Vector2D.prototype.add = function(v2){
		return new Vector2D(this.x + v2.x, this.y + v2.y);
	};

	Vector2D.prototype.distSQ = function(v2){
		var dx = v2.x - this.x;
		var dy = v2.y - this.y;
		return dx * dx + dy * dy;
	}

	Vector2D.prototype.dist = function(v2){
		return Math.sqrt(this.distSQ(v2));
	}

	Vector2D.prototype.getPerp = function(){
		return new Vector2D(-this.y, this.x);
	}

	Vector2D.prototype.normalize = function(){
		if(this.getLength() == 0){
			this.x = 1;
			return this;
		}
		var len = this.getLength();
		this.x /= len;
		this.y /= len;
		return this;
	};

	Vector2D.prototype.truncate = function(max){
		this.setLength(Math.min(max, this.getLength()));
		return this;
	};
	
	Vector2D.prototype.reverse = function(){
		this.x = -this.x;
		this.y = -this.y;
		return this;
	};

	Vector2D.prototype.isNormalized = function(){
		return this.getLength() == 1.0;
	};

	Vector2D.prototype.dotProd = function(v2){
		return this.x * v2.x + this.y * v2.y;
	};

	Vector2D.prototype.crossProd = function(v2){
		return this.x * v2.y - this.y * v2.x;
	};
	
	Vector2D.prototype.sign = function(v2){
		return this.getPerp().dotProd(v2) < 0 ? -1 : 1;
	};

	return Vector2D;

})();

var EdgeBehavior = (function(){

	EdgeBehavior.BOUNCE = "bounce";
	EdgeBehavior.WRAP = "wrap";

	function EdgeBehavior(){
		
	}

	return EdgeBehavior;

})();

var SteeredVehicle = (function(){
	
	function SteeredVehicle(boundsWidth, boundsHeight, x, y){

		this.position = new Vector2D(0,0);
		this.velocity = new Vector2D(0,0);

		this.position.x = this.velocity.x = x;
		this.position.y = this.velocity.y = y;

		this.maxSpeed = 10;
		this.velocity.setLength(this.maxSpeed);
		this.setRotation(0);

		this.edgeBehavior = EdgeBehavior.BOUNCE;
		this.mass = 5;

		this.boundsWidth = boundsWidth;
		this.boundsHeight = boundsHeight;

		this.maxForce = 1;

		this.steeringForce = new Vector2D(0,0);
		this.arrivalTreshold = 300;
		this.wanderAngle = 0;
		
		this.wanderDistance = 10;
		this.wanderRadius = 5;
		this.wanderRange = 1;
		
		this.avoidDistance = 300;
		this.avoidBuffer = 20;
		
		this.pathIndex = 0;
		this.pathTreshold = 40;

	}

	SteeredVehicle.prototype.draw = function(){
		if(this.render){
			this.render.x = this.position.x;
			this.render.y = this.position.y;
			this.render.rotation = this.getRotation();
		}
	};

	SteeredVehicle.prototype.getRotation = function(){
		return this.velocity.getAngle() * 180 / Math.PI;
	}

	SteeredVehicle.prototype.setRotation = function(angle){
		this.velocity.setAngle(angle * (Math.PI/180));
	}

	SteeredVehicle.prototype.setSpeed = function(value){
		this.maxSpeed = value;
		this.velocity.setLength(value);
	};

	SteeredVehicle.prototype.bounce = function(){

		if(this.boundsWidth && this.boundsHeight)
		{
			if(this.position.x > this.boundsWidth)
			{
				this.position.x = this.boundsWidth;
				this.velocity.x *= -1;
			}
			else if(this.position.x < 0)
			{
				this.position.x = 0;
				this.velocity.x *= -1;
			}
			
			if(this.position.y > this.boundsHeight)
			{
				this.position.y = this.boundsHeight;
				this.velocity.y *= -1;
			}
			else if(this.position.y < 0)
			{
				this.position.y = 0;
				this.velocity.y *= -1;
			}
		}
	}

	SteeredVehicle.prototype.wrap = function(){
		if(this.boundsWidth && this.boundsHeight)
		{
			if(this.position.x > this.boundsWidth) this.position.x = 0;
			if(this.position.x < 0) this.position.x = this.boundsWidth;
			if(this.position.y > this.boundsHeight) this.position.y = 0;
			if(this.position.y < 0) this.position.y = this.boundsHeight;
		}
	}

	SteeredVehicle.prototype.setRender = function(render){
		this.render = render;
	}
	
	SteeredVehicle.prototype.getSpeed = function(){
		return this.velocity.getLength();
	}

	SteeredVehicle.prototype.getRotation = function(){
		return this.velocity.getAngle() * 180 / Math.PI;
	}

	SteeredVehicle.prototype.setRotation = function(angle){
		this.velocity.setAngle(angle * (Math.PI/180));
	}

	SteeredVehicle.prototype.setMass = function(mass){
		this.mass = mass;
	}

	SteeredVehicle.prototype.update = function(count){

		if(this.steeringForce.getLength() > 0){
			this.steeringForce.truncate(this.maxForce);
			this.steeringForce = this.steeringForce.divide(this.mass);
			this.velocity = this.velocity.add(this.steeringForce);
			this.steeringForce = new Vector2D(0,0);
		}

		if(this.velocity.getLength() > 0){
			this.velocity.truncate(this.maxSpeed);
			this.position = this.position.add(this.velocity);
			if(this.edgeBehavior == EdgeBehavior.WRAP){
				this.wrap();
			}else if(this.edgeBehavior == EdgeBehavior.BOUNCE){
				this.bounce();
			}
		}

		this.draw();

	}
	
	SteeredVehicle.prototype.seek = function(target){

		var desiredVelocity = target.subtract(this.position);
		desiredVelocity.normalize();

		desiredVelocity = desiredVelocity.multiply(this.maxSpeed);

		var force = desiredVelocity.subtract(this.velocity);
		this.steeringForce = this.steeringForce.add(force);
		
	}

	SteeredVehicle.prototype.arrive = function(target){
		var desiredVelocity = target.subtract(this.position);
		desiredVelocity.normalize();
		
		var dist = this.position.dist(target);

		if(dist > this.arrivalTreshold){
			desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
		}else{
			desiredVelocity = desiredVelocity.multiply(this.maxSpeed * dist/this.arrivalTreshold);
		}
	
		var force = desiredVelocity.subtract(this.velocity);
		this.steeringForce = this.steeringForce.add(force);
	}

	SteeredVehicle.prototype.flee = function(target) {
			
		var desiredVelocity = target.subtract(this.position);
		desiredVelocity.normalize();
		
		desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
		
		var force = desiredVelocity.subtract(this.velocity);
		this.steeringForce = this.steeringForce.subtract(force);
		
	}
		
	SteeredVehicle.prototype.persue = function(target){

		var lookAheadTime = this.position.dist(target.position)/this.maxSpeed;
		var predictedTarget = target.position.add(target.velocity.multiply(lookAheadTime));
		this.seek(predictedTarget);

	}

	SteeredVehicle.prototype.evade = function(target){

		var lookAheadTime = this.position.dist(target.position)/this.maxSpeed;
		var predictedTarget = target.position.add(target.velocity.multiply(lookAheadTime));
		this.flee(predictedTarget);

	}
		
	SteeredVehicle.prototype.wander = function(){

		var center = this.velocity.clone().multiply(this.wanderDistance);
		
		var offset = new Vector2D(0,0);
		offset.setLength(this.wanderRadius);
		offset.setAngle(this.wanderAngle);
		
		this.wanderAngle += Math.random() * this.wanderRange - this.wanderRange * 0.5;
		
		var force = center.add(offset);
		this.steeringForce = this.steeringForce.add(force);	

	}

	SteeredVehicle.prototype.followPath = function(path, loop){

		if(!loop){
			loop = false;
		}

		var wayPoint = path[this.pathIndex];
		if(wayPoint == null) return;
		if(this.position.dist(wayPoint) < this.pathTreshold){
			if(this.pathIndex >= path.length - 1){
				if(loop){
					this.pathIndex = 0;
				}
			}else{
				this.pathIndex ++;
			}
		}
		if(this.pathIndex >= path.length - 1 && !loop){
			this.arrive(wayPoint);
		}else{
			this.seek(wayPoint);
		}

	}

	return SteeredVehicle;

})();