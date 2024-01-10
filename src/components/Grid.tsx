import { useState } from "react";
import { NetSelection } from "../utils/types";
import SubGrid from "./SubGrid";

interface GridProps {
  onSelectionChange: (tileId: number) => void;
  netState: { netSelection: NetSelection };
}

/** A 3x3 grid of SubGrids, each containing a 3x3 grid of tiles. */
export default function Grid({ onSelectionChange, netState }: GridProps) {
  const [selectedTile, setSelectedTile] = useState(-1);
  // all 81 tiles in the grid
  const tileIds = Array.from(Array(81).keys());
  const netSelectedTiles = Array.from(netState.netSelection.values());

  var subGridTileIds = Array(9);
  {
    // build 9 groups of 9 tile ids (81 total)
    let tileId = 0;
    for (let i = 0; i < 9; i++) {
      let theseTileIds = Array.from(Array(9).keys()).map(
        (element) => element + tileId
      );
      subGridTileIds.push(theseTileIds);
      tileId += 9;
    }
  }

  function onTileClick(tileId: number) {
    setSelectedTile(tileId);
    onSelectionChange(tileId);
  }

  const subGrids = subGridTileIds.map((element) => {
    return (
      <SubGrid
        key={element}
        tileIds={element}
        selection={selectedTile}
        netSelection={netState.netSelection}
        onTileClick={onTileClick}
      />
    );
  });

  return <div className="grid main-grid tri-grid">{subGrids}</div>;
}
