import { useState } from "react";
import { NetSelection } from "../utils/types";
import Tile from "./Tile";

interface GridProps {
  onSelectionChange: (tileId: number) => void;
  netState: { netSelection: NetSelection };
}

export default function Grid({ onSelectionChange, netState }: GridProps) {
  const [selectedTile, setSelectedTile] = useState(-1);
  const tileIds = Array.from(Array(9).keys());
  const netSelectedTiles = Array.from(netState.netSelection.values());

  function onTileClick(tileId: number) {
    setSelectedTile(tileId);
    onSelectionChange(tileId);
  }

  const tiles = tileIds.map((tileId) => {
    return (
      <Tile
        key={tileId}
        value={tileId.toString()}
        isSelected={selectedTile === tileId}
        isNetSelected={
          netSelectedTiles.findIndex((element) => {
            return element == tileId;
          }) != -1
        }
        onClickEvent={() => onTileClick(tileId)}
      />
    );
  });

  return <div className="grid tri-grid">{tiles}</div>;
}
