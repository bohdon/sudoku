import { useState } from "react";

interface TileProps {
  value: string;
  isSelected: boolean;
  onClickEvent: () => void;
}

export default function Tile({ value, isSelected, onClickEvent }: TileProps) {
  function onClick() {
    onClickEvent();
  }

  return (
    <button
      className={`tile ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
