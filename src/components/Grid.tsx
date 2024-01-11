import { SolveState } from "../utils/gameTypes";
import { NetState } from "../utils/onlineTypes";
import SubGrid from "./SubGrid";

interface GridProps {
  /** Currently selected tile. */
  selection: number | undefined;

  /** The current solve state. */
  solveState: SolveState;

  /** The current net state */
  netState: NetState;

  /** Called when the selection has changed by clicking on the grid. */
  onSelectionChange: (tileId: number) => void;
}

/** A 3x3 grid of SubGrids, each containing a 3x3 grid of tiles. */
export default function Grid({
  selection,
  solveState,
  netState,
  onSelectionChange,
}: GridProps) {
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
    onSelectionChange(tileId);
  }

  const subGrids = subGridTileIds.map((element) => {
    return (
      <SubGrid
        key={element}
        tileIds={element}
        solveState={solveState}
        selection={selection}
        netState={netState}
        onTileClick={onTileClick}
      />
    );
  });

  return <div className="grid main-grid tri-grid">{subGrids}</div>;
}
