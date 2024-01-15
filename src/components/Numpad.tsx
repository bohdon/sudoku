import { useContext, useState } from "react";
import { GameStateContext } from "../utils/Contexts";

interface NumpadProps {
  onInput: (value: number | undefined, isCandidate: boolean) => void;
}

export default function Numpad({ onInput }: NumpadProps) {
  const gameState = useContext(GameStateContext);

  /** Is the numpad enabled? false when there's no puzzle. */
  const isEnabled = gameState.puzzle != null;

  /** Is the user inputting candidates, or a chosen value? */
  const [isCandidate, setIsCandidate] = useState(false);

  const numbers = Array.from(Array(9).keys()).map((elem) => elem + 1);

  function onNumClick(value: number) {
    onInput(value, isCandidate);
  }

  function onClearClick() {
    onInput(undefined, isCandidate);
  }

  const numberButtons = numbers.map((num) => {
    const idx = num - 1;
    const col = idx % 3;
    const row = Math.trunc(idx / 3);

    return (
      <button key={num} className="btn" onClick={() => onNumClick(num)}>
        {isCandidate ? (
          <span className={`num num-sm col-${col} row-${row}`}>{num}</span>
        ) : (
          <span className="num num-lg">{num}</span>
        )}
      </button>
    );
  });
  return (
    <div className={`numpad grid grid-col-3 ${isEnabled ? "" : "disabled"}`}>
      {numberButtons}
      <button className="btn" onClick={onClearClick}>
        <span className="num-lg">X</span>
      </button>
      <button
        className={`btn ${isCandidate ? "dimmed" : "selected"}`}
        onClick={() => setIsCandidate(false)}
      >
        <span className="num-lg">#</span>
      </button>
      <button
        className={`btn ${isCandidate ? "selected" : "dimmed"}`}
        onClick={() => setIsCandidate(true)}
      >
        <span className="num-sm">#</span>
      </button>
    </div>
  );
}
