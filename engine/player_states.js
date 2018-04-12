
// Player control functions / states
function updatePlayer(player, deltaTime, env) {
	if (!env.started || player.dead) return;
	
	var F = player.forwardDirection();
	
	if (player.trail)
	{
		// Trail collisions
		for (var i = 0; i < env.players.length; i++)
		{
			var trail = env.players[i].trail;
			
			if (isPlayerOnTrail(player, trail, deltaTime))
			{
				console.log("We touched something: ", trail.color);
				player.collideWithTrail(trail, env);
			}
		}
		
		player.trail.positions.push({ x: player.mBody.position.x, y: player.mBody.position.y });
	}
		
	player.translate({ x : F.x * player_move_speed * deltaTime, y : F.y * player_move_speed * deltaTime });
	
  if (system.keyPressed(player.leftKey)) 
  { 
    player.rotate(-Math.PI * player_rotate_speed * deltaTime);
  }
  
  if (system.keyPressed(player.rightKey)) 
  {  
    player.rotate(Math.PI * player_rotate_speed * deltaTime);
  }
}

function isPlayerOnTrail(player, trail, deltaTime) {
	var center = player.mBody.position;
	var radius = (player.size.width / 1.5);
	radius *= radius;
	var points = trail.positions;
	if (points.length == 0) return false;
	
	for (var i = 0; i < points.length; i++)
	{
		if (player.trail == trail)
			if (points.length - i < trail_tail) 
				break;
		
		var dx = center.x - points[i].x;
		var dy = center.y - points[i].y;
		
		if (dx * dx + dy * dy <= radius)
		{
			console.log(center, points[i]);
			return true;  
		}
	}
	
	return false;
}