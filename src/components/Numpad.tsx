import { useState } from "react";

export default function Numpad() {
  /** Is the user inputting candidates, or a chosen value? */
  const [isCandidate, setIsCandidate] = useState(true);
  const numbers = Array.from(Array(9).keys()).map((elem) => elem + 1);

  function onNumClick(value: number) {
    console.log(value, isCandidate);
  }

  const numberButtons = numbers.map((num) => {
    return (
      <button className="btn text-4xl" onClick={() => onNumClick(num)}>
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
      <div className="grid tri-grid numpad">{numberButtons}</div>
    </div>
  );
}
