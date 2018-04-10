
//
// Player control functions / states
//
var timer = 1;
var lastpos = null;

function updatePlayer1(player, deltaTime, env) {
  
	var F = player.forwardDirection();
		
	if (timer > 0)
	{
		//timer -= deltaTime;
		if (player.trail) {    
		  // Add vertices to physics body
		  player.trail.vertices.push({x: player.mBody.position.x + trail_width / 2, y: player.mBody.position.y});
		  player.trail.vertices.push({x: player.mBody.position.x - trail_width / 2, y: player.mBody.position.y});
		  player.trail.vertices.push({x: player.mBody.position.x - trail_width / 2, y: player.mBody.position.y + trail_width / 2});
		  Matter.Body.setVertices(player.trail.mBody, player.trail.vertices);
	  
		  // Add a position to trail
		  player.trail.positions.push({x: player.mBody.position.x, y: player.mBody.position.y});
		}
	}
	
	else
	{
		// leave gap
		// timer = Random.Range();
	}
		
	player.translate({ x : F.x * player_move_speed * deltaTime, y : F.y * player_move_speed * deltaTime });
	
  if (system.keyPressed('A')) {
    
    Matter.Body.setAngularVelocity(player.mBody, 0);
    player.rotate(-Math.PI * player_rotate_speed * deltaTime);
  }
  
  if (system.keyPressed('D')) {
    
    Matter.Body.setAngularVelocity(player.mBody, 0);
    player.rotate(Math.PI * player_rotate_speed * deltaTime);
  }
  
  
  // Only allow fire when recharge counter = 0
  
  if (system.keyPressed('SPACE') && player.fireRechargeTime<=0) {
  
    // Create new bullet
    var playerDirection = player.forwardDirection();
    
    var newBullet = new Bullet( { pos :  player.mBody.position,
                                  direction : { x : playerDirection.x * projectile_speed, y : playerDirection.y * projectile_speed},
                                  type : env.projectileTypes['player1_bullet'],
                                  owner : player,
                                  postUpdate : function(bullet, deltaTime, env) {
                      
                                                if (bullet.range > 0) {
                                                
                                                  bullet.range = bullet.range - 1;
                                                  
                                                  if (bullet.range==0) {
                                                    
                                                    // Delete bullet instance                  
                                                    Matter.World.remove(system.engine.world, bullet.mBody);
                                                    env.projectileArray.splice(env.projectileArray.indexOf(bullet), 1);
                                                  }
                                                }
                                              } 
                                });
    
    if (newBullet) {
    
      // Add new bullet to matter.js physics system
      Matter.World.add(system.engine.world, [newBullet.mBody]);
  
      // Add new bullet to the main app bullet model
      env.projectileArray.push(newBullet);
    }
    
    player.fireRechargeTime = env.projectileTypes['player1_bullet'].rechargeTime * player.rechargeRate;
    
  }
  
}


function updatePlayer2(player, deltaTime, env) {
  
  if (system.keyPressed('P')) {
    
    var F = player.forwardDirection();
    
    player.applyForce(player.mBody.position, { x : F.x * 0.01, y : F.y * 0.01 });
  }
  
  if (system.keyPressed('L')) {
    
    var F = player.forwardDirection();
    
    player.applyForce(player.mBody.position, { x : -F.x * 0.01, y : -F.y * 0.01 });
  }
  
  if (system.keyPressed('N')) {
    
    Matter.Body.setAngularVelocity(player.mBody, 0);
    player.rotate(-Math.PI * player_rotate_speed);
  }
  
  if (system.keyPressed('M')) {
    
    Matter.Body.setAngularVelocity(player.mBody, 0);
    player.rotate(Math.PI * player_rotate_speed);
  }
  
  
  // Only allow fire when recharge counter = 0
  if (system.keyPressed('RETURN') && player.fireRechargeTime<=0) {
  
    // Create new bullet
    var playerDirection = player.forwardDirection();
    
    var newBullet = new Bullet( { pos :  player.mBody.position,
                                  direction : { x : playerDirection.x * projectile_speed, y : playerDirection.y * projectile_speed},
                                  type : env.projectileTypes['player2_bullet'],
                                  owner : player,
                                  postUpdate : function(bullet, deltaTime, env) {
                      
                                                if (bullet.range > 0) {
                                                
                                                  bullet.range = bullet.range - 1;
                                                  
                                                  if (bullet.range==0) {
                                                    
                                                    // Delete bullet instance                  
                                                    Matter.World.remove(system.engine.world, bullet.mBody);
                                                    env.projectileArray.splice(env.projectileArray.indexOf(bullet), 1);
                                                  }
                                                }
                                              } 
                                } );
    
    if (newBullet) {
    
      // Add new bullet to matter.js physics system
      Matter.World.add(system.engine.world, [newBullet.mBody]);
  
      // Add new bullet to the main app bullet model
      env.projectileArray.push(newBullet);
    }
    
    player.fireRechargeTime = env.projectileTypes['player2_bullet'].rechargeTime * player.rechargeRate;
  }
  
}
