import { GameState } from "../utils/gameTypes";

interface PuzzleInfoProps {
  gameState: GameState;
}

export default function PuzzleInfo({ gameState }: PuzzleInfoProps) {
  return (
    <span className="badge">Difficulty: {gameState.puzzle?.difficulty}</span>
  );
}
