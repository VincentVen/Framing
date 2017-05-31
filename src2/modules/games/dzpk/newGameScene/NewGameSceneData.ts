/**
 * 新游戏场景
 * @author none
 *
 */
class NewGameSceneData extends base.GameSceneGlobalData {
    private static _instance: NewGameSceneData;
    public static getInstance(): NewGameSceneData {
        if (!this._instance) {
            this._instance = new NewGameSceneData();
        }
        return this._instance;
    }
    public get playerDataType(): any {
        return NewPlayerData;
    }
    public dichiValue: number = 0;//底池
    public lTurnMaxScore: number = 0;//当前最大下注（游戏开始时需清理）
    public lTurnLessScore: number = 0;//当前最小下注（游戏开始时需清理）
    public wDUser: number;//小盲注玩家
    public smallBlindUser: number;//小盲注
    public bigBlindUser: number;//大盲注
    public lCellScore: number;//小盲注玩家下的注
    public wMaxChipInUser: number;//大盲注玩家
    public lTakeMoney: any[] = [];//所有玩家携带的金币
    public cbCardData: any[] = [];//所有玩家的扑克牌
    public lAddLessScore: number = 0;//最小加注数量
    public publicCards: Array<number> = [];//公共牌数据列表
    public chipPool: Array<number> = [];//主边池信息
    public chipUser: Array<number[]> = [];//主边池对用户的座位号
    public isHadTipsChangeRoom: boolean = false;//用来记录当前场次是否提示过换房
    public fivePlayersChairIndex: number[] = [0, 2, 4, 5, 7];//五人场桌子索引
    public myLAddScoreCount: number = 0;//当前总下注数
    public gameId: string = null;
    public takeScore: number;//目标携带游戏币数
    public isautoTakeScore: boolean;//是否自动带入目标携带游戏币数
    public cardsIndexs: number[];//当前玩家手牌最大牌型的下标数组
    public centerCardIndexs: number[];//当前公共牌最大牌型的下标数组
    public isOperate: boolean = false;//玩家该局是否操作过
    public isOperateFlag: boolean = false;//是否轮到过自己操作
    public isAutoResumeGame: boolean = true;//是否自动继续游戏
    public chatWindowTabIndex = 0;//聊天窗口选中的页签
    //清理玩家列表并且添加自己信息到玩家列表
    public clearPlayerListRemainMy(): void {
        var playerData: NewPlayerData = how.Utils.getItem(NewGameSceneData.getInstance().playerList, "id", AppData.getInstance().userData.id);
        playerData.operateAction = AppData.getInstance().userData.nickName;
        playerData.bAddGiveUp = 0;
        playerData.cardType = 0;
        playerData.lAddScoreCount = 0;
        NewGameSceneData.getInstance().playerList = [playerData];//清空玩家列表
    }
    /*
     * 游戏开始时更新Data
     */
    public gameStartData(data: any): void {
        this.lTurnLessScore = data.lTurnLessScore;//保存当前最小下注
        this.lTurnMaxScore = data.lTurnMaxScore;//保存当前最大下注
        this.lTakeMoney = data.lTakeMoney;//所有玩家携带的金币
        this.cbCardData = data.cbCardData;//所有玩家的扑克牌
        this.wDUser = data.wDUser;//庄家
        this.smallBlindUser = this.getNextChairID(data.wMaxChipInUser);//小盲注玩家
        this.wMaxChipInUser = data.wMaxChipInUser; //大盲注玩家
        this.lCellScore = data.lCellScore;//小盲注下的注
        this.chipPool = [];
        this.dichiValue = data.lCellScore * 3 + this.getAllPreScore(data.lTakeMoney, data.PreScore);//底池
        this.gameId = data.dwGameStartTime;
    }
    //获取所有玩家的游戏前注总和
    private getAllPreScore(arrTake: number[], onePreScore: number): number {
        var i: number = 0;
        var len: number = arrTake.length;
        var count: number = 0;
        for (i = 0; i < len; i++) {
            if (arrTake[i] > 0) {
                count++;
            }
        }
        return count * onePreScore;
    }
    /*
    *收到游戏开始时间
    */
    public onGetGameStartTime(data): void {
        this.gameId = data.dwGameStartTime;
    }
    /*
     * 断线重连(同步牌桌信息)
     * */
    public onReConnectedData(data: any): void {
        this.lTakeMoney = data.lTakeMoney;//所有玩家携带的金币
        this.lAddLessScore = data.lAddLessScore;//最小加注数量
        this.lTurnLessScore = data.lTurnLessScore;//保存当前最小下注
        this.lTurnMaxScore = data.lTurnMaxScore;//保存当前最大下注
        if (data.wDUser != null) {
            this.lCellScore = data.lCellScore//小盲注下的注
            this.onGetCards(data);
            this.dichiValue = 0;
            //设置底池
            for (var i = 0; i < data.lTotalScore.length; i++) {
                this.dichiValue += data.lTotalScore[i];
            }
            this.wDUser = data.wDUser;
        }
    }
    /*
    * 收到操作结果更新Data
    */
    public validateOperateData(data: any): void {
        if (data) {
            this.lAddLessScore = data.lAddLessScore >= 0 ? data.lAddLessScore : this.lAddLessScore;//最小加注数量
            this.lTurnLessScore = data.lTurnLessScore >= 0 ? data.lTurnLessScore : this.lTurnLessScore;//保存当前最小下注
            this.lTurnMaxScore = data.lTurnMaxScore >= 0 ? data.lTurnMaxScore : this.lTurnMaxScore;//保存当前最大下注
            if (data.lAddScoreCount && data.lAddScoreCount >= 0) {
                this.dichiValue += data.lAddScoreCount;
            }
        }
    }
    /*
     * 收到发牌更新Data
     * */
    public onGetCards(data: any): void {
        var cardDataList: Array<number> = [];
        for (var i = 0; i < data.cbCenterCardData.length; i++) {
            if (data.cbCenterCardData[i] > 0) {
                cardDataList.push(data.cbCenterCardData[i])
            }
        }
        this.publicCards = cardDataList;
    }
    /*
     * 更新底池
     * */
    public updataDiChi(value: number): void {
        if (!isNaN(value)) {
            this.dichiValue -= value;
        }
    }
    /*
     * 收到主边池信息更新Data
     * */
    public updataChipPool(data: any): void {
        this.chipPool = data.pool;
    }
    /*
    * 收到主边所对应的完结座位号
    * */
    public updataChipPoolUser(data: any): void {
        this.chipUser = data.user;
    }
    /**
    * 转换座位号编号为椅子编号
    * */
    public getChairID(seatID: number): number {
        var lastChairID = AppData.getInstance().userData.lastChairID == 65535 ? 0 : AppData.getInstance().userData.lastChairID;
        return (RoomData.MAX_PLAYER + (lastChairID + RoomData.MAX_PLAYER + seatID)) % RoomData.MAX_PLAYER;
    }
    /**
     * 转换椅子编号为座位编号
     * */
    public getSeatID(chairID: number): number {
        var seatID = 0;
        var newChairID = 0;
        if (AppData.getInstance().userData.chairID && AppData.getInstance().userData.chairID == 65535) {//如果自己不在桌子上
            if (AppData.getInstance().userData.lastChairID == 65535) {
                seatID = chairID;
                newChairID = chairID;
            } else {
                newChairID = (chairID + RoomData.MAX_PLAYER - AppData.getInstance().userData.lastChairID) % RoomData.MAX_PLAYER;
            }
            seatID = newChairID == 0 ? 9 : newChairID;
        } else {
            seatID = (chairID + RoomData.MAX_PLAYER - AppData.getInstance().userData.chairID) % RoomData.MAX_PLAYER;
        }
        if (RoomData.MAX_PLAYER == 5) {//如果是五人场
            return seatID == 9 ? seatID : this.fivePlayersChairIndex[seatID];
        }
        return seatID;
    }
}