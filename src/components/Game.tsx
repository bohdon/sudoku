import { useState } from "react";
import { GameMessage, GameWebSocket, UserMessage } from "../utils/online";
import { NetSelection } from "../utils/types";
import Grid from "./Grid";

export default function Game({ gameSocket }: { gameSocket: GameWebSocket }) {
  const [netSelection, setNetSelection] = useState<NetSelection>(new Map());
  const netState = {
    netSelection: netSelection,
  };

  gameSocket.onMessageEvent = (userMessage: UserMessage) => {
    let message: any = userMessage.message;
    console.log(`message: ${message.type} from ${userMessage.userId}`);

    if (message.type == "selection") {
      // store selected tile id by user id
      let newNetSelection = new Map(netSelection);
      newNetSelection.set(userMessage.userId, message.tileId);
      setNetSelection(newNetSelection);
    } else if (message.type == "disconnect") {
      // clear any tile selection
      if (netSelection?.has(userMessage.userId)) {
        let newNetSelection = new Map(netSelection);
        newNetSelection.delete(userMessage.userId);
        setNetSelection(newNetSelection);
      }
    }
  };

  function onGridSelectionChange(tileId: number) {
    if (!gameSocket.socket) {
      return;
    }

    gameSocket.send({ type: "selection", tileId: tileId });
  }

  return (
    <div className="game">
      <Grid netState={netState} onSelectionChange={onGridSelectionChange} />
    </div>
  );
}
