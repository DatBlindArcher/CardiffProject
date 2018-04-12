
// Player control functions / states
function updatePlayer(player, deltaTime, env) {
	if (!env.gamestate.started || player.dead) return;
	
	var F = player.forwardDirection();
	
	if (player.trail)
	{
		// Trail collisions
		for (var i = 0; i < env.players.length; i++)
		{
			var trail = env.players[i].trail;
			
			if (isPlayerOnTrail(player, trail, deltaTime, env))
			{
				console.log("We touched something: ", trail.color);
				player.collideWithTrail(trail, env);
			}
		}
		
		player.trail.positions.push({ x: player.mBody.position.x, y: player.mBody.position.y, size: trail_width * env.gamestate.size });
	}
	
	if (player.mBody.position.x <= 0 || player.mBody.position.y <= 0 || player.mBody.position.x >= 800 || player.mBody.position.y >= 600) 
			player.collideWithTrail(player.trail, env);
		
	player.translate({ x : F.x * player_move_speed * env.gamestate.speed * deltaTime, y : F.y * player_move_speed * env.gamestate.speed * deltaTime });
	
  if (system.keyPressed(player.leftKey)) 
  { 
    player.rotate(-Math.PI * player_rotate_speed * deltaTime);
  }
  
  if (system.keyPressed(player.rightKey)) 
  {  
    player.rotate(Math.PI * player_rotate_speed * deltaTime);
  }
}

function isPlayerOnTrail(player, trail, deltaTime, env) {
	var center = player.mBody.position;
	var radius = (player.size.width * env.gamestate.size / 1.5);
	radius *= radius;
	var points = trail.positions;
	if (points.length == 0) return false;
	
	for (var i = 0; i < points.length; i++)
	{
		if (player.trail == trail)
			if (points.length - i < env.gamestate.size / 2 * trail_tail / env.gamestate.speed) 
				break;
		
		var dx = center.x - points[i].x;
		var dy = center.y - points[i].y;
		
		if (dx * dx + dy * dy - points[i].size * trail_width <= radius)
		{
			return true;  
		}
	}
	
	return false;
}