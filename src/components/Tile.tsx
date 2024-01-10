import { TileSolveState } from "../utils/types";

interface TileProps {
  state: TileSolveState;
  isSelected: boolean;
  isNetSelected: boolean;
  onClickEvent: () => void;
}

export default function Tile({
  state,
  isSelected,
  isNetSelected,
  onClickEvent,
}: TileProps) {
  function onClick() {
    onClickEvent();
  }
  const candidates = state.candidates;

  var content;
  if (state.value) {
    content = <span className="text-5xl">{state.value}</span>;
  } else {
    // 1..9
    const nums = Array.from(Array(9).keys()).map((elem) => elem + 1);
    content = nums.map((num) => {
      const idx = num - 1;
      const col = idx % 3;
      const row = Math.trunc(idx / 3);
      return (
        <span
          className={`num candidate col-${col} row-${row}`}
          hidden={!candidates.includes(num)}
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
      }`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
