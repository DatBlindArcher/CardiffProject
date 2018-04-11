
// Player control functions / states
// TODO: Put these in player

function updatePlayer(player, deltaTime, env) {
  
	var F = player.forwardDirection();
	
	// Get pixels (somewhere more distant)
	var pixels = system.context.getImageData(
	player.mBody.position.x - (player.size.width / 4), player.mBody.position.y - (player.size.height / 4), 
	player.size.width / 2, player.size.height / 2).data;
	
	// Get trail colors here
	var red = { r: 255, g: 0, b: 0 };
	
	// Pixel is per 4 rgba
	for (var i = 0; i < pixels.length; i += 4)
	{
		// We could do a manhatten circle check here
		
		if (pixels[i] == red.r && 
		pixels[i + 1] == red.g &&
		pixels[i + 2] == red.b)
		{
			console.log("We touched something: ", pixels[i], pixels[i + 1], pixels[i + 2]);
		}
	}
	
	// Compare if pixel (x, y) is not background.
	// TODO
	if (false) player.collideWithTrail("red", env);
	
	if (player.timer == 0)
	{
		// TODO
		// timer -= deltaTime;
		if (player.trail) {    
	  
		  // Add a position to trail
		  player.trail.positions.push({x: player.mBody.position.x - F.x * 40, y: player.mBody.position.y - F.y * 40});
		}
	}
	
	else
	{
		// leave gap
		// timer = Random.Range();
	}
		
	player.translate({ x : F.x * player_move_speed * deltaTime, y : F.y * player_move_speed * deltaTime });
	
  if (system.keyPressed(player.leftkey)) 
  { 
    Matter.Body.setAngularVelocity(player.mBody, 0);
    player.rotate(-Math.PI * player_rotate_speed * deltaTime);
  }
  
  if (system.keyPressed(player.rightkey)) 
  {  
    Matter.Body.setAngularVelocity(player.mBody, 0);
    player.rotate(Math.PI * player_rotate_speed * deltaTime);
  }
}