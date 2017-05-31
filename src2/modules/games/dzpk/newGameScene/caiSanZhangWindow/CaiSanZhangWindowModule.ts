/**
 * 猜三张窗口
 * @author none
 */
class CaiSanZhangWindowModule extends how.module.WindowModule {
    public static response: any = {
        onBetData: CMDConfig.GET__BETTINGSCORE,
        onCancleBet: CMDConfig.GET__CANCLEBETTINGSCORE,
        onCSZResult: CMDConfig.GET__CSZRESULT,//收到猜三张开奖
        onGetCSZRecord: CMDConfig.GET__CSZRECORD,//收到猜三张记录
    }
    public static request: any = {
        onBettingBtn: "onBettingBtn",
        onCancleBettingBtn: "onCancleBettingBtn"
    }
    public cszCardLogic: CSZCardLogic = new CSZCardLogic();
    public constructor(guiClass: any = null, dataClass: any = null, modal: boolean = true, center: boolean = true, autoClose: boolean = true) {
        super(guiClass, dataClass, false, false);
    }
    public start(): void {
        this.gameSocket.send(CMDConfig.SEND__BETTINGSCORE, { betNumber: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], llBetScore: 0 });
        this.gameSocket.send(CMDConfig.SEND__CSZRECORD, {});
    }
    //按下下注按钮
    public onBettingBtn(): void {
        var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
        if ((caiSanZhangData.betNumber.indexOf(1) != -1 || caiSanZhangData.betNumber.indexOf(5) != -1
            || caiSanZhangData.betNumber.indexOf(10) != -1)) {
            caiSanZhangData.llBetScore = caiSanZhangData.llBetScore == 0 ? 100 : caiSanZhangData.llBetScore;
            caiSanZhangData.llBetNumber = caiSanZhangData.llBetNumber == 0 ? 1 : caiSanZhangData.llBetNumber;
            this.gameSocket.send(CMDConfig.SEND__BETTINGSCORE, { betNumber: caiSanZhangData.betNumber, llBetScore: parseInt(caiSanZhangData.llBetScore) });
            egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify(caiSanZhangData));
        }
    }
    //按下取消下注按钮
    public onCancleBettingBtn(): void {
        this.gameSocket.send(CMDConfig.SEND__CANCLEBETTINGSCORE, {});
    }
    //下注结果返回
    public onBetData(data: any): void {
        var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
        caiSanZhangData.llBetScore = data.llBetScore == -1 ? caiSanZhangData.llBetScore : data.llBetScore;
        this.callUI("showBettingList", caiSanZhangData);
    }
    //收到取消下注
    public onCancleBet(): void {
        this.callUI("showBettingList", { betNumber: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], llBetScore: 0, llBetNumber: 0 });
        egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify({ betNumber: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], llBetScore: 0, llBetNumber: 0 }));
    }
    //收到猜三张开奖
    public onCSZResult(): void {
        this.gameSocket.send(CMDConfig.SEND__CSZRECORD, {});
    }
    //收到猜三张记录
    public onGetCSZRecord(data: any): void {
        var result = data.result;
        for (var i = 0; i < result.length; i++) {
            result[i]["cardTypes"] = this.cszCardLogic.getCardType([result[i].card1, result[i].card2, result[i].card3]);
        }
        this.callUI("setCSZRecordData", result);
    }
}
