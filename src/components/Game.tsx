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

  gameSocket.onConnectionStatusChange = (newStatus: NetConnectionStatus) => {
    setNetConnectionStatus(newStatus);
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

  function onNewPuzzleClick() {
    if (puzzle && !confirm("Generate a new puzzle?")) {
      return;
    }

    var puzzleController = new PuzzleController();
    var newPuzzle = puzzleController.makePuzzle();
    setPuzzle(newPuzzle);
    setSolveState(SolveController.initialState(newPuzzle));
    console.log(newPuzzle);
  }

  function onGridSelectionChange(tileId: number) {
    setSelection(tileId);

    if (gameSocket.socket) {
      gameSocket.send({ type: "selection", tileId: tileId });
    }
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
    }
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
