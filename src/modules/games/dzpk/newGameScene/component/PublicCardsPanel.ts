/**
 * 公共牌面板
 * @author none
 *
 */
class PublicCardsPanel extends how.module.View {
    public cardData: Array<number> = [];
    public constructor() {
        super();
    }
    public start(): void {
        this.resetData();
    }
    public onDestroy(): void {
    }
    /**
     * 收到游戏开始
     */
    public onGameStart(event: egret.Event): void {
        this.resetData();
        this.hideCenterCardTip();
    }
    /**
     * 收到游戏结束
     */
    public onGameEnd(event: egret.Event): void {
        //this.resetData();
    }
    public resetData(): void {
        this.cardData = [];
        for (var i: number = 0; i < 5; i++) {
            this["card" + i].visible = false;
            this["card" + i].source = "card_0_png";
            this["card" + i + "Tip"].visible = false;
            this["card" + i + "Rect"].visible = false;
        }
    }
    //显示公共牌
    public showCardData(publicCards: Array<number>): void {
        for (var i = 0; i < publicCards.length; i++) {
            if (publicCards[i] > 0) {
                this["card" + i].visible = true;
                this["card" + i].source = how.StringUtils.format("card_{0}_png", publicCards[i]);
            }
        }
    }
    //显示某一张公共牌
    public showCardDataIndex(index: number) {
        if (this.cardData.length > 0 && this.cardData.length >= index - 1) {
            this["card" + index].visible = true;
            this["card" + index].source = how.StringUtils.format("card_{0}_png", this.cardData[index]);
            if (index == (this.cardData.length - 1) && !AppData.getInstance().isGameHide) {//判断是否是最后一张牌显示完毕
                this.report("showCardTypeTip");
            }
        }
    }
    /*
     * 提示最大牌型公共牌
     * */
    public showCenterCardTip(centerCardIndexs: number[]): void {
        for (var i: number = 0; i < 5; i++) {
            this["card" + i + "Tip"].visible = centerCardIndexs.indexOf(i) != -1;
        }
    }
    /*
     * 隐藏最大牌型公共牌
     * */
    public hideCenterCardTip(): void {
        for (var i: number = 0; i < 5; i++) {
            this["card" + i + "Tip"].visible = false;
            this["card" + i + "Rect"].visible = false;
        }
    }
    /*
     * 显示遮罩让牌
     * */
    public showCardRect(index: number): void {
        this["card" + index + "Rect"].visible = true;
    }
}
