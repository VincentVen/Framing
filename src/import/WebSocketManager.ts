/**
 *WebSocketManager类路径的快捷方式
 * @author none
 *
 */
class WebSocketInstance {
    private static _hallSocket: how.WebSocketManager = new how.WebSocketManager();
    private static _gameSocket: how.WebSocketManager = new how.WebSocketManager();
    public constructor() {
    }
    public static getHallSocket(): how.WebSocketManager {
        return this._hallSocket;
    }
    public static getGameSocket(): how.WebSocketManager {
        return this._gameSocket;
    }
}
