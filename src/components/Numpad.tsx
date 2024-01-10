import { useState } from "react";

interface NumpadProps {
  onInput: (value: number | undefined, isCandidate: boolean) => void;
}

export default function Numpad({ onInput }: NumpadProps) {
  /** Is the user inputting candidates, or a chosen value? */
  const [isCandidate, setIsCandidate] = useState(false);
  const numbers = Array.from(Array(9).keys()).map((elem) => elem + 1);

  function onNumClick(value: number) {
    onInput(value, isCandidate);
  }

  function onClearClick() {
    onInput(undefined, false);
  }

  const numberButtons = numbers.map((num) => {
    return (
      <button
        key={num}
        className="btn text-5xl"
        onClick={() => onNumClick(num)}
      >
        {num}
      </button>
    );
  });
  return (
    <div className="">
      <div className="columns">
        <button
          className={`column btn ${isCandidate ? "selected" : "dimmed"}`}
          onClick={() => setIsCandidate(true)}
        >
          Candidate
        </button>
        <button
          className={`column btn ${isCandidate ? "dimmed" : "selected"}`}
          onClick={() => setIsCandidate(false)}
        >
          Normal
        </button>
      </div>
      <div className="numpad">
        <div className="grid tri-grid">{numberButtons}</div>
        <button className="btn text-5xl" onClick={onClearClick}>
          X
        </button>
      </div>
    </div>
  );
}
