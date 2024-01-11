/**
 * Types for gameplay.
 */

/** Represents an initial puzzle to be solved. */
export interface Puzzle {
  tiles: (number | null)[];
  difficulty: number;
}

/** Properties for a single tile of a solution. */
export interface TileSolveState {
  /** The annotated candidate values for the tile. */
  candidates: number[];
  /** The chosen value for the tile. */
  value: number | null;
}

/** Properties for all tiles of a solution. */
export interface SolveState {
  /** Solve state for all tiles. */
  tiles: TileSolveState[];
}

/** An array of SolveStates. */
export type SolveHistory = SolveState[];

/** A bundled representing of all game state for passing around. */
export interface GameState {
  /** The puzzle to solve. */
  puzzle: Puzzle | null;
  /** The full history of solve states. */
  history: SolveHistory;
  /** The currently displayed solve state. */
  solveState: SolveState | null;
  /** The currently selected tile. */
  selection: number | null;
}
