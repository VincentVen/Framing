
class DZPKGameBtn extends how.Button {
    public bg: eui.Image;
    public moneyTip: eui.Label;//准入
    public gameMoney: eui.BitmapLabel;//盲注
    public baseScore: eui.Image;//盲注字
    public preScore: eui.Image;//前注
    public preMoney: eui.BitmapLabel;//前注金额
    public gameMoneyGroup: eui.Group;
    public constructor() {
        super();
        this.skinName = "dzphRH_gameBtn";
    }
}
class DZPKGameListItem extends how.module.ItemView {
    private btnEnter: DZPKGameBtn;
    public constructor() {
        super();
        this.skinName = "dzpkRH_gameItem";
    }
    public dataChanged(): void {
        //获取列表类型，接口修改之前的暂时方案
        let name = ["新手房", "初级房", "中级房", "高级房", "财大气粗", "腰缠万贯", "挥金如土", "富贵逼人"], index = name.indexOf(this.data.name);
        this.btnEnter.bg.source = "game_room_" + name.indexOf(this.data.name) + "_selected_png";
        this.btnEnter.moneyTip.text = LanguageConfig.minMaxMoney + base.Utils.formatCurrency(this.data.baseScore);
        this.btnEnter.gameMoney.text = base.Utils.formatCurrency(this.data.cellScore) + "@" + base.Utils.formatCurrency(this.data.cellScore * 2);
        this.btnEnter.gameMoney.visible = true;
        if (index < 4) {
            this.btnEnter.baseScore.x = 81;
            this.btnEnter.baseScore.y = 113;
            this.btnEnter.gameMoneyGroup.x = 127;
            this.btnEnter.gameMoneyGroup.y = 115;
            this.btnEnter.preScore.visible = false;
            this.btnEnter.preMoney.visible = false;
        } else {
            this.btnEnter.baseScore.x = 62;
            this.btnEnter.baseScore.y = 96;
            this.btnEnter.gameMoneyGroup.x = 118;
            this.btnEnter.gameMoneyGroup.y = 98;
            this.btnEnter.preScore.visible = true;
            this.btnEnter.preMoney.visible = true;
            this.btnEnter.preMoney.text = base.Utils.formatCurrency(this.data.preScore);
        }
        this.btnEnter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goGame, this);
    }
    public goGame() {
        if (AppData.getInstance().userData.money >= this.data.baseScore) {
            this.report(DZPKRoomHallSceneModule.request.onGetGameInfo, this.data);
        } else {
            how.Alert.show(LanguageConfig.error_72);
        }
    }
}