// Create new trail type
function Trail(config) {

	var self = this;
	this.owner = config.owner;
	this.color = config.color;
	this.positions = [{ x: config.position.x, y: config.position.y, size: trail_width }];
  
	this.draw = function(context) {
		context.fillStyle = this.color;
		
		for (var i = 0; i < this.positions.length; i++)
		{
			context.beginPath();
			context.arc(this.positions[i].x, this.positions[i].y, this.positions[i].size, 0, 2 * Math.PI);
			context.fill();
		}
	}
}