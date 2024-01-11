import { NetState } from "../utils/onlineTypes";
import { GameState } from "../utils/gameTypes";
import Tile from "./Tile";
import SolveController from "../utils/SolveController";

interface SubGridProps {
  /** The array of all tiles to display in this block. */
  tileIds: number[];

  /** The current puzzle, solve state, selection. */
  gameState: GameState;

  /** The current net state */
  netState: NetState;

  /** Called when any tile is clicked. */
  onTileClick: (tileId: number) => void;
}

/** A 3x3 grid containing the actual tiles for a region. */
export default function SubGrid({
  tileIds,
  gameState,
  netState,
  onTileClick,
}: SubGridProps) {
  // the list of tileids selected by others
  const netSelectedTiles = Array.from(netState.selection.values());

  const tiles = tileIds.map((tileId) => {
    const tileState = gameState.solveState
      ? gameState.solveState.tiles[tileId]
      : null;
    const isNetSelected = netSelectedTiles.indexOf(tileId) != -1;
    const isPuzzleTile = gameState.puzzle?.tiles[tileId] != null;

    return (
      <Tile
        key={tileId}
        state={tileState}
        isSelected={gameState.selection === tileId}
        isNetSelected={isNetSelected}
        isPuzzleTile={isPuzzleTile}
        onClickEvent={() => onTileClick(tileId)}
      />
    );
  });

  return <div className="grid sub-grid grid-col-3 grid-row-3">{tiles}</div>;
}
