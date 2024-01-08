import { GameWebSocket } from "./utils/online";
import Game from "./components/Game";

import "./App.scss";

// create online connection
var gameSocket = new GameWebSocket();

export default function App() {
  return <Game gameSocket={gameSocket} />;
}
