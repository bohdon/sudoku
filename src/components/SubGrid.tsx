import { NetSelection } from "../utils/types";
import Tile from "./Tile";

interface SubGridProps {
  tileIds: number[];
  selection: number;
  netSelection: NetSelection;
  onTileClick: (tileId: number) => void;
}

/** A 3x3 grid containing the actual tiles for a region. */
export default function SubGrid({
  tileIds,
  selection,
  netSelection,
  onTileClick,
}: SubGridProps) {
  // the list of tileids selected by others
  const netSelectedTiles = Array.from(netSelection.values());

  const tiles = tileIds.map((tileId) => {
    const tileValue = null;

    return (
      <Tile
        key={tileId}
        value={tileValue}
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
