import { useState } from "react";
import {
  NetConnectionStatus,
  NetSelection,
  NetState,
  UserMessage,
} from "../utils/onlineTypes";
import {
  GameState,
  Puzzle,
  SolveHistory,
  SolveState,
} from "../utils/gameTypes";
import GameWebSocket from "../utils/GameWebSocket";
import SolveController from "../utils/SolveController";
import Grid from "./Grid";
import Numpad from "./Numpad";
import NetStatus from "./NetStatus";
import PuzzleController from "../utils/PuzzleMaker";
import PuzzleInfo from "./PuzzleInfo";

/**
 * The main game mode and state. Contains the generated puzzle as well
 * as the current and all previous solve states. Uses GameWebSocket to
 * replicate changes from other clients.
 */
export default function Game({ gameSocket }: { gameSocket: GameWebSocket }) {
  // the current puzzle to solve
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  // all current and previous solve states
  const [history, setHistory] = useState<SolveHistory>([
    SolveController.initialState(),
  ]);

  // the current number of undos compared to the history, reset to 0 when state changes
  const [undoDepth, setUndoDepth] = useState(0);

  // currently selected tile
  const [selection, setSelection] = useState<number | null>(null);

  // current connection state
  const [netConnectionStatus, setNetConnectionStatus] =
    useState<NetConnectionStatus>("offline");

  if (netConnectionStatus != gameSocket.connectionStatus) {
    setNetConnectionStatus(gameSocket.connectionStatus);
  }

  // selection of other players online
  const [netSelection, setNetSelection] = useState<NetSelection>(new Map());

  // controller for working with solve states
  const controller = puzzle
    ? new SolveController(puzzle, history, undoDepth)
    : null;

  // the current bundled game state for passing around
  const gameState: GameState = {
    puzzle: puzzle,
    history: history,
    solveState: controller ? controller.state() : null,
    selection: selection,
  };

  // combined network state, for passing to other components
  const netState: NetState = {
    status: netConnectionStatus,
    selection: netSelection,
  };

  /** Set the new solve state, adding it to the history. */
  function setSolveState(newState: SolveState) {
    setHistory([...history, newState]);
  }

  /** Called when user clicks the New puzzle button. */
  function onNewPuzzleClick() {
    if (puzzle && !confirm("Generate a new puzzle?")) {
      return;
    }

    var puzzleController = new PuzzleController();
    var newPuzzle = puzzleController.makePuzzle();
    setNewPuzzle(newPuzzle);
    gameSocket?.send({ type: "new-puzzle", puzzle: newPuzzle });
  }

  /** Called when user selects a new tile. */
  function onGridSelectionChange(tileId: number) {
    setSelection(tileId);
    gameSocket?.send({ type: "selection", selection: tileId });
  }

  /** Called when input is given from the numpad. */
  function onNumpadInput(value: number | undefined, isCandidate: boolean) {
    if (!selection || !controller) {
      return;
    }
    var newState = null;

    if (value === undefined) {
      // clear current value or candidates.
      // regardless of candidate mode, always clear any value first
      // so that candidates aren't cleared invisibly
      if (controller.hasValue(selection)) {
        newState = controller.clearValue(selection);
      } else if (isCandidate) {
        newState = controller.clearCandidates(selection);
      }
    } else {
      // set a new value
      if (isCandidate) {
        newState = controller.toggleCandidate(selection, value);
      } else {
        newState = controller.setValue(selection, value);
      }
    }

    if (newState) {
      setSolveState(newState);
      gameSocket?.send({
        type: "tile-state",
        tileId: selection,
        tileState: newState.tiles[selection],
      });
    }
  }

  /** Called when the online connection status changed. */
  gameSocket.onConnectionStatusChange = (newStatus: NetConnectionStatus) => {
    setNetConnectionStatus(newStatus);
  };

  /** Called when receiving a message from the game websocket. */
  gameSocket.onMessageEvent = (userMessage: UserMessage) => {
    let message = userMessage.message;
    console.log(`message: ${message.type} from ${userMessage.userId}`);

    if (message.type == "disconnect") {
      // clear any tile selection
      if (netSelection?.has(userMessage.userId)) {
        let newNetSelection = new Map(netSelection);
        newNetSelection.delete(userMessage.userId);
        setNetSelection(newNetSelection);
      }
    }

    if (message.type == "new-puzzle") {
      // init game state with new puzzle
      setNewPuzzle(message.puzzle);
    }

    if (message.type == "tile-state") {
      // force-update the tile state for the updated tile
      var newState = controller?.setTileState(
        message.tileId,
        message.tileState
      );

      // TODO: how do we ensure history states match?
      if (newState) {
        setSolveState(newState);
      }
    }

    if (message.type == "selection") {
      // store selected tile id by user id
      let newNetSelection = new Map(netSelection);
      newNetSelection.set(userMessage.userId, message.selection);
      setNetSelection(newNetSelection);
    }
  };

  function setNewPuzzle(newPuzzle: Puzzle) {
    setPuzzle(newPuzzle);
    setSolveState(SolveController.initialState(newPuzzle));
    console.log(newPuzzle);
  }

  return (
    <div className="su-game play-area">
      <div className="play-area">
        <div className="columns wrap">
          <div className="column box">
            <div className="box flex">
              <button className="btn" onClick={onNewPuzzleClick}>
                New
              </button>
              <span className="align-right">
                {puzzle != null ? <PuzzleInfo gameState={gameState} /> : null}
                <NetStatus netState={netState} />
              </span>
            </div>
            <Grid
              gameState={gameState}
              netState={netState}
              onSelectionChange={onGridSelectionChange}
            />
          </div>
          <div className="column box centered">
            <Numpad onInput={onNumpadInput} />
          </div>
        </div>
      </div>
    </div>
  );
}
