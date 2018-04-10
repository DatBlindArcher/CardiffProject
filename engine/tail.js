var tail = {
	
	draw : function(context, x, y) {
  
    if (this.mBody) {
		context.strokeStyle('yellow');
		context.beginPath();
		context.arc(x, y, 4);
		context.stroke;
    }
    
  }
}