import { useState } from "react";

interface TileProps {
  value: string;
  isSelected: boolean;
  isNetSelected: boolean;
  onClickEvent: () => void;
}

export default function Tile({
  value,
  isSelected,
  isNetSelected,
  onClickEvent,
}: TileProps) {
  function onClick() {
    onClickEvent();
  }

  return (
    <button
      className={`tile
        ${isSelected ? "selected" : ""}
        ${isNetSelected ? "net-selected" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
