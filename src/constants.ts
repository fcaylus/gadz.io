/**
 * Dimensions of the game (in game unit, abbreviated unit)
 */
export const GAME_SIZE = 1000;

/**
 * Ground position (unit)
 */
export const GROUND_Y = -100;

/**
 * Player width (unit)
 */
export const PLAYER_WIDTH = 50;

// in unit/frame
export const PLAYER_INITIAL_SPEED = 10;
// in unit/frame
export const PLAYER_SPEED_INCREMENT = 1;
// in frames
export const PLAYER_SPEED_INCREMENT_DURATION = 500;

export const OBSTACLE_INITIAL_SPAWN_CHANCE = 0.08;
export const OBSTACLE_SPAWN_CHANCE_INCREMENT = 0.005;
export const OBSTACLE_SPAWN_CHANCE_INCREMENT_DURATION = 500;
export const OBSTACLE_MAX_SPAWN_CHANCE = 0.5;

export const MAX_JUMP_FRAMES = 10;

// in unit/frame
export const JUMP_VELOCITY = 50;
export const JUMP_ADDITIONAL_VELOCITY = 5;
export const GRAVITY = 4;
// between 0 and 1
export const FRICTION = 0.7;

export const COLOR_SKY = '#2B424A';
export const COLOR_GROUND = '#683e2b';

export const COLOR_BACKGROUND_RESET = '#000000';
