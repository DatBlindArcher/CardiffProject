// Create new trail type
function Trail(config) {

	var self = this;
	this.owner = config.owner;
	this.color = config.color;
	this.positions = [config.position];
  
	this.draw = function(context) {
		context.strokeStyle = this.color;
		context.lineWidth = trail_width;
		context.beginPath();
		context.moveTo(this.positions[0].x, this.positions[0].y);
		
		for (var i = 0; i < this.positions.length; i++)
			context.lineTo(this.positions[i].x, this.positions[i].y);
	
	
		context.stroke();
	}
}