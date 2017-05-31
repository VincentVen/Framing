/**
 * 游戏场玩家信息模块
 * @author none
 * 
 */
class UserInfoWindowModule extends how.module.WindowModule {
    public playerData: NewPlayerData;
    public static response: any = {
        getPanelData: "getPanelData",
        onGetUserInfo: CMDConfig.GET_USERINFO
    }
    public static request: any = {
        onMagicFaceItem: "onMagicFaceItem"
    }
    //按下某个互动表情
    public onMagicFaceItem(data: any): void {
        this.gameSocket.send(CMDConfig.SEND_MAGIC_FACE, {
            wChairID: AppData.getInstance().userData.chairID,
            wToChairID: this.playerData.chairID,
            expId: data.index
        });
        this.close();
    }
    //请求玩家信息
    public getPanelData(playerData: NewPlayerData): void {
        this.playerData = playerData;
        this.gameSocket.send(CMDConfig.SEND_USERINFO, { userID: playerData.id });
    }
    //收到玩家信息
    public onGetUserInfo(data: any): void {
        data.id = this.playerData.id;
        data.accounts = this.playerData.isMyself() ? base.Utils.formatNickName(this.playerData.nickName, 10) : this.playerData.nickName;
        data.Gender = this.playerData.gender;
        data.FaceID = this.playerData.avatar;
        data.Score = this.playerData.money;
        this.callUI("showUserInfo", data);
    }
}
