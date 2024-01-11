/**
 * Types and utils for online multiplayer.
 */

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

/** Type defining all possible game message payloads. */
export type GameMessage =
  // custom message
  | { type: string }
  // server has sent this client a new client id
  | { type: "client-id" }
  // another client has disconnected
  | { type: "disconnect" }
  // grid selection has changed
  | { type: "selection"; tileId: number }
  // the tile values have changed
  | { type: "tile-value"; value: number };

/**
 * Type defining the actual user messages that get sent, including
 * the client user id and the game message.
 */
export type UserMessage = { userId: string; message: GameMessage };

/**
 * A util for constructing a websocket to send and receive messages.
 * Handles tagging messages with a unique user id.
 */
export class GameWebSocket {
  /** The url to connect to the server. */
  url = "ws://localhost:8000";

  /** The unique id of this user/client, given by the server. */
  userId: string | null = null;

  /** The websocket connection to the server. */
  socket: WebSocket | null = null;

  /** The current connection status. */
  connectionStatus: NetConnectionStatus;

  /** Called when the connection status has changed. */
  onConnectionStatusChange = (newStatus: NetConnectionStatus) => {};

  /** Called when a UserMessage is received. */
  onMessageEvent = (message: UserMessage) => {};

  constructor(autoConnect = true) {
    // listen for window visibility change, and refresh socket if its dead
    document.addEventListener("visibilitychange", (event) => {
      if (
        this.socket &&
        this.socket.readyState !== WebSocket.OPEN &&
        this.socket.readyState !== WebSocket.CONNECTING
      ) {
        // connection lost, re-establish
        this.createSocket();
      }
    });

    this.connectionStatus = "offline";

    // auto-create socket on construct
    if (autoConnect) {
      this.createSocket();
    }
  }

  _setConnectionStatus(newStatus: NetConnectionStatus) {
    if (this.connectionStatus != newStatus) {
      this.connectionStatus = newStatus;
      this.onConnectionStatusChange(newStatus);
    }
  }

  /**
   * Create a new websocket and add event listeners.
   * The socket will only be stored once a connection is established.
   */
  createSocket() {
    this._setConnectionStatus("connecting");
    console.log(`connecting to ${this.url}`);
    var newSocket = new WebSocket(this.url);

    newSocket.addEventListener("error", (event) => {
      this._setConnectionStatus("error");
      console.log("socket error", event);
    });

    // handle connection opened
    newSocket.addEventListener("open", () => {
      // save the connected socket
      this.socket = newSocket;
      this._setConnectionStatus("online");
      console.log("connected...");
    });

    // handle message received
    newSocket.addEventListener("message", (event) => {
      var userMessage: UserMessage = JSON.parse(event.data);
      if (userMessage.message.type == "client-id") {
        // this user has been given a new client id by the server
        this.userId = userMessage.userId;
        console.log(`received client id: ${this.userId}`);
      } else if (userMessage.userId === this.userId) {
        // the server should prevent this, but skip since this message was sent by us
        return;
      }

      this.onMessageEvent(userMessage);
    });
  }

  /** Send a message to all other clients. */
  send(message: any) {
    if (!this.userId) {
      // don't send messages without an id
      return;
    }

    // tag the message with our user id
    let userMessage: UserMessage = {
      userId: this.userId,
      message: message,
    };
    this.socket?.send(JSON.stringify(userMessage));
  }
}
