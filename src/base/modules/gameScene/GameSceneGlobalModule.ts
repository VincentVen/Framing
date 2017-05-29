module base {
	/**
	 * 游戏全局模块
	 * @author none
	 *
	 */
    export class GameSceneGlobalModule extends how.module.SceneModule {
        public constructor(guiClass: any = null, dataClass: any = null) {
            super(guiClass, dataClass);
        }
        public static response: any = {
            onRoomConfig: CMDConfig.GET_ROOMCONFIG,//收到房间配置
            onPlayerEnter: CMDConfig.GET_PLAYER_ENTER,//收到玩家进入
            onStatusChange: CMDConfig.GET_STATUS_CHANGE,//玩家状态改变
            onGameStatus: CMDConfig.GET_GAMECONFIG,//收到游戏状态
        };
        //收到房间配置
        public onRoomConfig(data: any): void {
            this.callData("onRoomConfig", data);
        }
        //收到玩家进入
        public onPlayerEnter(data: any): void {
            this.callData("onPlayerEnter", data);
        }
        /*
         *玩家状态改变
         */
        public onStatusChange(data: any): void {
            this.callData("onStatusChange", data);
        }
        //收到游戏状态
        public onGameStatus(data: any): void {
            this.callData("onGameStatus", data);
        }
        public _onBack(): void {
        }
    }
}
