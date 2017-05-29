/**
 * 操作面板模块
 * @author none
 */
class OperatePanelModule extends how.module.Module {
    public _preClick: how.CheckBox = null;//当前选中的单选按钮
    public _jiazhuPanelVisible: Boolean = false;
    public set jiazhuPanelVisible(v: Boolean) {
        this._jiazhuPanelVisible = v;
        this.gui["jiazhuButton"]["bg"].source = v ? "button1_png" : "button0_png";
    };
    public get jiazhuPanelVisible(): Boolean {
        return this._jiazhuPanelVisible;
    };
    public gameEndShowCardFlag: Boolean = false;
    public isNotOperateCount: number = 0;//玩家整局都未操作过的局数
    public isHosting: boolean = false;
    public tipDialog: how.Dialog;//操作风险提示提示
    public isSend: boolean = false;
    public genZhuValue: number;//本轮最大跟注玩家跟注数量
    public myGenZhuValue: number;//本轮自己跟注数量
    public static response: any = {
        onOpenOperatePanel: "onOpenOperatePanel",
        onCloseOperatePanel: "onCloseOperatePanel",
        setPreOperateUI: "setPreOperateUI",
        setOperateUIOperatePanel: "setOperateUIOperatePanel",
        showButtonBar: "showButtonBar",
        showShowCardsButton: "showShowCardsButton",
        showGameEndShowCard: "showGameEndShowCard",
        onGameEndCheckShowCards: "onGameEndCheckShowCards",
        hideQuickOperatePanel: "hideQuickOperatePanel",
        onGameStart: CMDConfig.GET_GAMESTART,
        onGameEnd: CMDConfig.GET_GAMEEND,
        autoLead: "autoLead",//倒计时结束自动出牌
        onQipaiButton: "onQipaiButton",
        updateGenzhuLabel: "updateGenzhuLabel"
    }
    public static request: any = {
        onQipaiButton: "onQipaiButton",
        onGenzhuButton: "onGenzhuButton",
        onJiazhuButton: "onJiazhuButton",
        onCheckBoxButton: "onCheckBoxButton",
        ondaMang3: "ondaMang3",
        ondaMang5: "ondaMang5",
        ondaMang10: "ondaMang10",
        onallInBtn: "onallInBtn",
        onShowCards: "onShowCards",
        onGameEndShowCard: "onGameEndShowCard",
        hideBackMenuGroup: "hideBackMenuGroup"
    }
    //计算本轮跟注数量
    public statisticsGenzhuValye(): void {
        this.genZhuValue = 0;
        this.myGenZhuValue = 0;
        var playerList: Array<any> = NewGameSceneData.getInstance().getPlayersByTableIDHaveChairID();//获取相同桌子的玩家
        for (var i = 0; i < playerList.length; i++) {
            var playData: base.PlayerData = playerList[i];
            if (playData.id == AppData.getInstance().userData.id) {
                this.myGenZhuValue = playData.lAddScoreCount;
            } else {
                this.genZhuValue = playData.lAddScoreCount > this.genZhuValue ? playData.lAddScoreCount : this.genZhuValue;
            }
        }
    }
    /*
    *更新自动跟注按钮状态
     */
    public updateGenzhuLabel(): void {
        var text = this.gui["zidongrangpaiButton"].labelDisplay.text;
        this.statisticsGenzhuValye();
        var gameData = NewGameSceneData.getInstance();
        var playData: base.PlayerData = how.Utils.getItem(NewGameSceneData.getInstance().playerList, "id", AppData.getInstance().userData.id);
        if (playData) {
            if (this.genZhuValue > this.myGenZhuValue) {//如果超过自己跟注额度
                if ((this.genZhuValue - this.myGenZhuValue) < playData.lTakeMoney) {//如果没有超过自己的最大下注金额
                    this.gui["zidongrangpaiButton"].labelDisplay.text = how.StringUtils.format(LanguageConfig.callNum,
                        base.Utils.formatCurrency(this.genZhuValue - this.myGenZhuValue));
                    this.gui["zidongrangpaiButton"].icon.visible = false;
                    this.gui["zidongrangpaiButton"].icon2.visible = true;
                    this.gui["zidongrangpaiButton"]["bitLabel"]["visible"] = true;
                    this.gui["zidongrangpaiButton"]["bitLabel"].text = base.Utils.formatCurrency(this.genZhuValue - this.myGenZhuValue);
                } else {
                    this.gui["zidongrangpaiButton"].labelDisplay.text = LanguageConfig.genzhuButtonText2;
                    this.gui["zidongrangpaiButton"]["icon"]["source"] = "allInFont_png";
                    this.gui["zidongrangpaiButton"].icon.visible = true;
                    this.gui["zidongrangpaiButton"].icon2.visible = false;
                    this.gui["zidongrangpaiButton"]["bitLabel"]["visible"] = false;
                }
            } else if (this.genZhuValue <= this.myGenZhuValue) {//如果小于自己下金额
                this.gui["zidongrangpaiButton"].labelDisplay.text = LanguageConfig.autoGenzhuLabel;
                this.gui["zidongrangpaiButton"].icon.source = "zidongrangpaiFont_png";
                this.gui["zidongrangpaiButton"].icon.visible = true;
                this.gui["zidongrangpaiButton"].icon2.visible = false;
                this.gui["zidongrangpaiButton"]["bitLabel"]["visible"] = false;
            }
            if (this._preClick && this._preClick.name == "zidongrangpaiButton" && text != this.gui["zidongrangpaiButton"].labelDisplay.text) {
                this._preClick.selected = false;
                this._preClick = null;
            }
            if (playData.operateAction == LanguageConfig.allin) {
                this.gui["autoOperateGroup"].visible = false;
            }
        }
    }
    /**
     * 当游戏开始
     */
    public onGameStart(data: any): void {
        this.callUI("hideOrShowQipaiButton", true);
    }
    /**
     * 当游戏结束
     */
    public onGameEnd(data: any): void {
        this.callUI("hideOrShowQipaiButton", false);
    }
    /*
     * 打开操作面板
     * */
    public onOpenOperatePanel(): void {
        this.gui.visible = true;
        this.gameEndShowCardFlag = false;
        this.jiazhuPanelVisible = false;
        this.callUI("gameStartHideButton");
        this.callUI("setPreOperateUI");
        if (this._preClick != null) {
            this._preClick.selected = false;
            this._preClick = null;
        }
    }
    /*
     * 隐藏操作面板
     * */
    public onCloseOperatePanel(): void {
        this.gui.visible = false;
        this.jiazhuPanelVisible = false;
    }
    /*
     * 设置可以操作UI
     * */
    public setOperateUIOperatePanel(): void {
        NewGameSceneData.getInstance().isOperateFlag = true;
        this.gui.visible = true;
        this.isSend = true;
        if (this.canOperate(NewGameSceneData.getInstance())) {
            this.callUI("setOperateUI", NewGameSceneData.getInstance());
        }
    }
    /*
    * 按下弃牌按钮
    * */
    public onQipaiButton(): void {
        if (NewGameSceneData.getInstance().myLAddScoreCount > 0) {
            this.tipDialog = how.Dialog.show(LanguageConfig.qipaiTip, () => {
                if (this.isSend) {
                    this.isSend = false;
                    this.jiazhuPanelVisible = false;
                    this.qipai();
                }
            }, () => {
                this.tipDialog = null;
            }, this);
        } else {
            if (this.isSend) {
                this.isSend = false;
                this.jiazhuPanelVisible = false;
                this.qipai();
            }
        }
    }
    /*
     * 按下跟注按钮
     * */
    public onGenzhuButton(): void {
        this.jiazhuPanelVisible = false;
        this.genzhu();
    }
    /*
     * 按下加注按钮
     * */
    public onJiazhuButton(): void {
        if (this.jiazhuPanelVisible) {
            NewGameSceneData.getInstance().isOperate = true;
            var lessScore: number = this.gui["quickOperatePanel"].score;
            lessScore = lessScore > NewGameSceneData.getInstance().lTurnMaxScore ? NewGameSceneData.getInstance().lTurnMaxScore : lessScore;
            this.jiazhu(lessScore);
        } else {
            this.callUI("shwoQuickOperatePanel");
            this.jiazhuPanelVisible = true;
        }
    }
    /*
     * 隐藏加注面板
     * */
    public hideQuickOperatePanel(): void {
        this.callUI("hideQuickOperatePanel");
        this.jiazhuPanelVisible = false;
    }
    public ondaMang3(lessScore: number): void {
        NewGameSceneData.getInstance().isOperate = true;
        this.jiazhuPanelVisible = false;
        this.jiazhu(lessScore);
    }
    public ondaMang5(lessScore: number): void {
        NewGameSceneData.getInstance().isOperate = true;
        this.jiazhuPanelVisible = false;
        this.jiazhu(lessScore);
    }
    public ondaMang10(lessScore: number): void {
        NewGameSceneData.getInstance().isOperate = true;
        this.jiazhuPanelVisible = false;
        this.jiazhu(lessScore);
    }
    /*
     * 按下AllIN按钮
     * */
    public onallInBtn(): void {
        NewGameSceneData.getInstance().isOperate = true;
        this.jiazhuPanelVisible = false;
        var lessScore: number = NewGameSceneData.getInstance().lTurnMaxScore ? NewGameSceneData.getInstance().lTurnMaxScore : 0;
        this.jiazhu(lessScore);
    }
    /*
     * 按下亮牌
     * */
    public onShowCards(): void {
        this.gameSocket.send(CMDConfig.SEND_SHOWCARDS, {});
        this.onCloseOperatePanel();
    }
    /*
     * 显示亮牌按钮
     * */
    public showShowCardsButton(): void {
        this.callUI("showShowCardsButton");
    }
    /*
     * 按下结束时亮牌按钮
     * */
    public onGameEndShowCard(): void {
        this.gameEndShowCardFlag = !this.gameEndShowCardFlag;
    }
    /*
     * 显示结束时亮牌按钮
     * */
    public showGameEndShowCard(): void {
        this.callUI("showGameEndShowCard");
        this.callUI("hideOrShowQipaiButton", false);
    }
    /*
     * 游戏结束判断是否亮牌
     * */
    public onGameEndCheckShowCards(): void {
        if (this.gameEndShowCardFlag) {
            this.gameSocket.send(CMDConfig.SEND_SHOWCARDS, {});
        }
    }
    /**
    * 设置预操作UI
    * */
    public setPreOperateUI(): void {
        this.callUI("setPreOperateUI");
        this.callUI("hideOrShowQipaiButton", true);
    }
    /**
    * 是否可以操作
    */
    public canOperate(data: NewGameSceneData): boolean {
        var canOperate: boolean = true;
        if (this._preClick) {
            switch (this._preClick.name) {
                case "ranghuoqiButton":
                    if (data.lTurnLessScore == 0) {//如果最小加注是0则说明可以让牌
                        this.genzhu();//发送让牌
                        canOperate = false;
                    }
                    else {
                        this.qipai();//发送弃牌
                        canOperate = false;
                    }
                    break;
                case "zidongrangpaiButton":
                    this.statisticsGenzhuValye();
                    var gameData = NewGameSceneData.getInstance();
                    var playerList: Array<any> = gameData.getPlayersByTableIDHaveChairID();//获取相同桌子的玩家
                    if (this.genZhuValue > this.myGenZhuValue) {//如果超过自己跟注额度
                        if (gameData.lTurnLessScore == gameData.lTurnMaxScore) {
                            this.setPreOperateUI();
                            this.isSend = false;
                            gameData.isOperate = true;
                            this.gameSocket.send(CMDConfig.SEND_CALL_CHIP, { lScore: gameData.lTurnLessScore });
                            //停止自己出牌倒计时
                            this.communicate(NewPlayerModule.response.startorStopClock, AppData.getInstance().userData.chairID, false);
                            NewGameSceneData.getInstance().myLAddScoreCount += gameData.lTurnLessScore;
                            this.callUI("hideOrShowQipaiButton", false);
                            canOperate = false;
                        } else {
                            this.jiazhu(gameData.lTurnLessScore);
                            canOperate = false;
                        }
                    } else if (this.genZhuValue <= this.myGenZhuValue) {//如果小于自己下金额
                        this.genzhu();//发送让牌
                        canOperate = false;
                    }
                    break;
                case "genrenhezhuButton"://跟任何注
                    this.genzhu();//发送跟注
                    canOperate = false;
                    break;
            }
            this._preClick.selected = false;
            this._preClick = null;
        }
        return canOperate;
    }
    //发送加注
    public jiazhu(addScore): void {
        if (this.isSend) {
            if (NewGameSceneData.getInstance().lTurnMaxScore == addScore) {
                this.tipDialog = how.Dialog.show(LanguageConfig.allinTip, () => {
                    if (this.isSend) {
                        this.jiazhuPanelVisible = false;
                        this.setPreOperateUI();
                        this.isSend = false;
                        NewGameSceneData.getInstance().isOperate = true;
                        this.gameSocket.send(CMDConfig.SEND_CALL_CHIP, { lScore: addScore });
                        //停止自己出牌倒计时
                        this.communicate(NewPlayerModule.response.startorStopClock, AppData.getInstance().userData.chairID, false);
                        NewGameSceneData.getInstance().myLAddScoreCount += addScore;
                        this.callUI("hideOrShowQipaiButton", false);
                    }
                }, () => {
                    this.tipDialog = null;
                }, this);
            } else {
                this.jiazhuPanelVisible = false;
                this.isSend = false;
                this.setPreOperateUI();
                NewGameSceneData.getInstance().isOperate = true;
                this.gameSocket.send(CMDConfig.SEND_CALL_CHIP, { lScore: addScore });
                //停止自己出牌倒计时
                this.communicate(NewPlayerModule.response.startorStopClock, AppData.getInstance().userData.chairID, false);
                NewGameSceneData.getInstance().myLAddScoreCount += addScore;
            }
        }
    }
    /**
     * 发送跟注
     * */
    public genzhu(): void {
        if (this.isSend) {
            this.isSend = false;
            this.setPreOperateUI();
            //停止自己出牌倒计时
            this.communicate(NewPlayerModule.response.startorStopClock, AppData.getInstance().userData.chairID, false);
            NewGameSceneData.getInstance().isOperate = true;
            var lessScore: number = NewGameSceneData.getInstance().lTurnLessScore ? NewGameSceneData.getInstance().lTurnLessScore : 0;
            this.gameSocket.send(CMDConfig.SEND_CALL_CHIP, { lScore: lessScore });
            NewGameSceneData.getInstance().myLAddScoreCount += lessScore;
        }
    }
    /**
    * 发送弃牌
    * */
    public qipai(): void {
        this.isSend = false;
        this.showGameEndShowCard();
        //停止自己出牌倒计时
        this.communicate(NewPlayerModule.response.startorStopClock, AppData.getInstance().userData.chairID, false);
        NewGameSceneData.getInstance().isOperate = true;
        this.gameSocket.send(CMDConfig.SEND_QIPAi);
        this.callUI("hideOrShowQipaiButton", false);
    }
    /*
    * 按下复选框按钮
    * */
    public onCheckBoxButton(event: egret.TouchEvent): void {
        var ta: how.CheckBox = event.currentTarget;
        if (this._preClick && this._preClick == ta) {
            ta.selected = false;
            this._preClick = null;
        }
        else {
            if (this._preClick) {
                this._preClick.selected = false;
            }
            this._preClick = ta;
        }
    }
    /*
     * 显示按钮条（自动坐下按钮）
     * */
    public showButtonBar(): void {
        this.callUI("showButtonBar");
    }
    //倒计时结束自动操作
    public autoLead(): void {
        if (this.tipDialog && this.tipDialog.parent) {
            how.Application.closeWindow(this.tipDialog);
            this.tipDialog = null;
        }
        var gameSceneData: NewGameSceneData = NewGameSceneData.getInstance();
        if (gameSceneData.lTurnLessScore == 0) {//如果最小加注是0则说明可以让牌
            if (this.isSend) {
                this.isSend = false;
                this.setPreOperateUI();
                //停止自己出牌倒计时
                this.communicate(NewPlayerModule.response.startorStopClock, AppData.getInstance().userData.chairID, false);
                var lessScore: number = NewGameSceneData.getInstance().lTurnLessScore ? NewGameSceneData.getInstance().lTurnLessScore : 0;
                this.gameSocket.send(CMDConfig.SEND_CALL_CHIP, { lScore: lessScore });
                NewGameSceneData.getInstance().myLAddScoreCount += lessScore;
            }
        } else {
            this.isSend = false;
            this.showGameEndShowCard();
            //停止自己出牌倒计时
            this.communicate(NewPlayerModule.response.startorStopClock, AppData.getInstance().userData.chairID, false);
            this.gameSocket.send(CMDConfig.SEND_QIPAi);
            this.callUI("hideOrShowQipaiButton", false);
        }
        this.jiazhuPanelVisible = false;
    }
    //隐藏菜单面板
    public hideBackMenuGroup(): void {
        this.communicate(NewGameSceneModule.response.hideBackMenuGroup);
    }
}
