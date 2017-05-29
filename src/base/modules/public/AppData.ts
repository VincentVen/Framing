module base {
    /**
     * 全局数据
     * @author none
     *
     */
    export class AppData extends how.module.Data {
        private static _instance: AppData;
        public constructor() {
            super();
        }
        public static getInstance(): AppData {
            if (!this._instance) {
                this._instance = new AppData();
            }
            return this._instance;
        }
        public language: string = "zh-cn";//默认中文
        public currentGameIndex: number = 0;//当前游戏
        public currentSocket: number = -1;//现在链接的服务器：0：游戏大厅服务器，1：游戏服务器
        public account: string = "";//当前帐号
        public token: string = "";//当前token

        // public agentId: number;//渠道ID，只用于与服务器数据交互
        public userData: base.UserData = new base.UserData();
        public roomList: Array<RoomData> = new Array<RoomData>();//所有房间列表
        public normalRoomList: Array<RoomData> = new Array<RoomData>();//普通房列表
        public gameList: Array<GameData> = new Array<GameData>();//游戏列表
        public lastServerId: number = 0;//最后的服务器id(断线重连)
        public lastGameId: number = 0;//最后的游戏id(断线重连)
        public lastServerPort: number = 0;//最后的服务器的端口号
        public lastPreScore: number = 0;//最后进入房间的前注
        public currentRoom: RoomData;//当前房间信息
        public currentGame: GameData;//当前游戏信息
        public isGameHide: boolean = false;//游戏是否进入后台
        public networkDelay: number = 0;//网络延迟
        /**
        * 游戏数据
        */
        public get gameData(): GameSceneGlobalData {
            var gameData: GameSceneGlobalData = null;
            switch (AppData.getInstance().currentGame.id) {
                case 205:
                    // gameData = ZjhGameData.getInstance();
                    break;
                case 620:
                    gameData = NewGameSceneData.getInstance();
                    break;
                case 203:
                    gameData = LDGameSceneData.getInstance();
                case 720:
                    gameData = TEBGameSceneData.getInstance();
                    break;
            }
            return gameData;
        }
        //数据初始化
        public dataInit(): void {
            this.roomList = [];
            this.normalRoomList = [];
            this.currentRoom = null;
            // this.userData = new base.UserData();
        }
        /**
         * 设置房间列表数据
         */
        public setRoomList(source: any): void {
            this.roomList = [];
            var arr: RoomData[] = [];
            var i: number = 0;
            if (Array.isArray(source.wKindID)) {
                for (i = 0; i < source.wKindID.length; i++) {
                    var kindID = source.wKindID[i];
                    // if (GameConfig.kindID == kindID) {//如果是本游戏的房间
                    var roomData: RoomData = new RoomData();
                    roomData.kindID = kindID;
                    roomData.id = source.wServerID[i];
                    roomData.port = source.wServerPort[i];
                    roomData.host = source.dwServerAddr[i];
                    roomData.onLineCount = source.dwOnLineCount[i];
                    roomData.name = source.szServerName[i];
                    roomData.baseScore = source.lBaseScore[i];
                    roomData.limitScore = source.lLimitScore[i];
                    roomData.cellScore = source.lCellScore[i];
                    if (source.PrivateRoomType) {
                        roomData.privateType = source.PrivateRoomType[i];
                    }
                    if (source.ChangeScore) {
                        roomData.changeScore = source.ChangeScore[i];
                        roomData.takeScore = source.TakeScore[i];
                        roomData.maxTakeScore = source.MaxScore[i];
                    }
                    if (source.ExpreCost) {
                        roomData.ExpreCost = source.ExpreCost[i];
                    }
                    if (source.NormalPreScore) {
                        roomData.preScore = source.NormalPreScore[i];
                    }
                    if (source.TableFee) {
                        roomData.tableFree = source.TableFee[i];
                    }
                    this.roomList.push(roomData);
                    // }
                }
            }
            this.roomList.sort(function (a: any, b: any): number {
                return a.baseScore < b.baseScore ? -1 : 1;
            });

            this.initNormalRoomList();
        }

        //初始化普通房列表
        private initNormalRoomList(): void {
            this.normalRoomList = [];
            for (var i = 0; i < this.roomList.length; i++) {
                var roomData: RoomData = this.roomList[i];
                // if (roomData.id >= 3600 && roomData.id <= 3899) {
                //     this.normalRoomList.push(roomData);
                // }
                this.normalRoomList.push(roomData);
            }
        }

        //根据级别和顺序获取房间数据
        private getRoomData(level: number, sortID: number): any {
            var reData: any = null;
            var roomData: RoomData;
            for (var i = 0; i < this.roomList.length; i++) {
                roomData = this.roomList[i];
                if (parseInt(roomData.name) == level * 10 + sortID + 1) {
                    return roomData;
                }
            }

            return null;
        }
        //收到游戏列表
        public setGameList(data: any): void {
            this.gameList = [];
            for (var i = 0; i < data.gameID.length; i++) {
                var gameData: GameData = new GameData();
                gameData.id = data.gameID[i];
                gameData.channelID = parseInt(data.channelID[i]);
                gameData.lable = data.lable[i];
                gameData.type = data.type[i];
                gameData.order = data.order[i];
                gameData.count = data.playerCount[i];
                gameData.status = data.status[i];
                gameData.logo = data.logo[i];
                this.gameList.push(gameData);
            }
        }
        //获取渠道id
        public getGameChannelId() {
            for (var i = 0, gameList = this.gameList, len = gameList.length; i < len; i++) {
                var game = gameList[i];
                if (game.id == this.currentGameIndex)
                    return game.channelID;
            }
        }
        //获取游戏信息
        public getGameById(id: number) {
            for (var i = 0, gameList = this.gameList, len = gameList.length; i < len; i++) {
                if (gameList[i].id == id)
                    return gameList[i];
            }
        }
        //设置语言
        public setLanguage(language: string): void {
            this.language = language.toLowerCase();
        }
    }
}