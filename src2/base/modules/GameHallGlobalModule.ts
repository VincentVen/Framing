module base {
	/**
	 * 游戏大厅服务器全局模块
	 *
	 */
    export class GameHallGlobalModule extends how.module.GlobalModule {
        public static response: any = {
            getLogin: "getLogin",//自动登陆
            onSocketOpen: egret.Event.CONNECT,//网络连接成功
            onGetGameInfo: CMDConfig.GET_GAME_CONFIG,//登陆返回
            onGameList: CMDConfig.GET_GAME_LIST,//获取游戏列表
        };
        public timeOut: number = null;
        /*------------------------------------------------------------------------------- */
        //登陆超时
        public loginTimeOut(): void {
            if (!AppData.getInstance().isGameHide && typeof (how.Application.currentScene) == "undefined") {
                how.Alert.show(LanguageConfig.noNetworkTip, () => {
                    if (top.location != location) {
                        location.href = base.Utils.getQueryString(location.search, "returnUrl");
                    } else {
                        location.reload();//刷新当前页面
                    }
                }, this, null, LanguageConfig.chognshiLabel);
            }
        }
        //获取登录信息
        public getLogin(): void {
            if (typeof (how.Application.currentScene) != "undefined") {
                this.communicate(LoaddingGlobalModule.response.hideLoad);
                this.communicate(LoaddingGlobalModule.response.showLoad, this.loginTimeOut);
            } else {
                this.timeOut = egret.setTimeout(this.loginTimeOut, this, 10 * 1000);
            }
            AppData.getInstance().account = !!AppData.getInstance().account ? AppData.getInstance().account : base.Utils.getQueryString(location.search, "account");
            AppData.getInstance().token = !!AppData.getInstance().token ? AppData.getInstance().token : base.Utils.getQueryString(location.search, "token");
            if (!!AppData.getInstance().account && !!AppData.getInstance().token) {
                this.hallSocket.connect(GameConfig.hallSocketHost, GameConfig.hallSocketPort);
            } else {
                /***********************************************************************************************************************/
                // http://192.168.20.156:8080/api?account=帐号&money=钱
                // http://172.16.6.113:5726/index.html?account=10001_555555&token=5E6BF185CC5D43529A52D51493DF43B3&code=0&lang=zh-CN"
                var testAccount = base.Utils.getQueryString(location.search, "name") ? base.Utils.getQueryString(location.search, "name") : base.Utils.getIMEI();
                this.http.send(GameConfig.httpUrl, {
                    account: testAccount,
                    // account: base.Utils.getIMEI(),
                    money: base.Utils.getRandom(152, 456),
                }, egret.URLRequestMethod.POST, function (data: any) {
                    var url: string = data.d.url;
                    if (data.d.url) {
                        url = url.substr(url.indexOf("?"), url.length - url.indexOf("?"));
                        AppData.getInstance().account = url.substr(1).match(new RegExp("(^|&)account=([^&]*)(&|$)"))[2];
                        AppData.getInstance().token = url.substr(1).match(new RegExp("(^|&)token=([^&]*)(&|$)"))[2];
                        this.hallSocket.connect(GameConfig.hallSocketHost, GameConfig.hallSocketPort);
                    }
                }, function () { }, this);
                /***********************************************************************************************************************/
            }
        }
        //网络连接成功
        private onSocketOpen(data: any): void {
            //游戏服务器链接成功
            if (data.host == GameConfig.hallSocketHost && data.port == GameConfig.hallSocketPort) {
                var currentSocket = AppData.getInstance().currentSocket;
                //从加载页进入游戏大厅
                this.hallSocket.send(CMDConfig.SEND_GAME_CONFIG, {
                    account: AppData.getInstance().account,
                    token: AppData.getInstance().token
                });
                AppData.getInstance().currentSocket = 0;
            }
        }
        //
        private onGetGameInfo(data: any): void {
            if (data.code == 0) {
                //登录成功
                AppData.getInstance().dataInit();//初始化appData
                AppData.getInstance().userData.setHallData(data);//保存用户信息
                AppData.getInstance().setLanguage(data["lang"]);//设置语言
                AppData.getInstance().currentGameIndex = data["curGame"];//当前游戏
            } else {
                if (this.timeOut) {
                    egret.clearTimeout(this.timeOut);
                }
                this.communicate(LoaddingGlobalModule.response.hideLoad);//加载页
                if (data.code == 7) {
                    how.Alert.show(LanguageConfig["hall_error_" + data.code], () => {
                        if (top.location != location) {
                            location.href = base.Utils.getQueryString(location.search, "returnUrl");
                        } else {
                            location.reload();//刷新当前页面
                        }
                    }, location, null, LanguageConfig.chognshilian);
                } else {
                    how.Alert.show(LanguageConfig["hall_error_" + data.code]);
                }
            }
        }
        //收到游戏列表
        public onGameList(data: any): void {
            if (data.gameID.length == 0) {
                how.Alert.show(LanguageConfig.hall_error_16);
            } else {
                AppData.getInstance().setGameList(data);
                this.LoginComplete();
            }
        }
        //登陆完毕
        private LoginComplete(): void {
            //是否正在游戏中
            if (AppData.getInstance().currentGameIndex == 0) {
                if (this.gameSocket.connected) {
                    this.gameSocket.close();
                }
                if (this.timeOut) {
                    egret.clearTimeout(this.timeOut);
                }
                this.communicate(LoaddingGlobalModule.response.hideLoad);
                this.moduleManager.initModule(MainSceneModule, MainSceneView, MainSceneData);
            } else {
                //进入游戏
                this.hallSocket.send(CMDConfig.SEND_GAME_ENTER, {
                    gameID: AppData.getInstance().currentGameIndex,
                    account: AppData.getInstance().userData.channelID + "_" + AppData.getInstance().userData.accounts
                });
                this.communicate(LoaddingGlobalModule.response.showLoad);//加载页
            }
        }
    }
}
