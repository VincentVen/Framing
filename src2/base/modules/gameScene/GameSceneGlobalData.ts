module base {
	/**
	 * 游戏场全局数据
	 * @author none
	 *
	 */
    export class GameSceneGlobalData extends how.module.Data {
        public playerList: Array<PlayerData> = [];
        public gameStatus: number;//游戏状态
        public gameId: string = null;
        public gameStart: boolean = false;//游戏是否开始
        //收到游戏状态
        public onGameStatus(data: any): void {
            this.gameStatus = data.bGameStatus;
        }
        //收到房间配置
        public onRoomConfig(data: any): void {
            AppData.getInstance().currentRoom.chairCount = data.wChairCount;
            AppData.getInstance().currentRoom.tableCount = data.wTableCountCount;
            AppData.getInstance().currentRoom.gameGenre = data.wGameGenre;
            RoomData.MAX_PLAYER = data.wChairCount;
        }
        public get playerDataType(): any {
            return base.PlayerData;
        }
        //收到玩家进入
        public onPlayerEnter(data: any): void {
            this.playerList = this.playerList || [];
            var playerData: PlayerData = new this.playerDataType();
            if (data.dwUserID == AppData.getInstance().userData.id) {//如果是自己
                AppData.getInstance().userData.tableID = data.wTableID;
                AppData.getInstance().userData.chairID = data.wChairID;
                AppData.getInstance().userData.status = data.cbUserStatus;
                AppData.getInstance().userData.UserScoreInfo = data.UserScoreInfo;//更新玩家数据
                AppData.getInstance().userData.money = AppData.getInstance().userData.UserScoreInfo.lScore;
            }
            playerData.setData(data);
            var playerData2: PlayerData = base.Utils.getItem(this.playerList, "id", playerData.id)
            if (!playerData2) {
                this.playerList.push(playerData);
            } else {
                this.playerList[this.playerList.indexOf(playerData2)] = playerData;
            }
        }
        /*
         *玩家状态改变
         */
        public onStatusChange(data: any): void {
            this.playerList = this.playerList || [];
            var playerData: PlayerData = base.Utils.getItem(this.playerList, "id", data.dwUserID);//状态改变的用户资料数据
            if (playerData == null) {
                return;
            }
            if (this.gameStart && (data.cbUserStatus == UserStatus.NULL || data.cbUserStatus == UserStatus.FREE)) {
                return;
            }
            if (data.dwUserID == AppData.getInstance().userData.id) {//如果是自己
                if (data.cbUserStatus == UserStatus.FREE) {
                    AppData.getInstance().userData.lastChairID = AppData.getInstance().userData.chairID;
                }
                if (data.cbUserStatus == UserStatus.SIT) {
                    AppData.getInstance().userData.lastChairID = 65535;
                }
                AppData.getInstance().userData.tableID = data.wTableID;
                AppData.getInstance().userData.chairID = data.wChairID;
                AppData.getInstance().userData.status = data.cbUserStatus;
            }
            if (data.cbUserStatus == UserStatus.NULL && !this.gameStart) {//如果没有状态，就说明用户离开房间
                base.Utils.remove(this.playerList, playerData);//从用户列表中删除这个用户
            }
            else {//否则就更新其数据
                playerData.chairID = data.wChairID;//保存玩家的椅子号
                playerData.tableID = data.wTableID;//保存玩家的桌子号
                playerData.status = data.cbUserStatus;//保存玩家的状态信息
            }
        }
        /**
        * 获取桌子上的玩家列表
        * */
        public getPlayersByTableID(tableID?: number): Array<PlayerData> {
            tableID = tableID || AppData.getInstance().userData.tableID;
            var result: Array<PlayerData> = new Array<PlayerData>();
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i].tableID == tableID) {
                    result.push(this.playerList[i]);
                }
            }
            return result;
        }
        /*
         * 获取桌子上不是65535的玩家
         * */
        public getPlayersByTableIDHaveChairID(tableID?: number): Array<PlayerData> {
            tableID = tableID || AppData.getInstance().userData.tableID;
            var result: Array<PlayerData> = new Array<PlayerData>();
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i].tableID == tableID && this.playerList[i].chairID != 65535) {
                    result.push(this.playerList[i]);
                }
            }
            return result;
        }
        /**
        * 按逆时针获取下一个游戏中的玩家
        * @param chairID
        */
        public getNextChairID(chairID: number): number {
            var result: number = 65535;
            if (chairID == 0) {
                result = 8;
            }
            else {
                result = chairID - 1;
            }
            var playingPlayerList: Array<PlayerData> = this.getplayingPlayerList();
            while (!base.Utils.getItem(playingPlayerList, "chairID", result)) {
                result = this.getNextChairID(result);
            }
            return result;
        }
        /**
         * 
         * 获取当前桌子上游戏或者比赛中的玩家
        */
        public getplayingPlayerList(): Array<PlayerData> {
            var playerList: Array<PlayerData> = this.getPlayersByTableID();
            var playingPlayerList: Array<PlayerData> = [];
            for (var i = 0; i < playerList.length; i++) {
                if (playerList[i].status == UserStatus.PLAY || playerList[i].status == UserStatus.MATCH) {
                    playingPlayerList.push(playerList[i]);
                }
            }
            return playingPlayerList;
        }
        /*
         *获取当前桌子上携带筹码最多的玩家
         */
        public getMaxLTakeMoney(): number {
            var playerDatas: Array<PlayerData> = this.getPlayersByTableIDHaveChairID();
            var maxLTakeMoney: number = 0;
            for (var i = 0; i < playerDatas.length; i++) {
                if (maxLTakeMoney < playerDatas[i].lTakeMoney) {
                    maxLTakeMoney = playerDatas[i].lTakeMoney;
                }
            }
            return maxLTakeMoney;
        }
        /**
        * 转换椅子编号为座位编号
        * */
        public getSeatID(chairID: number): number {
            if (!AppData.getInstance().userData.chairID || AppData.getInstance().userData.chairID == 65535) {//如果自己不在桌子上
                return chairID;
            }
            else {
                return (chairID + RoomData.MAX_PLAYER - AppData.getInstance().userData.chairID) % RoomData.MAX_PLAYER;
            }
        }
        /*
        * 游戏开始时更新Data
        */
        public gameStartData(data: any): void {
        }
        /*
        *收到游戏开始时间
        */
        public onGetGameStartTime(data): void {
        }
        /*
        *收到操作结果
        */
        public onValidateOperate(data: any) {
        }
        /*
         * 断线重连(同步牌桌信息)
         * */
        public onReConnected(data: any): void {
        }
        /*
        * 收到操作结果更新Data
        */
        public validateOperateData(data: any): void {
        }
        /*
         * 收到发牌更新Data
         * */
        public onGetCards(data: any): void {
        }
    }
}
