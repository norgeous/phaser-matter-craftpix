export const collisionCategories = {
  default:          0b00000000000000000000000000000001, // 1 (the default category)
  ladders:          0b00000000000000000000000000000010, // 2
  enemyDamage:      0b00000000000000000000000000000100, // 4
  player:           0b00000000000000000000000000001000, // 8
  enemy:            0b00000000000000000000000000010000, // 16
  door:             0b00000000000000000000000000100000, // 32
  movingPlatforms:  0b00000000000000000000000001000000, // 64
  toxicDamage:      0b00000000000000000000000010000000, // 128
  'team-dog':       0b00000000000000000000000100000000, // 256
  'team-cat':       0b00000000000000000000001000000000, // 512
  'team-bird':      0b00000000000000000000010000000000, // 1024
  'team-undead':    0b00000000000000000000100000000000, // 2048
  // ...
  layer32:          0b10000000000000000000000000000000, // 2147483648 (32 max layer)
};

// export const teamCategories = Object.fromEntries(Object.entries(collisionCategories).filter(([k]) => k.startsWith('team-')));
export const getTeamSensorCollisionMask = teamName => Object.entries(collisionCategories)
  .reduce((acc, [k, v]) => k.startsWith('team-') && k !== teamName ? acc | v : acc, 0);

// 4294967295 a mask of everything, the default mask
export const collisionMaskEverything = 0b11111111111111111111111111111111;
