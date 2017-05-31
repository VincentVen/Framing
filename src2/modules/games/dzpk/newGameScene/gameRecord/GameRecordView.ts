/**
 *游戏记录窗口界面
 * @author none
 *
 */
class GameRecordView extends how.module.Window {
    public gameRecordList: eui.List;//游戏记录
    public noGameRecordLabel: eui.Label;//无游戏记录文本
    public labelGroup: eui.Group;
    public constructor() {
        super();
        this.skinName = "GameRecordSkin";
        this.gameRecordList.visible = false;
        this.labelGroup.visible = false;
        this.noGameRecordLabel.visible = false;
    }
    //显示游戏记录
    public showGameRecord(gameRecords: eui.ArrayCollection): void {
        this.noGameRecordLabel.visible = gameRecords.length == 0;
        if (gameRecords.length == 0) {
            this.noGameRecordLabel.text = LanguageConfig.noGameRecord;
        }
        this.gameRecordList.visible = gameRecords.length != 0;
        this.labelGroup.visible = gameRecords.length != 0;
        this.gameRecordList.dataProvider = gameRecords;
    }
}
