// Useful utility functions


// Function to iterate through an array and draw contained objects
function drawObjects(context, collection) {

  for (i=0;i<collection.length; ++i) {

    if (collection[i]) {
    
      collection[i].draw(context);            
    }
  }
}


// canvas event handler to enter fullscreen mode
function enterFullscreen(element) {
  
  if (element.requestFullscreen) {
  
    // Generic
    if (document.fullScreenElement) {
    
      document.cancelFullScreen();
      console.log("cancelFullScreen");
    }
    else {
    
      element.requestFullscreen();
      console.log("requestFullscreen");
    }
  }
  else if (element.msRequestFullscreen) {
  
    // Edge / IE
    if (document.msFullscreenElement) {
    
      document.msExitFullscreen();
      console.log("msExitFullscreen");
    }
    else {
    
      element.msRequestFullscreen();
      console.log("msRequestFullscreen");
    }

  }
  else if (element.mozRequestFullScreen) {
  
    // Firefox
    if (document.mozFullScreenElement) {
      
      document.mozCancelFullScreen();
      console.log("mozCancelFullScreen");
    }
    else {
    
      element.mozRequestFullScreen();
      console.log("mozRequestFullScreen");
    }
  }
  else if (element.webkitRequestFullscreen) {
  
    // Chrome
    if (document.webkitFullscreenElement) {
    
      document.webkitCancelFullScreen();
      console.log("webkitCancelFullScreen");
    }
    else {
    
      element.webkitRequestFullscreen();
      console.log("webkitRequestFullscreen");
    }
  }
}

function drawHUD(context, time) {

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  
  // Draw HUD
  context.fillStyle = 'yellow';
  context.font = '40px Impact';
  
  var textMetrics = context.measureText(Math.ceil(time));
  context.fillText(Math.ceil(time), context.canvas.clientWidth / 2 - textMetrics.width / 2, 80);
}