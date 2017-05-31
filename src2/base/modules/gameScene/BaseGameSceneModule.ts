module base {
    /**
     * 新游戏场景
     * @author none
     *
     */
    export class BaseGameSceneModule extends how.module.SceneModule {
        public static response: any = {
            onStatusChange: CMDConfig.GET_STATUS_CHANGE,//玩家状态改变
            onGameStart: CMDConfig.GET_GAMESTART,//当游戏开始
            onReConnected: CMDConfig.GET_GAMESTATUS,//当断线重连
            onGameEnd: CMDConfig.GET_GAMEEND,//游戏结束
            updataBackStatus: "updataBackStatus",//更改返回状态
            onValidateOperate: CMDConfig.GET_OPERATE,//收到操作结果
        }
        public isBackstatus: BackStatusConfig = BackStatusConfig.back;//面板状态
        public onDestroy(): void {
            AppData.getInstance().gameData.playerList = [];
            egret.Tween.removeTweens(this);
            super.onDestroy();
        }
        //加载玩家数据
        public initPlayers(): void {
            var playerList: Array<any> = AppData.getInstance().gameData.getPlayersByTableIDHaveChairID();//获取相同桌子的玩家
            for (var i = 0; i < playerList.length; i++) {
                var playerData: base.PlayerData = playerList[i];
                egret.Tween.removeTweens(this["player" + playerData.seatID]);
                this["player" + playerData.seatID].data = playerData;
            }
            for (var j = 0; j < RoomData.MAX_PLAYER; j++) {
                if (this["player" + j].data &&
                    (this["player" + j].data.chairID == 65535 || !base.Utils.getItem(playerList, "id", this["player" + j].data.id) || this["player" + j].data.seatID != j)) {//如果不在同一张桌子上或者座位号是65535
                    egret.Tween.removeTweens(this["player" + j]);
                    this["player" + j].data = null;
                }
                if (!this["player" + j].data) {
                    egret.Tween.removeTweens(this["player" + j]);
                    this["player" + j].data = null;
                }
            }
        }
        //玩家状态改变
        public onStatusChange(data: any): void {
            //如果这个玩家在我的桌子上并且为坐下状态则把该玩家添加到桌子上
            if (data.cbUserStatus == UserStatus.SIT && data.wTableID == AppData.getInstance().userData.tableID) {
                var playerData: base.PlayerData = base.Utils.getItem(AppData.getInstance().gameData.playerList, "id", data.dwUserID);//进入的用户资料数据
                if (playerData) {
                    var player: BasePlayerModule = this["player" + playerData.seatID];
                    if (player && (!player.data || (player.data && player.data.id != playerData.id))) {
                        player.data = playerData;
                    }
                }
            } 
            if (data.dwUserID == AppData.getInstance().userData.id) {
                this.onMyStatusChange(data);
            }
        }
        //玩家自己状态改变
        public onMyStatusChange(data: any): void {
        }
        //收到游戏开始
        public onGameStart(data: any): void {
            this.communicate("onGameStart", data);
            this.onValidateOperate(data);
        }
        //收到断线重连
        public onReConnected(data: any): void {
            this.communicate("onReConnected", data);
        }
        //收到操作结果
        public onValidateOperate(data: any) {
            this.communicate("setOperateOverUI", data);
            AppData.getInstance().gameData.validateOperateData(data);
            this.communicate("setOperateUI", data);
            this.updataDiChi();
        }
        //收到游戏结束
        public onGameEnd(data: any): void {
            this.communicate("onGameEnd", data);
        }
        //更新底池
        public updataDiChi(): void {
        }
        //更改返回状态
        public updataBackStatus(isBackstatus: BackStatusConfig): void {
            this.isBackstatus = isBackstatus;
        }
    }
}
