module base {
	/**
	 * 游戏服务器全局模块
	 *
	 */
    export class GameRoomGlobalModule extends how.module.GlobalModule {
        public static response: any = {
            enterGame: CMDConfig.GET_GAME_ENTER,//收到进入游戏
            onSocketOpen: egret.Event.CONNECT,//网络连接成功
            onLoginSuccess: CMDConfig.GET_LOGIN_SUCCESS,//登陆成功
            onLoginFailed: CMDConfig.GET_LOGINFAILURE,//登陆失败
            onRoomList: CMDConfig.GET_ROOMLIST,//收到房间列表
            onLastServerId: CMDConfig.GET_LASTSERVERID,//收到最后一次登陆服务器id
            quitGameSuccess: CMDConfig.SEND_GAME_QUIT_SUCCESS,//退出游戏成功
            onStatusChange: CMDConfig.GET_STATUS_CHANGE,//玩家状态改变
        };
        private token: string = "";//验证信息
        private host: string = "";//访问host
        private port: string = "";//访问端口
        public start(): void {
        }
        public enterGame(data: any) {
            if (data.code == 0) {
                this.token = data.token;
                //获取host跟port
                var gameURL: string = data.gameURL, temp = gameURL.indexOf("ws://"),
                    gameURL = temp == -1 ? gameURL : gameURL.substr(temp + 5, gameURL.length - temp - 5),
                    list = gameURL.split(":");
                this.host = list[0];
                // this.host = list[0] = "192.168.20.83";
                this.port = list[1] ? ":" + list[1] : "";
                this.connect();
            } else if (data.code == -1) {
                how.Alert.show(LanguageConfig.hall_error_100);
                this.communicate(LoaddingGlobalModule.response.hideLoad);
            } else {
                how.Alert.show(LanguageConfig["hall_error_" + data.code]);
                this.communicate(LoaddingGlobalModule.response.hideLoad);
            }
        }
        //连接网络并且登陆
        public connect(): void {
            this.gameSocket.connect(this.host, this.port);
        }
        //网络连接成功
        private onSocketOpen(data: any): void {
            if (data.host == this.host && data.port == this.port) {
                //发送验证信息
                this.gameSocket.send(CMDConfig.SEND_LOGIN, {
                    ChannelID: AppData.getInstance().getGameChannelId(),
                    szAccounts: AppData.getInstance().userData.channelID + "_" + AppData.getInstance().userData.accounts,
                    szPassWord: this.token
                });
            }
        }
        //收到登陆成功
        private onLoginSuccess(data: any): void {
            AppData.getInstance().dataInit();//初始化appData
            AppData.getInstance().userData.setData(data);//保存用户信息
        }
        //收到登陆失败
        private onLoginFailed(data: any): void {
            this.communicate(LoaddingGlobalModule.response.hideLoad);
            switch (data.lErrorCode) {
                case 53:
                case 55:
                case 56:
                    how.Alert.show(LanguageConfig["loginFailed_" + data.lErrorCode], () => { }, this);
                    break;
                default:
                    how.Alert.show(LanguageConfig.loginFailed, () => { }, this);
                    break;
            }
            this.gameSocket.close();
        }
        //收到最后一次登陆服务器id
        private onLastServerId(data: any): void {
            AppData.getInstance().lastServerId = data.ServerID;
            AppData.getInstance().lastGameId = data.KindID;
            if (AppData.getInstance().lastServerId != 0) {
                NewGameSceneData.getInstance().playerList = [];
            }
        }
        //收到房间列表
        private onRoomList(data: any): void {
            AppData.getInstance().currentGame = base.Utils.getItem(AppData.getInstance().gameList, "id", data.wKindID[0]);
            AppData.getInstance().setRoomList(data);
            if (AppData.getInstance().lastServerId != 0) {
                this.getLastServerInfo();
            } else {
                this.getGameScene();
            }
        }
        //进入游戏界面
        private getGameScene() {
            if (AppData.getInstance().currentGame) {
                switch (AppData.getInstance().currentGame.id) {
                    case 620://德州扑克
                        this.moduleManager.initModule(DZPKRoomHallSceneModule, DZPKRoomHallSceneView, DZPKRoomHallSceneData);
                        break;
                    case 203://斗地主
                        this.moduleManager.initModule(LDHallSceneModule, LDHallSceneView, LDHallSceneData);
                        break;
                    case 720://二八杠
                        this.moduleManager.initModule(TEBHallSceneModule, TEBHallSceneView, TEBHallSceneData);
                        break;
                }
                this.hallSocket.close();
                this.communicate(LoaddingGlobalModule.response.hideLoad);//加载页
            } else {
                how.Alert.show(LanguageConfig.hall_error_8);
            }
        }
        //获取最后登录服务器的ip和端口号,并连接该服务器
        private getLastServerInfo(): void {
            for (var i = 0; i < AppData.getInstance().roomList.length; i++) {
                var room: RoomData = AppData.getInstance().roomList[i];
                if (AppData.getInstance().lastServerId == room.id) {
                    AppData.getInstance().currentRoom = room;
                    break;
                }
            }
            if (AppData.getInstance().currentGame) {
                switch (AppData.getInstance().currentGame.id) {
                    case 205://诈金花
                        // this.moduleManager.initGlobalModule(base.GameSceneGlobalModule, ZjhGameData);//游戏数据模块
                        break;
                    case 620://德州扑克
                        this.moduleManager.initGlobalModule(base.GameSceneGlobalModule, NewGameSceneData);//游戏数据模块
                        break;
                    case 203://斗地主
                        this.moduleManager.initGlobalModule(base.GameSceneGlobalModule, LDGameSceneData);//游戏数据模块
                        break;
                    case 720://二八杠
                        this.moduleManager.initGlobalModule(base.GameSceneGlobalModule, TEBGameSceneData);//游戏数据模块
                        break;
                }
                this.communicate(base.ChangeServerGlobalModule.response.changeServer, AppData.getInstance().currentRoom, false, (flag) => {
                    AppData.getInstance().lastServerId = 0;
                    this.enterGameCompLete(flag);
                });
            }
        }

