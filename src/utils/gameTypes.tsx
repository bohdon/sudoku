/**
 * Types for online networking.
 */

/** Properties for a single tile of a solution. */
export interface TileSolveState {
  /** The annotated candidate values for the tile. */
  candidates: number[];
  /** The chosen value for the tile. */
  value: number | undefined;
}

/** Properties for all tiles of a solution. */
export interface SolveState {
  /** Solve state for all tiles. */
  tiles: TileSolveState[];
}

/** Type defining all possible game message payloads. */
export type GameMessage =
  // custom message
  | { type: string }
  // server has sent this client a new client id
  | { type: "client-id" }
  // another client has disconnected
  | { type: "disconnect" }
  // grid selection has changed
  | { type: "selection"; tileId: number }
  // the tile values have changed
  | { type: "tile-value"; value: number };
