/**
 * 游戏记录item
 * @author none
 */
class GameRecordItem extends how.module.ItemView {
    public bg: eui.Image;//背景
    public num: eui.Label;     //序号
    public id: eui.Label;      //游戏记录流水id
    public roomName: eui.Label;//房间名称
    public score: eui.Label;//输赢筹码数
    public sysRecv: eui.Label;//抽水
    public endTime: eui.Label;//结束时间
    public constructor() {
        super();
        this.skinName = "GameRecordItemSkin";
    }
    public dataChanged(): void {
        this.bg.visible = this.itemIndex % 2 == 0;
        this.num.text = (this.itemIndex + 1).toString();
        this.id.text = this.data.id;
        this.roomName.text = this.data.name;
        this.score.text = base.Utils.formatCurrency(this.data.score);
        this.sysRecv.text = base.Utils.formatCurrency(this.data.sysRecv);
        this.endTime.text = this.data.endTime;
    }
}
