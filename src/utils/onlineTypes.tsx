/**
 * Types and utils for online multiplayer.
 */

import { Puzzle, TileSolveState } from "./gameTypes";

/** The possible states of network connection. */
export type NetConnectionStatus = "offline" | "connecting" | "online" | "error";

/** A map of other player's selected tiles, by client id. */
export type NetSelection = Map<string, number>;

/** All state needed for online play. */
export interface NetState {
  /** State of network connection. */
  status: NetConnectionStatus;

  /** Current selection of all other clients. */
  selection: NetSelection;
}

/** Server has sent this client a new client id. */
type ClientIdMessage = { type: "client-id" };

/** Another client has disconnected */
type DisconnectMessage = { type: "disconnect" };

/** A new puzzle has been generated */
type NewPuzzleMessage = { type: "new-puzzle"; puzzle: Puzzle };

/** A tile state has changed */
type TileStateMessage = {
  type: "tile-state";
  tileId: number;
  tileState: TileSolveState;
};

/** Grid selection has changed */
type SelectionMessage = { type: "selection"; selection: number };

/** Union of all possible types of online game messages. */
export type GameMessage =
  | ClientIdMessage
  | DisconnectMessage
  | NewPuzzleMessage
  | TileStateMessage
  | SelectionMessage;

/**
 * Type defining the actual user messages that get sent, including
 * the client user id and the game message.
 */
export type UserMessage = { userId: string; message: GameMessage };
