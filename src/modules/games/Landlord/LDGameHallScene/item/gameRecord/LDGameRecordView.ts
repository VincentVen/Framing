/**
 *游戏记录窗口界面
 * @author none
 *
 */
class LDGameRecordView extends how.module.Window {
    public recordList: eui.List;//游戏记录
    public noGameRecordLabel: eui.Label;//无游戏记录文本
    public titleGroup: eui.Group;//标题
    public constructor() {
        super();
        this.skinName = "ldGameRecordSkin";
        this.recordList.visible = false;
        this.noGameRecordLabel.visible = false;
    }
    //显示游戏记录
    public showGameRecord(gameRecords: eui.ArrayCollection): void {
        var value = gameRecords.length == 0;
        if (value) {
            this.noGameRecordLabel.text = LanguageConfig.noGameRecord;
            this.noGameRecordLabel.visible = true;
            this.titleGroup.visible = false;
            this.recordList.visible = false;
        } else {
            this.recordList.visible = true;
            this.titleGroup.visible = true;
            this.noGameRecordLabel.visible = false;
            this.recordList.dataProvider = gameRecords;
        }
    }
}
