import { Vector2 } from "../math/Vector2";

/** A map of other player's selected tiles, by client id. */
export type NetSelection = Map<string, number>;

/** The possible states of network connection. */
export type NetState = "offline" | "connecting" | "online";

/** Properties for a single tile of a solution. */
interface TileSolveState {
  /** The annotations for the tile. */
  annotations: number[];
  /** The chosen value for the tile. */
  value: number;
}

/** Properties for all tiles of a solution. */
interface SolveState {
  /** Solve state for all tiles. */
  tiles: TileSolveState[];
}

/**
 * Tracks both the state and history of states for the game,
 * as well as its settings, the current puzzle, and other data.
 */
export class GameState {
  // the size of the grid
  dimensions: Vector2;

  // the current and previous state data
  history: SolveState[];

  /** The current number of states that have been undone, reset when a new state is set. */
  undoDepth: number = 0;

  constructor() {
    this.dimensions = new Vector2(9, 9);
    this.history = Array(1);
  }

  /** Return the current solve state. */
  solveState(): SolveState {
    return this.history[this.history.length - 1];
  }

  /** Set a new solve state, adding it to the history. */
  setSolveState(state: SolveState) {
    this.history.push(state);
  }

  /** Undo the last solve state change and pop it from history. */
  undo(): boolean {
    // can only undo up to 'last index - 1' of history
    if (this.undoDepth >= this.history.length - 2) {
      return false;
    }

    this.undoDepth++;
    return true;
  }

  /** Redo an undone solve state. */
  redo(): boolean {
    if (this.undoDepth == 0) {
      return false;
    }

    this.undoDepth--;
    return true;
  }
}
