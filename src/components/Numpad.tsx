export default function Numpad() {
  const numbers = Array.from(Array(9).keys()).map((elem) => elem + 1);

  const numberButtons = numbers.map((num) => {
    return <button className="btn btn-numpad">{num}</button>;
  });
  return <div className="grid tri-grid">{numberButtons}</div>;
}
