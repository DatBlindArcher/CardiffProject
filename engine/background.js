
// Game background
/*

function Background(imageURL) {

  var self = this;
  
  this.onLoaded = function() {

    self.backgroundLoaded = true;
  }

  this.draw = function(canvas) {

    if (self.backgroundLoaded) {
    
      var context = canvas.getContext("2d");
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      //context.globalAlpha = 0.5;
      context.drawImage(self.image, 0, 0, canvas.width, canvas.height); 
    }
  }

  this.backgroundLoaded = false;
  this.image = new Image();
  this.image.onload = this.onLoaded();
  this.image.src = imageURL;
}
*/

function Background(myColor) {
	var self = this;

  	this.draw = function(canvas) {
		var context = canvas.getContext("2d");

		context.fillStyle = self.color;
		context.fillRect(0, 0, canvas.width, canvas.height);
  	}

	this.color = myColor;
}