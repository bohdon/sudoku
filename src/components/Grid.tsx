import { useState } from "react";
import Tile from "./Tile";

export default function Grid() {
  const [selectedTile, setSelectedTile] = useState(-1);
  const tileIds = Array.from(Array(9).keys());

  function onTileClick(tileId: number) {
    setSelectedTile(tileId);
  }

  const tiles = tileIds.map((tileId) => {
    return (
      <Tile
        key={tileId}
        value={tileId.toString()}
        isSelected={selectedTile === tileId}
        onClickEvent={() => onTileClick(tileId)}
      />
    );
  });

  return <div className="grid tri-grid">{tiles}</div>;
}
