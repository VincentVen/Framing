module base {
    /**
	 * 切换服务器全局模块
	 * @author none
	 *
	 */
    export class ChangeServerGlobalModule extends how.module.GlobalModule {
        public static response: any = {
            changeServerSucess: CMDConfig.GET_CHANGESERVER_SUCESS,//切换服务器成功
            changeServerError: CMDConfig.GET_CHANGESERVER_ERROR,//切换服务器出错
            enterGameCompLete: CMDConfig.GET_ENTERGAME_COMPLETE,//进入游戏服务器完成
            enterGameError: CMDConfig.GET_ENTERGAME_ERROR,//进入游戏失败
            onSystemTalk: CMDConfig.GET_SYSMESSAGE,//收到系统消息
            changeServer: "changeServer",//切换服务器
        };
        private callBack: Function;
        private isMain: boolean = true;
        //切换服务器
        public changeServer(roomData: RoomData, isMain: boolean, callBack: Function): void {
            this.isMain = isMain;
            this.communicate(LoaddingGlobalModule.response.showLoad);
            if (isMain) {//是否是切换到大厅
                AppData.getInstance().currentRoom = null;
                this.gameSocket.send(CMDConfig.SEND_CHANGESERVER, {});
            } else {
                AppData.getInstance().currentRoom = roomData;
                this.gameSocket.send(CMDConfig.SEND_CHANGESERVER, { addr: roomData.host, port: roomData.port, channelid: AppData.getInstance().currentGame.channelID });
            }
            this.callBack = callBack;
        }
        //切换服务器成功
        private changeServerSucess(data: any): void {
            if (data.sid == 0) {//如果是切到大厅服务器
                this.communicate(LoaddingGlobalModule.response.hideLoad);
                AppData.getInstance().lastServerId = 0;
                this.callBack(true);
            } else {
                AppData.getInstance().lastServerPort = data.port;
                //登陆游戏服务器
                this.gameSocket.send(CMDConfig.SEND_LOGIN_GAMESERVER, {
                    dwUserID: AppData.getInstance().userData.id,
                    szPassWord: "",
                    dwProcessVersion: 0,
                    ChannelID: AppData.getInstance().currentGame.channelID,
                });
            }
        }
        //切换服务器出错
        private changeServerError(): void {
            how.Banner.show(LanguageConfig.connectClose, () => {
                this.communicate(LoaddingGlobalModule.response.hideLoad);
                if (this.callBack) {
                    this.callBack(false);
                }
            }, this);
        }
        //进入游戏服务器完成
        private enterGameCompLete(data: any): void {
            //根据端口号确定房间信息
            var roomList = AppData.getInstance().roomList;
            for (var i = 0; i < AppData.getInstance().roomList.length; i++) {
                if (roomList[i].port == AppData.getInstance().lastServerPort) {
                    AppData.getInstance().currentRoom = roomList[i];
                    break;
                }
            }
            // this.communicate(LoaddingGlobalModule.response.hideLoad);
            this.callBack(true);
        }
        //进入游戏失败
        private enterGameError(data: any): void {
            how.Banner.show(data.szErrorDescribe, () => {
                this.isMain = true;
                this.gameSocket.send(CMDConfig.SEND_CHANGESERVER, {});//重新切回大厅 
            }, this);
        }
        //收到系统消息
        private onSystemTalk(data: any): void {
            if (data.wMessageType == 2000 || data.wMessageType == 2) {
                this.communicate(LoaddingGlobalModule.response.hideLoad);
                if (data.szContent == 135) {
                    how.Alert.show(LanguageConfig["error_" + data.szContent]);
                } else {
                    how.Alert.show(LanguageConfig["error_" + data.szContent]);
                }
            }
        }
    }
}
