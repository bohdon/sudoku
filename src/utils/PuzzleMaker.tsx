import { makepuzzle, posfor, ratepuzzle, solvepuzzle } from "sudoku";
import { Puzzle } from "./gameTypes";

/**
 * Handles generating puzzles and validating solutions.
 */
export default class PuzzleController {
  /** Generate and return new puzzle. */
  makePuzzle(): Puzzle {
    // generate array of 81 tiles
    var puzzleTiles = makepuzzle();
    // rate the puzzle difficulty
    var difficulty = ratepuzzle(puzzleTiles, 1);
    // remap 0..8 > 1..9
    puzzleTiles = puzzleTiles.map((num: number) => {
      return num != null ? num + 1 : num;
    });

    return { tiles: puzzleTiles, difficulty: difficulty };
  }
}
