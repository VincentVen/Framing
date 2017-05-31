/**
 * 购买坐下窗口
 * @author none
 *
 */
class BuySitDownWindowData extends how.module.Data {
    public totalScore: number;//总游戏币数
    public takeMinScore: number;//最小携带
    public takeMaxScore: number;//最大携带
    public initData(): void {
        var currentRoom = AppData.getInstance().currentRoom;
        var userData = AppData.getInstance().userData;
        this.totalScore = userData.money;
        this.takeMinScore = currentRoom.baseScore;
        // this.takeMinScore = this.totalScore >= this.takeMinScore ? this.takeMinScore : this.totalScore;
        this.takeMaxScore = (currentRoom.maxTakeScore >= userData.money || currentRoom.maxTakeScore == 0) ? userData.money : currentRoom.maxTakeScore;
        var data = base.Utils.getLocalStorageItem(StorageKeys.DZPKTakeScore + currentRoom.id, "Object");
        var takeScore = data.takeScore == undefined ? currentRoom.takeScore : data.takeScore;
        takeScore = takeScore < this.takeMaxScore ? takeScore : this.takeMaxScore;
        takeScore = takeScore == 0 ? currentRoom.takeScore : takeScore;
        NewGameSceneData.getInstance().takeScore = takeScore > userData.money ? userData.money : takeScore;
        NewGameSceneData.getInstance().isautoTakeScore = data.isautoTakeScore;
    }
}