module how {
	/**
	 * WebSocket管理器，收发websocket消息全部用这个类
	 * 接受消息用how.EventManager，因为用WebSocketManager是无效的
	 * 因为how.EventManager包含dispatcher而WebSocketManager没有，WebSocketManager是无法抛出事件的
	 * @author none
	 *
	 */
    export class WebSocketManager {
        private static _instance: WebSocketManager;
        /**
         * WebSocket管理器
         */
        public constructor() {
            this.resetWebSocket();
        }
        /**
         * 重置websocket，之前请先断开连接
         */
        public resetWebSocket(): void {
            if (this.ws) {
                this.ws.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
                this.ws.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
                this.ws.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
                this.ws.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketClose, this);
            }
            this.ws = new egret.WebSocket();
            this.ws.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.ws.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this.ws.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.ws.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketClose, this);
        }
        /**
         * WebSocket管理器单例
         */
        public static getInstance(): WebSocketManager {
            if (!this._instance) {
                this._instance = new WebSocketManager();
            }
            return this._instance;
        }
        private ws: egret.WebSocket;
        private _isConnecting: boolean = false;
        private _connected: boolean = false;
        /** 
        * 是否打印消息日志
        **/
        public useLog: boolean = true;
        /** 
        * 是否正在连接
        **/
        public get isConnecting(): boolean {
            return this._isConnecting;
        }
        /** 
        * 是否已经连接
        **/
        public get connected(): boolean {
            return this._connected;
        }

        /**
         * 重连间隔
         */
        private _host: string = "";
        private _port: string = "";
        public get host(): string {
            return this._host;
        }
        public get port(): string {
            return this._port;
        }
        private actionTimeout: number = null;//操作间隔定时器(用来判断用户在一定时间不操作就断开网络)
        /** 
        * 连接到指定的主机和端口
        * @param host {string} 主机ip或者域名
        * @param port {string} 主机端口号
        **/
        public connect(host: string, port: string): void {
            if (!this._connected && !this._isConnecting) {
                this._host = host;
                this._port = port;
                this.resetWebSocket();
                this._isConnecting = true;
                this._connected = false;
                // this.ws.connect(host, port);
                var protocol = window.location.toString().indexOf("https") != -1 ? "wss://" : "ws://";
                this.ws.connectByUrl(protocol + host + port);
                trace("连接: " + host + ":" + port + "  time：" + how.Utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"));
            }
        }
        /** 
        * 关闭连接
        **/
        public close(): void {
            if (this.actionTimeout) {
                egret.clearTimeout(this.actionTimeout);
                this.actionTimeout = null;
            }
            if (this.ws.connected) {
                this.ws.close();
                this._isConnecting = false;
                this._connected = false;
            }
        }
        /** 
        * 发送数据给服务器
        * @param cmd {string} 命令
        * @param host {any} 数据
        **/
        public send(cmd: string, data?: any) {
            if (this.ws.connected) {
                data = data || {};
                var m = parseInt(cmd.split(",")[0]);
                var s = parseInt(cmd.split(",")[1]);
                var d = { m: m, s: s, d: data };
                if (this.useLog) {
                    trace("发送：" + d.m + "," + d.s + " 数据：" + JSON.stringify(data) + "  time：" + how.Utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"));
                }
                this.ws.writeUTF(JSON.stringify(d));
                this.ws.flush();
                if (cmd != CMDConfig.SEND_HEARTBEAT1 && cmd != CMDConfig.SEND_HEARTBEAT2) {//判断是否是心跳包
                    if (this.actionTimeout) {
                        egret.clearTimeout(this.actionTimeout);
                        this.actionTimeout = null;
                    }
                    this.actionTimeout = egret.setTimeout(() => {
                        this.close();
                        how.Alert.show(LanguageConfig.actionTimeout, () => {
                            if (top.location != location) {
                                location.href = base.Utils.getQueryString(location.search, "returnUrl");
                            } else {
                                location.reload();//刷新当前页面
                            }
                        }, this, null, LanguageConfig.chognshilian);
                    }, this, 10 * 60 * 1000);
                }
            }
            else {
                how.EventManager["getInstance"](this).dispatchEvent(egret.Event.CLOSE, { host: this._host, port: this._port });
            }
        }

        private onReceiveMessage(event: egret.ProgressEvent): void {
            var result: string = this.ws.readUTF();
            //特判
            if (result.indexOf("43") != -1 && result.indexOf("106") != -1 && result.indexOf("ChipReqInfo") != -1) {
                result = result.substring(0, result.length - 4) + "]}}";
            }
            var resultData: any = JSON.parse(result);
            how.EventManager["getInstance"](this).dispatchEvent(event.type, result);
            if (this.useLog) {
                trace("收到：" + resultData.m + "," + resultData.s + " 数据：" + JSON.stringify(resultData.d) + "  time：" + how.Utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"));
            }
            how.EventManager["getInstance"](this).dispatchEvent(resultData.m + "," + resultData.s, resultData.d);
        }
        private onSocketOpen(event: egret.Event): void {
            this._isConnecting = false;
            this._connected = true;
            trace("网络已连接" + "  time：" + how.Utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"));
            how.EventManager["getInstance"](this).dispatchEvent(event.type, { host: this._host, port: this._port });
        }
        private onSocketClose(event: egret.Event): void {
            if (this._connected || this._isConnecting) {
                this._isConnecting = false;
                this._connected = false;
                trace("网络已断开" + "  time：" + how.Utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"));
                how.EventManager["getInstance"](this).dispatchEvent(egret.Event.CLOSE, { host: this._host, port: this._port });
            }
        }
    }
}
