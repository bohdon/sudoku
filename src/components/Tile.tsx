import { TileSolveState } from "../utils/gameTypes";

interface TileProps {
  state: TileSolveState | null;
  isSelected: boolean;
  isNetSelected: boolean;
  isPuzzleTile: boolean;
  onClickEvent: () => void;
}

export default function Tile({
  state,
  isSelected,
  isNetSelected,
  isPuzzleTile,
  onClickEvent,
}: TileProps) {
  function onClick() {
    onClickEvent();
  }
  const candidates = state ? state.candidates : [];
  const value = state ? state.value : null;

  var content;
  if (value) {
    content = <span className="text-5xl">{value}</span>;
  } else {
    content = candidates.map((num) => {
      const idx = num - 1;
      const col = idx % 3;
      const row = Math.trunc(idx / 3);
      return (
        <span
          key={num}
          className={`num candidate text-base col-${col} row-${row}`}
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
      } ${isPuzzleTile ? "puzzle" : ""}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
