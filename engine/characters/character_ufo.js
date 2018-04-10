
//
// Model simple UFO character type
//

// Behaviour model sub-state prototype
function State() {

  this.transitions = [];
  
  this.addTransition = function(targetState, conditionFunction, actionFunction) {
  
    this.transitions.push( { target : targetState, cond : conditionFunction, action : actionFunction } );
  }
  
  // Evaluate transitions - these are evaluated in the order they are stored 
  // when the graph is created for the host character.
  // Note 1: State transitions do not result in the host being killed off - we
  // transition to an 'end' state whose update() handler will return false (see above
  // comment).
  // Note: The action method could be integrated into the sub-state function? Resolved: No!
  // The problem with this approach is that different transitions to a given state may need different actions.
  // *** The key here is we don't violate the conditions for entering the target state!!! ***
  // Each state has an enter and exit method that are the first and last things called before and
  // after the state change respecitvely.
  //
  this.evalTransitions = function(hostObj, tDelta) {
  
    var transitionState = { newState : hostObj.currentState, stateChanged : false, transitionAction : null };
    
    for (var i=0; i<this.transitions.length && !transitionState.stateChanged; ++i) {
    
      if (this.transitions[i].cond(hostObj, tDelta)) {
      
        // Set target state
        transitionState.newState = this.transitions[i].target;
        
        // Set transition action to perform
        if (this.transitions[i].action !== undefined) {
        
          transitionState.transitionAction = this.transitions[i].action;
        }
        
        // Tell caller (host object) state will change
        transitionState.stateChanged = true;
      }
    }
    
    return transitionState;
  }
  
  // Generic function to override.  This is called after a transition has completed and after the 
  // host object's currentState has changed.
  this.enterState = function(hostObj, tDelta) {
  
    console.log("enter state");
  }
  
  // Generic function to override.  This is called prior to any transition occuring.
  this.exitState = function(hostObj, tDelta) {
  
    console.log("exit state");
  }
}

