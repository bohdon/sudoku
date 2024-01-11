import { NetState } from "../utils/onlineTypes";
import { SolveState } from "../utils/gameTypes";
import Tile from "./Tile";

interface SubGridProps {
  /** The array of all tiles to display in this block. */
  tileIds: number[];

  /** The current displayed solve state. */
  solveState: SolveState;

  /** The currently selected tile. */
  selection: number | undefined;

  /** The current net state */
  netState: NetState;

  /** Called when any tile is clicked. */
  onTileClick: (tileId: number) => void;
}

/** A 3x3 grid containing the actual tiles for a region. */
export default function SubGrid({
  tileIds,
  solveState,
  selection,
  netState,
  onTileClick,
}: SubGridProps) {
  // the list of tileids selected by others
  const netSelectedTiles = Array.from(netState.selection.values());

  const tiles = tileIds.map((tileId) => {
    const tileState = solveState.tiles[tileId];

    return (
      <Tile
        key={tileId}
        state={tileState}
        isSelected={selection === tileId}
        isNetSelected={
          netSelectedTiles.findIndex((element) => {
            return element == tileId;
          }) != -1
        }
        onClickEvent={() => onTileClick(tileId)}
      />
    );
  });

  return <div className="grid sub-grid tri-grid">{tiles}</div>;
}
