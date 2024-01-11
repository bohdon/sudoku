/**
 * Types and utils for online multiplayer.
 */

import { GameMessage } from "./gameTypes";

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

/**
 * Type defining the actual user messages that get sent, including
 * the client user id and the game message.
 */
export type UserMessage = { userId: string; message: GameMessage };