        //进入游戏服务器完成
        private enterGameCompLete(flag: boolean): void {
            this.communicate(LoaddingGlobalModule.response.hideLoad);
            switch (AppData.getInstance().currentGame.id) {
                case 620://德州扑克
                    //椅子ID为空，返回游戏大厅
                    if (AppData.getInstance().userData.chairID == 65535) {
                        this.gameSocket.send(CMDConfig.SEND_LEAVE_GAME, {});
                        this.gameSocket.send(CMDConfig.SEND_LEAVE_ROOM, {});
                        if (egret.is(how.Application.currentScene, "NewGameSceneView")) {//如果当前场景为游戏场景
                            this.communicate(BaseGameSceneModule.response.updataBackStatus, BackStatusConfig.back);
                        }
                        return;
                    }
                    if (!egret.is(how.Application.currentScene, "NewGameSceneView")) {
                        this.moduleManager.initModule(NewGameSceneModule, NewGameSceneView);
                    } else {
                        this.communicate(NewGameSceneModule.response.initPlayers);//初始化玩家列表
                        this.communicate(NewGameSceneModule.response.initGameView);//初始话游戏场
                        this.communicate(NewGameSceneModule.response.hidePiPeiUI);//隐藏匹配UI
                    }
                    break;
                case 203://斗地主
                    //椅子ID为空，返回游戏大厅
                    if (AppData.getInstance().userData.chairID == 65535) {
                        this.gameSocket.send(CMDConfig.SEND_LEAVE_GAME, {});
                        this.gameSocket.send(CMDConfig.SEND_LEAVE_ROOM, {});
                        if (egret.is(how.Application.currentScene, "LDGameSceneView")) {//如果当前场景为游戏场景
                            this.communicate(BaseGameSceneModule.response.updataBackStatus, BackStatusConfig.back);
                        }
                        return;
                    }
                    if (!egret.is(how.Application.currentScene, "LDGameSceneView")) {
                        this.moduleManager.initModule(LDGameSceneModule, LDGameSceneView, LDGameSceneData);
                    } else {
                        this.communicate(LDGameSceneModule.response.initPlayers);//初始化玩家列表
                        how.SoundManager.stopMusic();
                        how.SoundManager.playMusic("dzpk_bg_mp3");
                    }
                    break;
                case 720://二八杠
                    //椅子ID为空，返回游戏大厅
                    if (AppData.getInstance().userData.chairID == 65535) {
                        this.gameSocket.send(CMDConfig.SEND_LEAVE_GAME, {});
                        this.gameSocket.send(CMDConfig.SEND_LEAVE_ROOM, {});
                        if (egret.is(how.Application.currentScene, "TEBGameSceneView")) {//如果当前场景为游戏场景
                            this.communicate(BaseGameSceneModule.response.updataBackStatus, BackStatusConfig.back);
                        }
                        return;
                    }
                    if (!egret.is(how.Application.currentScene, "TEBGameSceneView")) {
                        this.moduleManager.initModule(TEBGameSceneModule, TEBGameSceneView, TEBGameSceneData);
                    } else {
                        this.communicate(TEBGameSceneModule.response.initPlayers);//初始化玩家列表
                        how.SoundManager.stopMusic();
                        how.SoundManager.playMusic("dzpk_bg_mp3");
                    }
                    break;
            }
            this.hallSocket.close();
            this.communicate(LoaddingGlobalModule.response.hideLoad);//加载页
        }
        //当玩家状态改变
        private onStatusChange(data: any): void {
            //当玩家离开
            if (data.dwUserID == AppData.getInstance().userData.id && data.cbUserStatus == UserStatus.NULL) {
                switch (AppData.getInstance().currentGame.id) {
                    case 620://德州扑克
                        if (!egret.is(how.Application.currentScene, "NewGameSceneView")) {//德州
                            this.communicate(base.ChangeServerGlobalModule.response.changeServer, null, true, () => {
                                this.moduleManager.initModule(DZPKRoomHallSceneModule, DZPKRoomHallSceneView, DZPKRoomHallSceneData);
                            });
                        }
                        break;
                    case 203://斗地主
                        if (!egret.is(how.Application.currentScene, "LDGameSceneView")) {//斗地主
                            this.communicate(base.ChangeServerGlobalModule.response.changeServer, null, true, () => {
                                this.moduleManager.initModule(LDHallSceneModule, LDHallSceneView, LDHallSceneData);
                            });
                        }
                        break;
                    case 720://二八杠
                        if (!egret.is(how.Application.currentScene, "TEBGameSceneView")) {
                            this.communicate(base.ChangeServerGlobalModule.response.changeServer, null, true, () => {
                                this.moduleManager.initModule(TEBHallSceneModule, LDHallSceneView, LDHallSceneData);
                            });
                        }
                        break;
                }
            }
        }
        //退出游戏，返回游戏大厅
        private quitGameSuccess(data: any) {
            //链接大厅服务器
            if (data.code == 0) {
                AppData.getInstance().token = data.token;
                AppData.getInstance().currentGameIndex = 0;
                this.hallSocket.connect(GameConfig.hallSocketHost, GameConfig.hallSocketPort);
            } else {
                how.Alert.show(LanguageConfig["hall_error_"] + data.code);
            }
        }
    }
}