// Behaviour model example
function UFO(params, config) {
  
  var self = this;
  
  // Character attributes (visible to all sub-states) - config overrides defaults (hard-coded here) and params in turn overrides config
  
  // Example (pos derived from there here, but commonly set by caller)...
  this.pos = (params.pos !== undefined) ? params.pos : ( (config.pos !== undefined) ? config.pos : { x : 0, y : 0 } );
  
  this.strength = (params.strength !== undefined) ? params.strength : ( (config.strength !== undefined) ? config.strength : 100 );
  
  this.scale = player_sprite_scale;
  
  this.boundingVolumeScale = (params.boundingVolumeScale !== undefined) ? params.boundingVolumeScale :
                             ( (config.boundingVolumeScale !== undefined) ? config.boundingVolumeScale : 0.75 );
  
  
  // Derived attributes (internal to the behaviour model - not set by the caller)
  // -- none --
  
  
  // Set animation and display properties - these MUST come from config
  this.animations = config.animations;
  
  
  //
  // Build state graph
  //
  
  this.stateGraph = {};
  
  this.stateGraph['RunningState'] = new RunningState();
  this.stateGraph['EndState'] = new EndState();
    
  this.stateGraph['RunningState'].addTransition(
  
    this.stateGraph['EndState'],
    function(obj, tDelta) { return obj.strength <= 0; }
  );
  
  
  
  // Set initial state
  // ** IMPORTANT : INITIAL STATE AND ATTRIBUTE VALUES SET ABOVE MUST CORRESPOND ***
  
  this.currentState = (params.initState !== undefined) ? this.stateGraph[params.initState] :
                      ( (config.initState !== undefined) ? this.stateGraph[config.initState] : this.stateGraph['RunningState'] );
  
  this.currentAnimationSequence = null;
  
  // Once initial state is set, the first thing we do is call the new state's 'enter' method.
  // tDelta defaults to 0 for initial state setup.
  this.currentState.enterState(this, 0);
  
  
  //
  // Setup physics properties
  //
  
  // There is no fixed size, so base size on current animation sequence spritesheet
  var currentSpriteSheet = this.currentAnimationSequence.sequence.spriteSheet;
  
  var size = { width : currentSpriteSheet.spriteWidth * this.scale * this.boundingVolumeScale,
               height : currentSpriteSheet.spriteHeight * this.scale * this.boundingVolumeScale };
  
  this.mBody = Matter.Bodies.rectangle(this.pos.x, this.pos.y, size.width, size.height);
  this.size = size;
  
  var mass = (params.mass !== undefined) ? params.mass : ( (config.mass !== undefined) ? config.mass : 5 );
  var collisionGroup = (params.collisionGroup !== undefined) ? params.collisionGroup : ( (config.collisionGroup !== undefined) ? config.collisionGroup : 0 );
  var collisionCategory = (params.collisionCategory !== undefined) ? params.collisionCategory : ( (config.collisionCategory !== undefined) ? config.collisionCategory : CollisionModel.NPC.Category );
  var collisionMask = (params.collisionMask !== undefined) ? params.collisionMask : ( (config.collisionMask !== undefined) ? config.collisionMask : CollisionModel.NPC.Mask );
  
  
  Matter.Body.setMass(this.mBody, mass);
  this.mBody.collisionFilter.group = collisionGroup;
  this.mBody.collisionFilter.category = collisionCategory;
  this.mBody.collisionFilter.mask = collisionMask;
  
  //options.host.mBody.frictionAir = 0;

  this.mBody.hostObject = this;
  
  
  // Main update interface called by host application (prior to any Matter.js update)
  // Note: No postUpdate is defined.
  this.preUpdate = function(hostObj, tDelta, env) {
  
    // State update functions return either true or false.
    // If true is returned, the host character is considered to still be 'alive' so we
    // process state transitions and return true.  If false is returned, the host character
    // is considered to be 'dead' and we return false to tell the caller the host object
    // can be disposed of.
    var status = this.currentState.update(this, tDelta);
    
    if (status == true) {
    
      let transitionState = this.currentState.evalTransitions(this, tDelta);
      
      // A transition condition evaluates to true, perform ordered actions to transition to new state
      if (transitionState.stateChanged) {
      
        // 1. Exit current state
        this.currentState.exitState(this, tDelta);
        
        // 2. Call the action function if defined for the transition that's occuring
        if (transitionState.transitionAction) {
        
          transitionState.transitionAction(this, tDelta);
        }
        
        // 3. After existing state exit and transition actions have been performed, perform actual state change
        this.currentState = transitionState.newState;
        
        // 4. Once transition is complete, the first thing we do is call the new state's 'enter' method
        this.currentState.enterState(this, tDelta);
      }
    }
    
    return status;
  }
  
  
  this.draw = function(context) {
         
    if (self.mBody) {
      
      context.save();
      
      var pos = self.mBody.position;
      var theta = self.mBody.angle;
      
      context.translate(pos.x, pos.y);
      context.rotate(theta);
      
      var currentSpriteSheet = this.currentAnimationSequence.sequence.spriteSheet;
      
      context.translate(-currentSpriteSheet.spriteWidth * self.scale / 2,
                        -currentSpriteSheet.spriteHeight * self.scale / 2);
      
      currentSpriteSheet.draw(context, 0, 0, self.scale, self.currentAnimationSequence.fCurrent);
      
      context.restore();
      
      //this.drawBoundingVolume(context);
    }
    
  }
  
  
  // Draw player bounding volume (Geometry of Matter.Body mBody)
  this.drawBoundingVolume = function(context) {
    
    if (this.mBody) {
      
      // Render basis vectors
      
      // Get bi-tangent (y basis vector)
      var by = { x : -Math.sin(-this.mBody.angle), y : -Math.cos(-this.mBody.angle) };
      
      // Calculate tangent (x basis vector) via perp-dot-product
      var bx = {
        
        x : -by.y,
        y : by.x
      }
      
      var pos = this.mBody.position;
      
      
      var currentSpriteSheet = this.currentAnimationSequence.sequence.spriteSheet;
       
      var w = currentSpriteSheet.spriteWidth * this.scale / 2;
      var h = currentSpriteSheet.spriteHeight * this.scale / 2;
    
      context.lineWidth = 2;
          
      context.strokeStyle = '#FF0000';
      context.beginPath();
      context.moveTo(pos.x, pos.y);
      context.lineTo(pos.x + bx.x * w, pos.y + bx.y * w);
      context.stroke();
      
      context.strokeStyle = '#00FF00';
      context.beginPath();
      context.moveTo(pos.x, pos.y);
      context.lineTo(pos.x + by.x * h, pos.y + by.y * h);
      context.stroke();
        
      
      
      // Record path of mBody geometry
      context.beginPath();

      var vertices = this.mBody.vertices;
      
      context.moveTo(vertices[0].x, vertices[0].y);
      
      for (var j = 1; j < vertices.length; ++j) {
      
        context.lineTo(vertices[j].x, vertices[j].y);
      }
      
      context.lineTo(vertices[0].x, vertices[0].y);
          
      // Render geometry
      context.lineWidth = 1;
      context.strokeStyle = '#FFF';
      context.stroke();
    }
  }
  
  
  
  //
  // Specific sub-states for UFO character
  // 
  
  function RunningState() {
  
    this.__proto__ = new State();
    
    this.enterState = function(hostObj, tDelta) {
      
      hostObj.currentAnimationSequence = new SequenceInstance(hostObj.animations.RunningState);
      
      console.log("UFO running..."); // Debug log
      
      // *** WHEN ANIMATION / STATE CHANGES CHECK WE DON'T NEED TO CHANGE PROPERTIES
      // OF mBody SUCH AS SIZE ETC. ***
    }
    
    this.update = function(hostObj, tDelta) {
      
      
      // Update animation for current state
      // Note: Animation sequence works in seconds, not milliseconds, so convert before calling
      hostObj.currentAnimationSequence.updateFrame(tDelta / 1000);
      //console.log(obj.currentAnimationSequence.fCurrent);
      
      // We're still 'alive'
      return true;
    }
    
    this.exitState = function(hostObj, tDelta) {
    
      console.log("Leaving ufo running state..."); // Debug log
    }
  }
  
  
  function EndState() {
  
    this.__proto__ = new State();
    
    this.update = function(obj, tDelta) {
    
      console.log("Done - we're in the end state!");
      
      // End-of-life - indicate we're 'dead'
      return false;
    }
  }
  
  
  
  //
  // Collision interface
  //
  
  // Generic interface
  this.doCollision = function(otherBody, env) {
	  
	  otherBody.collideWithNPC(this, env);
  }

  // Collision methods to correspond with Group + Category-Mask settings in CollisionModel
  this.collideWithPlayer = function(otherPlayer, env) {
    
    console.log('Ouch from UFO!!!');
  }
  
  this.collideWithProjectile = function(projectile, env) {
        
    projectile.owner.score += points_on_hit;          
    //this.updateStrength(-projectile.type.strength);
    
    Matter.World.remove(system.engine.world, projectile.mBody);
    env.projectileArray.splice(env.projectileArray.indexOf(projectile), 1);
  }
  
}


// Character models (types)

function UFOCharacter() {

  var self = this;
  
  this.behaviouralModel = UFO;
  
  var spriteSheet = new SpriteSheet(

    'Assets/Images/enemy01_4x4.png',
    {
      numberOfRows : 4,
      numberOfColums : 4,
      spriteWidth : 32,
      spriteHeight : 32,
      framesPerSecond : 12
    }
  );
    
  this.config = {
    
    // No! We don't use a single spritesheet since different states may have different spritesheets!!!
    //spriteSheet : spriteSheet,
    
    animations : {
    
      RunningState : new AnimationSequence(
                                            {            
                                              spriteSheet : spriteSheet,
                                              startFrame : 0,
                                              endFrame : 15,
                                              oscillate : false
                                            })
    },
    
    // other attributes to override behaviour default
    strength : 50
    
  }; // Default properties for a UFO character - override defaults in behviour model
  
  // Create new instances of a UFO.  params overrides this.config and should contain a 'name' field
  // to uniquely identify / name the character instance created.  This is just for display - it has
  // no effect on functionality.
  this.create = function(params) {
  
    return new this.behaviouralModel(params, this.config);
  }
}
