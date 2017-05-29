
class TEBGameSceneData extends base.GameSceneGlobalData {
    /************************************************************** */
    private static _instance: LDGameSceneData;
    public static getInstance(): LDGameSceneData {
        if (!this._instance) {
            this._instance = new LDGameSceneData();
        }
        return this._instance;
    }
    /************************************************************** */
    public baseScore: number = 0;
    public chips: Array<number> = [10, 50, 100, 500, 2000, 10000];
    private openCardData: Array<number> = [];
    private cardManager: TEBCardManager = new TEBCardManager();//卡牌处理器
    public constructor() {
        super();
    }
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
    //设置底分
    public setBaseScore(value: number) {
        this.baseScore = value;
    }
    //获取下注筹码
    public getChipList(): Array<number> {
        var totalScore = this.baseScore * 100, list: Array<number> = [], chips = this.chips, i = 5;
        while (totalScore > 0 && i >= 0) {
            var temp = list[i];
            if (totalScore > temp) {
                list.push(temp);
                totalScore -= temp;
            } else {
                i--;
            }
        }
        return list;
    }
    //获取卡牌类型
    public getCardType(list: Array<number>) {
        this.cardManager.getCardTypeByData(list);
    }
    public getOpenCardData() {
        return this.openCardData;
    }
}
