/*var tail = {
	
	draw : function(context, x, y) {
  
    if (this.mBody) {
		context.strokeStyle('yellow');
		context.beginPath();
		context.arc(x, y, 4);
		context.stroke;
    }
    
  }
}*/

// Create new trail type
function Trail(config) {

	var self = this;
	this.owner = config.owner;
	this.color = config.color;
	this.positions = [config.position];
	
	this.vertices = [
	{x: config.position.x, y: config.position.y - trail_width / 2},
	{x: config.position.x + trail_width / 2, y: config.position.y},
	{x: config.position.x - trail_width / 2, y: config.position.y}];
	
	this.mBody = Matter.Body.create({ position: config.position, vertices: this.vertices });
	this.mBody.hostObject = this;
	this.mBody.isSensor = true;
	this.mBody.collisionFilter.group = 0;
	this.mBody.collisionFilter.category = CollisionModel.StaticScene.Category;
	this.mBody.collisionFilter.mask = CollisionModel.StaticScene.Mask;
  
	this.draw = function(context) {
		context.strokeStyle = this.color;
		context.lineWidth = trail_width;
		context.beginPath();
		context.moveTo(this.positions[0].x, this.positions[0].y);
		
		for (var i = 0; i < this.positions.length; i++)
			context.lineTo(this.positions[i].x, this.positions[i].y);
	
	
		context.stroke();
	}
	
	this.drawBoundingVolume = function(context, bbColour) {
    
    //return;
    
    if (this.mBody) {
		  // Record path of mBody geometry
		context.strokeStyle = '#FF0000';
		context.lineWidth = trail_width;
		  context.beginPath();

		  var vertices = this.mBody.vertices;
		  
		  context.moveTo(vertices[0].x, vertices[0].y);
		  
		  for (var j = 1; j < vertices.length; ++j) {
		  
			context.lineTo(vertices[j].x, vertices[j].y);
		  }
		  
		  context.lineTo(vertices[0].x, vertices[0].y);
			  
		  // Render geometry
		  context.lineWidth = 1;
		  context.strokeStyle = bbColour;
		  context.stroke();
		}
	  }
	
	this.doCollision = function(otherBody, env) {
		console.log("Hi");
	}

	this.collideWithPlayer = function(player, env) {
		//if (player == this.owner) return;
		console.log("Hi");
		player.collideWithTrail(this, env);
	}

	this.collideWithProjectile = function(otherProjectile, env) {
	}

	this.collideWithNPC = function(npc, env) {

	}
}