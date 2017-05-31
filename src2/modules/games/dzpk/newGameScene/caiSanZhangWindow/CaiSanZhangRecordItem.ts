/**
 * 猜三张历史记录
 * @author none
 */
class CaiSanZhangRecordItem extends how.module.ItemView {
    public time: eui.Label;//时间
    public card0: eui.Image;
    public card1: eui.Image;
    public card2: eui.Image;
    public profitBet: eui.Label;//当前牌型
    public allScore: eui.Label;//累计盈利
    public betList: eui.List;//投注点列表
    public constructor() {
        super();
        this.skinName = "CaiSanZhangRecordItemSkin";
    }
    public dataChanged(): void {
        this.time.text = this.data.openTime;
        this.card0.source = "card_" + this.data.card1 + "_png";
        this.card1.source = "card_" + this.data.card2 + "_png";
        this.card2.source = "card_" + this.data.card3 + "_png";
        this.allScore.text = base.Utils.formatCurrency(this.data.allScore);
        this.betList.dataProvider = new eui.ArrayCollection(this.data.types);
        this.profitBet.text = "";
        for (var i = 0; i < this.data.cardTypes.length; i++) {
            if (i != 0) {
                this.profitBet.text += "\n";
            }
            this.profitBet.text += DataConfig.caiSanZhangBuyTitleList[this.data.cardTypes[i]].title;
        }
    }
}
