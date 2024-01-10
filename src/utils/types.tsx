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

/**
 * A controller for modifying SolveStates.
 */
export class SolveController {
  /** History of all solve states. */
  history: SolveState[];

  /** The current depth of undo, reset to 0 when state changes. */
  undoDepth: number;

  constructor(history: SolveState[], undoDepth = 0) {
    if (history.length == 0 || !history[0]) {
      throw new Error("history must have at least 1 state");
    }
    this.history = history;
    this.undoDepth = undoDepth;
  }

  /** Return the current solve state. */
  state(): SolveState {
    return this.history[this.history.length - 1 - this.undoDepth];
  }

  cloneState(): SolveState {
    return structuredClone(this.state());
    // var solveState = this.state();
    // return {
    //   tiles: Array.from(solveState.tiles),
    // };
  }

  /** Set the value of a tile and return a new solve state */
  setValue(tileId: number, value: number | undefined): SolveState {
    var newState = this.cloneState();
    newState.tiles[tileId].value = value;
    return newState;
  }

  /** Clear the value for a tile and return a new solve state */
  clearValue(tileId: number): SolveState {
    var newState = this.cloneState();
    newState.tiles[tileId].value = undefined;
    return newState;
  }

  /** Toggle the candidate of a tile and return a new solve state */
  toggleCandidate(tileId: number, value: number): SolveState {
    var newState = this.cloneState();
    var candidates = newState.tiles[tileId].candidates;
    var valueIdx = candidates.indexOf(value);
    if (valueIdx != -1) {
      // remove
      candidates.splice(valueIdx, 1);
    } else {
      // add it
      candidates.push(value);
      candidates.sort();
    }
    return newState;
  }

  /** Clear all candidates for a tile and return a new solve state. */
  clearCandidates(tileId: number): SolveState {
    var newState = this.cloneState();
    newState.tiles[tileId].candidates = [];
    return newState;
  }

  /** Return true if there are any states to undo. */
  canUndo(): boolean {
    // can only undo up to 'last index - 1' of history
    return this.undoDepth < history.length - 2;
  }

  /** Return true if there are any undos that can be redone. */
  canRedo(): boolean {
    return this.undoDepth > 0;
  }

  /** Return an empty solve state. */
  static initialState(): SolveState {
    var tiles = Array<TileSolveState>(81);
    for (let i = 0; i < tiles.length; i++) {
      tiles[i] = {
        value: undefined,
        candidates: [],
      };
    }
    return { tiles: tiles };
  }
}
