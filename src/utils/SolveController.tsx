import { Puzzle, SolveResult, SolveState, TileSolveState } from "./gameTypes";

/**
 * A controller for modifying SolveStates.
 */
export default class SolveController {
  /** The puzzle being solved */
  puzzle: Puzzle;

  /** History of all solve states. */
  history: SolveState[];

  /** The current depth of undo, reset to 0 when state changes. */
  undoDepth: number;

  constructor(puzzle: Puzzle, history: SolveState[], undoDepth = 0) {
    if (history.length == 0 || !history[0]) {
      throw new Error("history must have at least 1 state");
    }
    this.puzzle = puzzle;
    this.history = history;
    this.undoDepth = undoDepth;
  }

  /** Return the current solve state. */
  state(): SolveState {
    return this.history[this.history.length - 1 - this.undoDepth];
  }

  cloneState(): SolveState {
    return structuredClone(this.state());
  }

  /** Return true if a tile is part of the original puzzle. */
  isPuzzleTile(tileId: number): boolean {
    return this.puzzle.tiles[tileId] != null;
  }

  /** Return true if a tile is not part of the original puzzle and can be changed. */
  canModifyTile(tileId: number): boolean {
    return !this.isPuzzleTile(tileId);
  }

  /** Return true if a tile has a value. */
  hasValue(tileId: number): boolean {
    return this.state().tiles[tileId].value != null;
  }

  /** Set the value of a tile and return a new solve state */
  setValue(tileId: number, value: number | undefined): SolveState | null {
    if (!this.canModifyTile(tileId)) {
      return null;
    }
    var newState = this.cloneState();
    newState.tiles[tileId].value = value;
    return newState;
  }

  /** Clear the value for a tile and return a new solve state */
  clearValue(tileId: number): SolveState | null {
    if (!this.canModifyTile(tileId)) {
      return null;
    }
    var newState = this.cloneState();
    newState.tiles[tileId].value = undefined;
    return newState;
  }

  /** Toggle the candidate of a tile and return a new solve state */
  toggleCandidate(tileId: number, value: number): SolveState | null {
    if (!this.canModifyTile(tileId)) {
      return null;
    }
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
  clearCandidates(tileId: number): SolveState | null {
    if (!this.canModifyTile(tileId)) {
      return null;
    }
    var newState = this.cloneState();
    newState.tiles[tileId].candidates = [];
    return newState;
  }

  /** Set the full state of a tile. */
  setTileState(tileId: number, tileState: TileSolveState): SolveState | null {
    if (!this.canModifyTile(tileId)) {
      return null;
    }
    var newState = this.cloneState();
    newState.tiles[tileId] = tileState;
    return newState;
  }

  /** Check the current solve state and return a solve result. */
  checkSolve(solveState: SolveState, puzzle: Puzzle): SolveResult {
    var isCompleted = true;
    var errors: number[] = [];

    for (let i = 0; i < solveState.tiles.length; i++) {
      const value = solveState.tiles[i].value;
      if (value == null || value != puzzle.solution[i]) {
        // either missing or incorrect
        isCompleted = false;

        if (value != null) {
          // incorrect
          errors.push(i);
        }
      }
    }

    return {
      isCompleted: isCompleted,
      errors: errors,
    };
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

  /** Return an initial solve state with the puzzle tiles filled in. */
  static initialState(puzzle?: Puzzle): SolveState {
    var tiles = Array<TileSolveState>(81);
    for (let i = 0; i < tiles.length; i++) {
      const value = puzzle?.tiles[i];
      tiles[i] = {
        value: value !== undefined && value !== null ? value : undefined,
        candidates: [],
      };
    }
    return { tiles: tiles };
  }

  /** Return an empty solve result. */
  static emptySolveResult(): SolveResult {
    return { isCompleted: false, errors: [] };
  }
}
