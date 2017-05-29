/**
 * 大厅数据
 * @author none
 */
class LDGameSceneData extends base.GameSceneGlobalData {
    private static _instance: LDGameSceneData;
    public static getInstance(): LDGameSceneData {
        if (!this._instance) {
            this._instance = new LDGameSceneData();
        }
        return this._instance;
    }
    /****************************牌相关*********************************** */
    private cardManager: LDCardManager = new LDCardManager();
    //明牌
    private brightIndex: number = -1;
    //我方牌面处理
    private cardList: Array<number> = [];//我方牌面
    /*****************************出牌信息******************************** */
    public outCardPlayer: number = -1;//出最大牌面的玩家
    public outCards: Array<number> = [];//最大牌面
    /********************************************************************* */
    //标记
    public landFlag: boolean;//是否为地主
    public baseScore: number;//底分
    /********************************************************************* */
    public constructor() {
        super();
    }
    public resetGame() {
        this.cardList = [];
        this.landFlag = false;
        this.brightIndex = -1;
        this.outCardPlayer = -1;
        this.outCards = [];
        this.gameStart = true;
        this.gameStatus = 0;
    }
    //游戏开始
    public onGameStart(value: boolean) {
        this.gameStart = value;
        this.gameStatus = 100;
    }
    public setGameInfo(baseScore: number) {
        this.baseScore = baseScore;
    }
    public getBaseScore() {
        return this.baseScore;
    }
    //设置地主
    public setLand(value: boolean) {
        this.landFlag = value;
    }
    public getLandFlag() {
        return this.landFlag;
    }
    /**叫地主时，增加牌面 */
    public addCardList(list: Array<number>): Array<number> {
        Array.prototype.push.apply(this.cardList, list);
        this.cardManager.SortByCardData(this.cardList);
        return this.cardList;
    }
    /**************************************玩家信息******************************************** */
    public checkPlayerList() {//玩家列表检查
        var tableID = AppData.getInstance().userData.tableID;
        for (var i = 0, playerList = this.playerList, len = playerList.length; i < len; i++) {
            var playerData: base.PlayerData = playerList[i], status = playerData.status;//进入的用户资料数据
            if ((status == UserStatus.SIT || status == UserStatus.PLAY || status == UserStatus.COLLOCTAION)
                && playerData.tableID == tableID) {
                this.report(LDGameSceneModule.request.enteredPlayer, playerData);
            }
        }
    }
    /***********************************明牌相关****************************** */
    //明牌设置
    public setBrightPlayer(index: number): void {
        this.brightIndex = index;
    }
    public getBrightPlayer(): number {
        return this.brightIndex;
    }
    /****************************************出牌*********************************************** */
    /**发牌 */
    public initCardList(list: Array<number>) {
        var cardList = this.cardList = [];
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i] != 0) cardList.push(list[i]);
        }
    }
    /**牌面排序 */
    public sortCard(): Array<number> {
        this.cardManager.SortByCardData(this.cardList);
        return this.cardList;
    }
    public sortWithCard(cardList: Array<number>): Array<number> {
        var list = [];
        for (var i = 0, len = cardList.length; i < len; i++) {
            if (cardList[i] != 0) {
                list.push(cardList[i]);
            } else {
                break;
            }
        }
        this.cardManager.SortByCardData(list);
        return list;
    }
    /**出牌时，减少牌面 */
    private removeCardList(cardList: Array<number>, list: Array<number>) {
        for (var i = 0, len = list.length; i < len; i++) {
            cardList.splice(cardList.indexOf(list[i]), 1);
        }
    }
    /**最新牌面 */
    public setNewCards(data: any) {
        //{"bCardCount":1,"wCurrentUser":2,"wOutCardUser":1,"bCardData":[36]}
        this.outCardPlayer = data.wOutCardUser;
        var outCards = this.outCards = [];
        for (var i = 0, cardData = data.bCardData, len = cardData.length; i < len; i++) {
            if (cardData[i] > 0) outCards.push(cardData[i]);
        }
    }
    public resetOutCard() {
        this.outCards = [];
        this.outCardPlayer = -1;
    }
    /**选择出牌 */
    public setSelectedCards(list: Array<number>): CardValue {
        var cardValue: CardValue;
        if (this.outCards.length == 0) {
            cardValue = this.cardManager.getCardInfo(list);
        } else {
            cardValue = this.cardManager.checkBigger(list, this.outCards);
        }
        if (cardValue.type != LDCardType.ERROR) {
            this.removeCardList(this.cardList, list);
        }
        return cardValue;
    }
    /**提示牌面 */
    public getTipCards(): Array<Array<number>> {
        return this.cardManager.getTipCards(this.cardList, this.outCards);
    }
    /**托管出牌 */
    public getAutoCards(): Array<number> {
        return this.cardManager.getAutoCards(this.cardList, this.outCards);
    }
    /**获取牌类型 */
    public getCardType(list: Array<number>): CardValue {
        return this.cardManager.getCardInfo(list);
    }
    /****************************************************************************** */
}
