/**
 * 游戏全局断线重连模块
 * @author none
 *
 */
class ReConnectedModule extends how.module.GlobalModule {
    public static response: any = {
        gameHide: how.Application.APPEVENT_PAUSE,
        gameShow: how.Application.APPEVENT_RESUME,
        onSocketOpen: egret.Event.CONNECT,//网络连接成功
        onSocketClose: egret.Event.CLOSE,
        onHeartbeat1: CMDConfig.SEND_HEARTBEAT1,//收到心跳包
        onHeartbeat2: CMDConfig.SEND_HEARTBEAT2,//收到心跳包
        setIsThrowOut: "setIsThrowOut",
        // onLoginSuccess: CMDConfig.GET_LOGINSUCESS,//登陆成功
        // onLoginSuccess: CMDConfig.GET_GAME_CONFIG,//登陆返回
    }
    public isThrowOut: Boolean = false;
    // public reConnectedCount: number = 0;//重连次数
    public sendHeartbeatDate: number = 0;
    public sendHeartbeatTimers: number = null;
    public currentSocket: how.WebSocketManager = null;
    //网络连接成功
    public onSocketOpen(data: any): void {
        if (data.host == this.hallSocket.host && data.port == this.hallSocket.port) {
            this.currentSocket = this.hallSocket;
        }
        if (data.host == this.gameSocket.host && data.port == this.gameSocket.port) {
            this.currentSocket = this.gameSocket;
        }
        if (this.sendHeartbeatTimers) {
            egret.clearTimeout(this.sendHeartbeatTimers);
            this.sendHeartbeatTimers = null;
        }
        this.sendHeartbeat();
    }
    //发送心跳包
    public sendHeartbeat(): void {
        this.sendHeartbeatDate = new Date().getTime();
        var cmd = this.currentSocket == this.hallSocket ? CMDConfig.SEND_HEARTBEAT1 : CMDConfig.SEND_HEARTBEAT2;
        this.currentSocket.send(cmd, {});
        this.sendHeartbeatTimers = egret.setTimeout(this.sendHeartbeat, this, 30 * 1000);
    }
    /**
     *收到心跳包 
    */
    public onHeartbeat1(): void {
        // AppData.getInstance().networkDelay = (new Date().getTime()) - this.sendHeartbeatDate;
    }
    /**
     *收到心跳包 
    */
    public onHeartbeat2(): void {
        // AppData.getInstance().networkDelay = (new Date().getTime()) - this.sendHeartbeatDate;
    }
    //设置是否是相同帐号登录
    public setIsThrowOut(falg: Boolean): void {
        this.isThrowOut = falg;
    }
    //游戏进入后台
    public gameHide(): void {
        AppData.getInstance().isGameHide = true;
    }
    //游戏恢复到前台
    public gameShow(): void {
        AppData.getInstance().isGameHide = false;
    }
    //当网络断开
    public onSocketClose(data: any): void {
        if (this.sendHeartbeatTimers && data.host == this.gameSocket.host && data.port == this.gameSocket.port) {
            egret.clearTimeout(this.sendHeartbeatTimers);
            this.sendHeartbeatTimers = null;
        }
        if (!this.isThrowOut && ((data.host == GameConfig.hallSocketHost && data.port == GameConfig.hallSocketPort)
            || (!this.hallSocket.connected && (data.host == this.gameSocket.host && data.port == this.gameSocket.port)))) {
            how.Alert.show(LanguageConfig.noNetworkTip, () => {
                if (top.location != location) {
                    location.href = base.Utils.getQueryString(location.search, "returnUrl");
                } else {
                    location.reload();//刷新当前页面
                }
            }, this, null, LanguageConfig.chognshiLabel);
            // this.reConnectedCount++;
            // if (this.reConnectedCount > 1) {
            //     egret.setTimeout(this.connectAndLogin, this, 3000);
            // } else {
            //     this.connectAndLogin();
            // }
        }
    }
    //自动登陆游戏
    // public connectAndLogin(): void {
    //     if (typeof (how.Application.currentScene) != "undefined") {
    //         if (this.reConnectedCount > 1 && this.reConnectedCount < 5) {
    //             how.Banner.show(how.StringUtils.format(LanguageConfig.reConnectedTip, this.reConnectedCount - 1));
    //         }
    //         if (this.reConnectedCount < 4) {
    //             this.communicate(base.GameHallGlobalModule.response.getLogin);
    //             // this.communicate(base.LoginGlobalModule.response.autoLogin);
    //         } else if (this.reConnectedCount == 4) {
    //             how.Alert.show(LanguageConfig.noNetworkTip, () => {
    //                 this.reConnectedCount = 0;
    //                 // this.communicate(base.LoginGlobalModule.response.autoLogin);
    //                 this.communicate(base.GameHallGlobalModule.response.getLogin);
    //             }, this, null, LanguageConfig.chognshiLabel);
    //         }
    //     }
    // }
    //登陆成功
    // public onLoginSuccess(): void {
    //     this.reConnectedCount = 0;
    // }
}