/**
* 玩家数据
* @author none
*
*/
class NewPlayerData extends base.PlayerData {
    /**
    * 用户经验
    */
    public exp: number;
    /**
    * 下一级经验
    */
    public nextExp: number;
    /**
    * 用户等级
    */
    public level: number;
    /**
    * 用户昵称
    */
    public nickName: string;
    /**
    * 用户昵称2
    */
    public nickName2: string;
    /**
    * 性别，1为男，0为女
    */
    public gender: number;
    /**
    * 会员等级
    */
    public vipLevel: number;
    /**
     * 游戏币 
     */
    public money: number;
    /**
     * 钻石   
     */
    public gold: number;
    /**
     * 奖券
     */
    public ticket: number;
    /**
     * 头像
     */
    public avatar: number;
    /**
     * 编号
     */
    public id: number;
    /**
     * 所在桌子编号
     */
    public tableID: number = null;
    /**
     * 所在椅子编号
     */
    public chairID: number = null;
    /**
    * 自己最后一次在桌子上的椅子编号
    */
    public lastChairID: number = 65535;
    /**
    *换桌前的桌子号 
    */
    public changeTableLastTableID: number = 65535;
    /**
     * 游戏内携带金钱
     */
    public lTakeMoney: number = 0;
    /*
     * 玩家的扑克牌
     * */
    public cardData: number[] = [];
    /**
     * 当前状态
     */
    public status: number;
    /*
     * 操作状态
     * */
    public bAddGiveUp = 0;
    /*
     * 下注数量
     * */
    public lAddScoreCount: number;
    /*
     * 玩家操作状态
     * */
    public operateAction: string;
    /*
     * 玩家牌型
     * */
    public cardType: number;
    /*
     * 玩家最终牌型的牌
     * */
    public cardTypeData: number[];
    /*
     * 玩家最终牌型排名
     */
    public userRank: number;
    /*
     * 玩家赢筹码中的抽水
     * */
    public lGameTax: number;
    /*
     * 玩家最终牌型的排名
     * */
    /*
     * 玩家这局输赢的金币数
     * */
    public lGameScore: number;
    //最总赢筹码数量
    public getScoreCount: number = 0;
    /*
     * 本局下的总游戏币数
     * */
    public lTotalScore: number = 0;
    /*
     * 玩家最后牌型的牌
     * */
    public cbLastCenterCardData: number[] = [];
    /* 牌局中玩家基础数据
     * {"lScore":84273, //游戏币
     * "lGameGold":84273,  //筹码
     * "lInterScore":0,     //钻石
     * "lInsureScore":0,
     * "lMatchScore":0,
     * "dwCoupon":0,
     * "lWinCount":10, //胜场
     * "lLostCount":3, //败场
     * "lDrawCount":0, //平局
     * "lFleeCount":18, //逃跑局
     * "lExperience":198}*/ //玩家等级 base.Utils.getLevel(lExperience)
    public UserScoreInfo: any;
    //国籍
    public userfrom: string = null;
    /**
     * 座位编号，相对于用户自己0号位置
     */
    public get seatID(): number {
        return NewGameSceneData.getInstance().getSeatID(this.chairID);
    }
    /**
    * 根据数据源设置数据
    */
    public setData(source: any) {
        var dwUserID = source.dwUserID.toString();
        var accounts = source.accounts;
        // accounts = accounts.substring(accounts.indexOf("_") + 1, accounts.length);
        // this.nickName = dwUserID;
        if (source.dwUserID == AppData.getInstance().userData.id) {
            this.nickName = accounts;
        } else {
            this.nickName = "****" + accounts.substring(accounts.length - 3, accounts.length);
        }
        this.nickName2 = source.nickname;
        this.gender = source.cbGender ? source.cbGender : 0;
        this.vipLevel = source.cbMember || source.dwVIP;
        this.lTakeMoney = this.money = source.UserScoreInfo.lGameGold;
        this.gold = source.dwGold;
        this.ticket = source.dwScore;
        this.avatar = (source.wFaceID % 8);
        this.id = source.dwUserID;
        this.tableID = source.wTableID;
        this.chairID = source.wChairID;
        this.status = source.cbUserStatus;
        this.UserScoreInfo = source.UserScoreInfo;
    }
    /*
     * 收到用户携带的钱
     * */
    public getPlayerlTakeMoney(data: any) {
        if (this.chairID != null && this.chairID != 65535 && this.chairID == data.wChairID) {
            this.lTakeMoney = data.lTakeMoney;
        }
    }
    /**
     * 经验值转换
     */
    public changeExp(nowExp: number): void {

    }
    /**
     * 游戏开始更新data
     * */
    public setStartData(data: any) {
        if (this.chairID != null && this.chairID != 65535) {
            this.lTakeMoney = data.lTakeMoney[this.chairID];
            this.lTakeMoney -= data.PreScore;
            if (this.lTakeMoney < 0) {
                this.lTakeMoney = 0;
            }
            this.updataUserDataLTakeMoney(this.lTakeMoney);
            this.cardData = data.cbCardData[this.chairID];
            this.cardType = 0;
            this.lAddScoreCount = data.PreScore;
            this.operateAction = this.nickName;
            this.lTotalScore = 0;
            this.lTotalScore += data.PreScore;
        }
    }
    /*
     * 断线重连更新Data
     * */
    public onReConnectedData(data: any) {
        if (this.chairID != null && this.chairID != 65535) {
            this.lTakeMoney = NewGameSceneData.getInstance().gameStatus == 100 ? data.UseInfo[this.chairID][6] : data.lTakeMoney[this.chairID];
            this.updataUserDataLTakeMoney(this.lTakeMoney);
            if (data.lTotalScore) {
                this.lAddScoreCount = data.lTableScore[this.chairID];
                this.lTotalScore = data.lTotalScore[this.chairID];
                this.lTakeMoney -= data.lTotalScore[this.chairID];
            }
        }
    }
    /**
     * 操作结束更新data
     * */
    public setOperateOverData(data: any) {
        if (data.lAddScoreCount >= 0) {
            this.lTakeMoney = this.lTakeMoney - data.lAddScoreCount;
        }
        this.updataUserDataLTakeMoney(this.lTakeMoney);
        this.bAddGiveUp = data.bAddGiveUp;
        if (data.lAddScoreCount >= 0) {
            this.lAddScoreCount += data.lAddScoreCount;
            this.lTotalScore += data.lAddScoreCount;
        }
        this.operateAction = data.operateAction;
    }
    /*
     * 收到发牌更新Data
     * */
    public onGetCardsData(data: any) {
        this.lAddScoreCount = 0;
        if (this.chairID != null && this.chairID != 65535) {
            this.cardType = data.cbLastCardKind[this.chairID];
        }
    }
    /*
     * 设置当前牌型
     * */
    public setCardType(cardType: number) {
        this.cardType = cardType;
    }
    /**
    * 游戏结束更新data
    * */
    public setGameEndData(data: any) {
        this.cbLastCenterCardData = [];
        if (this.chairID != null && this.chairID != 65535) {
            if (this.operateAction != LanguageConfig.giveup) {
                this.lTakeMoney = data.lTakeMoney[this.chairID];
            }
            this.updataUserDataLTakeMoney(this.lTakeMoney);
            this.lGameScore = this.lTotalScore += data.lGameScore[this.chairID];
            this.getScoreCount = data.lGameScore[this.chairID];
            this.lGameTax = data.lGameTax[this.chairID];//抽水筹码
            this.cardData = data.cbCardData[this.chairID][0] != 0 ? data.cbCardData[this.chairID] : this.cardData;
            this.cardTypeData = data.cbLastCenterCardData[this.chairID];
            this.cardType = this.cardTypeData.indexOf(0) == -1 ? data.cbLastCardKind[this.chairID] : 0;
            this.userRank = data.UserRank[this.chairID];
            var cardDataList: number[] = data.cbLastCenterCardData[this.chairID];
            for (var i = 0; i < cardDataList.length; i++) {
                if (cardDataList[i] > 0) {
                    this.cbLastCenterCardData.push(cardDataList[i]);
                }
            }
        }
    }
    /*
     * 收到亮牌消息
     * */
    public onShowCatdsData(data: any) {
        this.cardData = data.card;
    }
    //更新appData自己携带的筹码
    public updataUserDataLTakeMoney(lTakeMoney: number) {
        if (this.id == base.AppData.getInstance().userData.id) {
            base.AppData.getInstance().userData.lTakeMoney = lTakeMoney;
        }
    }
    //设置玩家国籍
    public setUserfrom(data: any): void {
        for (var i = 0; i < data.length; i++) {
            if (data[i].userID == this.id) {
                this.userfrom = data[i].ipArea;
            }
        }
    }
}
