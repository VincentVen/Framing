module base {

    /**
     * 新玩家
     * @author none
     *
     */
    export class BasePlayerModule extends how.module.Module {
        public static response: any = {
            onStatusChange: CMDConfig.GET_STATUS_CHANGE,//玩家状态改变
            onGameStart: "onGameStart",//游戏开始
            onReConnected: "onReConnected",//断线重连
            onGameEnd: "onGameEnd",//当游戏结束
            onGoldChange: CMDConfig.GET_IN_GAME_GOLD_CHANGE,//收到金币改变
        }
        public onDestroy(): void {
            egret.Tween.removeTweens(this);
            super.onDestroy();
        }
        public set data(data: base.PlayerData) {
            this._data = data;
            if (data != null && data.status != UserStatus.FREE && data.status != UserStatus.NULL && data.status != UserStatus.LOOKON) {//如果是第一次坐下
                this.setSitUI();
                this.setFirstSitUI();
                if (this.isMyself()) {
                    this.ready();
                }
            } else if (data == null) {
                egret.Tween.removeTweens(this);
                this.setLeaveUI();//设置离开UI
            }
        }
        public get data(): base.PlayerData {
            return <base.PlayerData>this._data;
        }
        //当玩家状态改变
        public onStatusChange(data: any): void {
            if (this.data && data.dwUserID == this.data.id) {
                if (data.cbUserStatus == UserStatus.NULL) {//当玩家离开
                    this.clearPlayerData();
                }
                if (data.cbUserStatus == UserStatus.SIT) {//如果是坐下状态

                }
                if (data.cbUserStatus == UserStatus.PLAY) {//如果是游戏状态
                    this.setGameUI();
                }
                if (data.cbUserStatus == UserStatus.OFFLINE) {//当玩家断线
                    this.setOffLineUI();
                }
                if (data.cbUserStatus == UserStatus.FREE) {//当玩家起立
                    //如果是自己起立则不吧Data等于null,当自己状态为旁观时会重新刷新玩家列表,如果为比赛则置为null
                    if (!this.isMyself()) {
                        this.clearPlayerData();
                    }
                }
            }
        }
        //清空玩家数据
        public clearPlayerData(): void {
            if (!AppData.getInstance().gameData.gameStart) {
                this.data = null;
            }
        }
        //当游戏开始
        public onGameStart(data: any): void {
        }
        //当断线重连
        public onReConnected(data: any): void {
        }
        //当游戏结束
        public onGameEnd(data: any): void {
        }
        //设置玩家坐下
        public setSitUI(): void {
        }
        //设置玩家第一次坐下
        public setFirstSitUI(): void {
        }
        //设置玩家游戏中UI
        public setGameUI(): void {
        }
        //设置断线UI
        public setOffLineUI(): void {
        }
        //设置离开UI
        public setLeaveUI(): void {
        }
        //收到金币改变
        public onGoldChange(data: any): void {
            if (this.data && this.data.id && this.data.id == data.dwUserID) {
                this.data.UserScoreInfo = data.UserScore;//更新玩家数据
                this.setScore(data.UserScore);
                if (data.dwUserID == AppData.getInstance().userData.id) {
                    AppData.getInstance().userData.UserScoreInfo = data.UserScore;//更新玩家数据
                    AppData.getInstance().userData.money = AppData.getInstance().userData.UserScoreInfo.lScore;
                }
            }
        }
        //设置金币
        public setScore(value: number) { }
        //判断是否是玩家是否是自己
        public isMyself(): boolean {
            return this.data && this.data.id == AppData.getInstance().userData.id;
        }
        //准备
        public ready(): void {
            egret.Tween.get(this).wait(3000).call(() => {
                if (AppData.getInstance().userData.status == UserStatus.SIT) {//如果是坐下状态，才可准备
                    this.gameSocket.send(CMDConfig.SEND_READY);
                }
            }, this);
        }
    }
}
