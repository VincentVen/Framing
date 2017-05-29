/**
 * 猜三张历史记录下注列表
 * @author none
 */
class CaiSanZhangRecordBetItem extends how.module.ItemView {
    public bettingPoint: eui.Label;
    public zhushu: eui.Label;
    public profit: eui.Label;
    public constructor() {
        super();
        this.skinName = "CaiSanZhangRecordBetItemSkin";
    }
    public dataChanged(): void {
        var textColor = this.data.cellScore > 0 ? 0XDB2E2E : 0X0058BA;
        this.bettingPoint.textColor = textColor;
        this.bettingPoint.text = DataConfig.caiSanZhangBuyTitleList[this.data.type].title;
        this.zhushu.text = this.data.betNum;
        this.zhushu.textColor = textColor;
        this.profit.text = base.Utils.formatCurrency(this.data.cellScore);
        this.profit.textColor = textColor;
    }
}
