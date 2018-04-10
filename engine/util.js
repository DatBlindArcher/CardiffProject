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

function drawHUD(context, player1, player2) {

	return;
  // Draw HUD
  context.fillStyle = '#FFFFFF';
  //context.font = '30pt Amatic SC';
  context.font = '30pt Faster One';
  
  var textMetrics = context.measureText(player1.pid);
  context.fillText(player1.pid, 140 - textMetrics.width / 2, 50);
  
  var textMetrics = context.measureText(player2.pid);
  context.fillText(player2.pid, 660 - textMetrics.width / 2, 50);
  
  context.font = '24px Amatic SC';
  
  var textMetrics = context.measureText('Score: ' + player1.score);
  context.fillText('Score: ' + player1.score, 140 - textMetrics.width / 2, 80);
  
  var textMetrics = context.measureText('Score: ' + player2.score);
  context.fillText('Score: ' + player2.score, 660 - textMetrics.width / 2, 80);
  
  var gradient1 = context.createLinearGradient(100, 100, 180, 100);
  gradient1.addColorStop(0, '#FF0000');
  gradient1.addColorStop(0.5, '#FFFF00');
  gradient1.addColorStop(1.0, '#00FF00');
  
  context.strokeStyle = gradient1;
  context.beginPath();
  context.lineWidth = 10;
  context.moveTo(100, 100);
  context.lineTo(100 + Math.max(Math.min(player1.strength / 100 * 80, 80), 0), 100);
  context.stroke();
  
  var gradient2 = context.createLinearGradient(620, 100, 700, 100);
  gradient2.addColorStop(0, '#FF0000');
  gradient2.addColorStop(0.5, '#FFFF00');
  gradient2.addColorStop(1.0, '#00FF00');
  
  context.strokeStyle = gradient2;
  context.beginPath();
  context.lineWidth = 10;
  context.moveTo(620, 100);
  context.lineTo(620 + Math.max(Math.min(player2.strength / 100 * 80, 80), 0), 100);
  context.stroke();
  
  // Display win message (if relevant)
  /*if (gameWinner>0) {
  
    context.fillStyle = '#FFFFFF';
    context.font = '72px Amatic SC';
  
    var winnerString = "";
    
    if (gameWinner==1) {
      
       winnerString = player1Name + ' Wins!!!';
    }
    else if (gameWinner==2) {
      
      winnerString = player2Name + ' Wins!!!';
    }
    
    var textMetrics = context.measureText(winnerString);
    context.fillText(winnerString, 400 - textMetrics.width / 2, 320);
  }*/
}