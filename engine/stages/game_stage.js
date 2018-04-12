
//
// Model main game stage
//

function GameStage() {

  var self = this;
  
  
  // Inter-state transition handling
  this.transitionLinks = {
  
    EndGame : null
  };
  
  this.setTransition = function(id, target) {
  
    self.transitionLinks[id] = target;
  }
  
  
  
  // Main game-state specific variables
  this.background = null;
  
  this.players = [];
  
  this.pickupTypes = []; // Pickup TYPES
  this.pickupArray = []; // Pickup INSTANCES
  this.pickup_timer = 0; // Number of seconds between pickups appearing        
	
  this.showStats = true;
  
  // End of game state
  this.gameWinner = null;
    
  
  // "Internal" state functions
  this.drawScene = function() {

    // Draw background        
    if (self.background) {	      
		self.background.draw(system.canvas);				
	}
  
    // Draw
	drawObjects(system.context, self.players);
    drawObjects(system.context, self.pickupArray);

    // Draw UI
    drawHUD(system.context, self.players);
  
    if (self.showStats) {
      document.getElementById("actualTime").innerHTML = "Seconds elapsed = " + system.gameClock.actualTimeElapsed().toFixed(2) + " s";
      document.getElementById("timeDelta").innerHTML = "Time Delta = " + Math.round(system.gameClock.deltaTime).toFixed() + " ms";
      document.getElementById("fps").innerHTML = "FPS = " + system.gameClock.frameCounter.getAverageFPS().toFixed();
      document.getElementById("spf").innerHTML = "SPF = " + (system.gameClock.frameCounter.getAverageSPF() * 1000.0).toFixed() + " ms";
    }
  }


  
  // Data passed from previous stage (or main app if first stage of entry) that is relevant for initialisation
  this.initPacket = null;
  
  // Initialise stage with data passed from previous stage or web app initialisation. Data passed in via initPacket - this is because
  // the stage model is based on the idea that the host browser calls each stage function directly.  This is not necessary however - if we called
  // stages directly, when each function exists, we'd unravel the stack call hierarchy anyway and a subsequent frame callback will be
  // directly to the correct stage function.
  this.init = function(obj) {
  
    // Load background
    self.background = new Background('black');
    
    // Setup players
    self.players.push(new Player( { pid : "Player 1",
                          x : 200,
                          y : 400,
                          spriteURI : 'Assets/Images/Avatars/avatar2.png',
                          world : system.engine.world,
                          mass : 20,
                          boundingVolumeScale : 0.75,
                          collisionGroup : -1,
						  leftKey : 'A',
						  rightKey : 'D',
                          preUpdate : function(player, deltaTime, env) {
                          
                            updatePlayer(player, deltaTime, env);
                          },
                          postUpdate : function() {}
                          }));
						
    // Pickups
    self.pickupTypes['points_pickup'] = new PickupType(  { spriteURI : 'Assets/Images/pickup_points.png',
                                                      collisionGroup : 0,
                                                      handler : function(collector) {
                                                     
                                                       collector.addPoints(50);
                                                      }
                                                    } );											
    
    self.pickup_timer = pickup_time_delay;
    
    // Setup gravity configuration for this stage
    system.engine.world.gravity.y = 0;
    
    // Add bounds so you cannot go off the screen
    var b0 = Matter.Bodies.rectangle(-50, 300, 100, canvas.height, { isStatic: true });
    var b1 = Matter.Bodies.rectangle(850, 300, 100, canvas.height, { isStatic: true });
    var b2 = Matter.Bodies.rectangle(400, -50, canvas.width, 100, { isStatic: true });
    var b3 = Matter.Bodies.rectangle(400, 650, canvas.width, 100, { isStatic: true });
    
    b0.collisionFilter.group = 0;
    b0.collisionFilter.category = CollisionModel.StaticScene.Category;
    b0.collisionFilter.mask = CollisionModel.StaticScene.Mask;
    
    b1.collisionFilter.group = 0;
    b1.collisionFilter.category = CollisionModel.StaticScene.Category;
    b1.collisionFilter.mask = CollisionModel.StaticScene.Mask;
    
    b2.collisionFilter.group = 0;
    b2.collisionFilter.category = CollisionModel.StaticScene.Category;
    b2.collisionFilter.mask = CollisionModel.StaticScene.Mask;
    
    b3.collisionFilter.group = 0;
    b3.collisionFilter.category = CollisionModel.StaticScene.Category;
    b3.collisionFilter.mask = CollisionModel.StaticScene.Mask;
    
    Matter.World.add(system.engine.world, [b0, b1, b2, b3]);



    // Register on-collision event
    Matter.Events.on(system.engine, 'collisionStart', function(event) {
    
      let pairs = event.pairs;
      
      for (var i=0; i<pairs.length; ++i) {
        
        if (pairs[i].bodyA.hostObject !== undefined &&
            pairs[i].bodyB.hostObject !== undefined) {
        
          pairs[i].bodyA.hostObject.doCollision(pairs[i].bodyB.hostObject, { players : self.players, pickupTypes : self.pickupTypes, pickupArray : self.pickupArray } );
        }
        
      }
    });
    
    
    // Register pre-update call (handle app-specific stuff)
    Matter.Events.on(system.engine, 'beforeUpdate', function(event) {
    
      var world = event.source.world;
      
      for (var i=0; i < world.bodies.length; ++i) {
      
        if (world.bodies[i].hostObject !== undefined &&
            world.bodies[i].hostObject.preUpdate !== undefined) {
          
          world.bodies[i].hostObject.preUpdate(world.bodies[i].hostObject, system.gameClock.deltaTime, { players : self.players, pickupTypes : self.pickupTypes, pickupArray : self.pickupArray } );
        }
      };
    });
    
    
    // Register post-update call (handle app-specific stuff)
    Matter.Events.on(system.engine, 'afterUpdate', function(event) {
    
      var world = event.source.world;
      
      for (var i=0; i < world.bodies.length; ++i) {
      
        if (world.bodies[i].hostObject !== undefined &&
            world.bodies[i].hostObject.postUpdate !== undefined) {
        
          world.bodies[i].hostObject.postUpdate(world.bodies[i].hostObject, system.gameClock.deltaTime, { players : self.players, pickupTypes : self.pickupTypes, pickupArray : self.pickupArray } );
        }
      };
    });                    
    
    console.log("init done");
    
    // Setup done - go to phase-in stage
    window.requestAnimationFrame(self.phaseInLoop);
  }
  
  
  // Once initialisation has complete, enter phase-in loop (perform initial animation for example)
  this.phaseInLoop = function() {
  
    console.log("phase-in");
    
    var phaseIn = false;
    
    if (phaseIn) {
    
      window.requestAnimationFrame(self.phaseInLoop);
    }
    else {
    
      // Phase-in complete - enter main loop
      window.requestAnimationFrame(self.mainLoop);
    }
  }
  
  // Once phase-in stage has finished, enter the main loop (perform main stage operations here)
  this.mainLoop = function() {
    
    
    // Update system clock
    system.gameClock.tick();
    
    // Update main physics engine state
    Matter.Engine.update(system.engine, system.gameClock.deltaTime);
    
    // Manage pickups
    let pickupStatus = processPickups(self.pickupTypes, system.engine, self.pickup_timer, system.gameClock.convertTimeIntervalToSeconds(system.gameClock.deltaTime));
    
    self.pickup_timer = pickupStatus.timer;
    
    if (pickupStatus.newPickup) {
    
      Matter.World.add(system.engine.world, [pickupStatus.newPickup.mBody]); 
      self.pickupArray.push(pickupStatus.newPickup);
    }
    
    // Render latest frame
    self.drawScene();
    
    // Check for end-of-game state
    // TODO
    
    // Repeat gameloop, or start phase-out if end of game condition(s) met
    if (self.gameWinner==null) {
    
      window.requestAnimationFrame(self.mainLoop);
    }
    else {
    
      // Conditions arise to exit stage - leave mainLoop and enter initPhaseOut
      window.requestAnimationFrame(self.initPhaseOut);
    }
  }
  
  this.initPhaseOut = function() {
  
    console.log("init phaseOut");
    console.log(self.gameWinner.pid + " Wins!!!");
    
    window.requestAnimationFrame(self.phaseOutLoop);
  }
  
  // When transitioning to another stage, first perform any phase-out operations / animation
  this.phaseOutLoop = function() {
  
    console.log("phase out");
    
    /*
    if (true) {
    
      window.requestAnimationFrame(phaseOutLoop);
    }
    else {
    
      // Phase-out loop complete - call leaveStage to clean-up and enter next stage if one is given (if not leave and fall-out to main)
      window.requestAnimationFrame(this.leaveStage);
    }
    */
    window.requestAnimationFrame(self.leaveStage);
  }

  // Finally, leaveStage clears state and moves on to the next state
  this.leaveStage = function(id, params) {
  
    console.log("leave stage");
    
    /*if (id !== undefined && this.transitionLinks[id]) {
    
      // Head to initialisation of next stage (pass relevant parameter object along)
      transitionLinks[id].initPacket = params;
      window.requestAnimationFrame(transitionLinks[id].init);
    }*/
  }
}