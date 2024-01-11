import { TileSolveState } from "../utils/gameTypes";

interface TileProps {
  tileId: number;
  state: TileSolveState | null;
  isSelected: boolean;
  isNetSelected: boolean;
  isPuzzleTile: boolean;
  hasError: boolean;
  onClickEvent: () => void;
}

export default function Tile({
  tileId,
  state,
  isSelected,
  isNetSelected,
  isPuzzleTile,
  hasError,
  onClickEvent,
}: TileProps) {
  const candidates = state ? state.candidates : [];
  const value = state?.value;

  var content;
  if (value != null) {
    content = <span className="num-lg">{value}</span>;
  } else {
    content = candidates.map((num) => {
      const idx = num - 1;
      const col = idx % 3;
      const row = Math.trunc(idx / 3);
      return (
        <span
          key={num}
          className={`num candidate num-sm col-${col} row-${row}`}
        >
          {num}
        </span>
      );
    });
  }

  return (
    <button
      className={`tile ${isSelected ? "selected" : ""} ${
        isNetSelected ? "net-selected" : ""
      } ${isPuzzleTile ? "puzzle" : ""} ${hasError ? "error" : ""}`}
      onClick={() => onClickEvent()}
    >
      {content}
    </button>
  );
}
