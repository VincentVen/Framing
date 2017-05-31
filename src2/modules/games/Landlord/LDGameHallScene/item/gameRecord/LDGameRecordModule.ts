/**
 *游戏记录窗口模块
 * @author none
 *
 */
class LDGameRecordModule extends how.module.WindowModule {
    public static response: any = {
        onGameRecord: CMDConfig.GET_GAMERECORD,//收到游戏记录
    }
    public start(): void {
        this.gameSocket.send(CMDConfig.SEND_GAMERECORD, {});
    }
    //收到游戏记录
    public onGameRecord(data: any): void {
        var gameRecords: any[] = [];
        for (var i = 0; i < data.id.length; i++) {
            gameRecords.push({
                id: data.id[i],
                name: data.name[i],
                sysRecv: data.sysRecv[i],
                score: data.score[i],
                endTime: data.endTime[i],
            });
        }
        this.callUI("showGameRecord", new eui.ArrayCollection(gameRecords));
    }
}
