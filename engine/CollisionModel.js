
//
// Collision categories and masks for types in the game
//


var CollisionModel = {
  
  StaticScene : {
    
    Category :  0b00001,
    Mask :      0b00010
  },
  
  Player : {
    
    Category :  0b00010,
    Mask :      0b11111
  },
  
  Projectile : {
    
    Category :  0b00100,
    Mask :      0b10110
  },
  
  Pickup : {
    
    Category :  0b01000,
    Mask :      0b00110
  },
  
  // Collision filter for ANY NPC
  NPC : {
    
    Category :  0b10000,
    Mask :      0b00110
  }
  
}
