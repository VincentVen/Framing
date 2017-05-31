module base {
    /**
    * 玩家数据
    * @author none
    *
    */
    export class PlayerData extends how.module.Data {
        /**
        * 用户经验
        */
        public exp: number;
        /**
        * 下一级经验
        */
        public nextExp: number;
        /**
        * 用户等级
        */
        public level: number;
        /**
        * 用户昵称
        */
        public nickName: string;
        /**
        * 用户昵称2
        */
        public nickName2: string;
        /**
        * 性别，1为男，0为女
        */
        public gender: number;
        /**
        * 会员等级
        */
        public vipLevel: number;
        /**
         * 游戏币 
         */
        public money: number;
        /**
         * 钻石   
         */
        public gold: number;
        /**
         * 奖券
         */
        public ticket: number;
        /**
         * 头像编号
         */
        public avatar: number;
        /**
         * 编号
         */
        public id: number;
        /**
         * 所在桌子编号
         */
        public tableID: number = null;
        /**
         * 所在椅子编号
         */
        public chairID: number = null;
        /**
        * 自己最后一次在桌子上的椅子编号
        */
        public lastChairID: number = 65535;
        /**
        *换桌前的桌子号 
        */
        public changeTableLastTableID: number = 65535;
        /**
         * 游戏内携带金钱
         */
        public lTakeMoney: number = 0;
        /*
         * 玩家的扑克牌
         * */
        public cardData: number[] = [];
        /**
         * 当前状态
         */
        public status: number;
        /*
         * 操作状态
         * */
        public bAddGiveUp = 0;
        /*
         * 下注数量
         * */
        public lAddScoreCount: number;
        /*
         * 玩家操作状态
         * */
        public operateAction: string;
        /*
         * 玩家牌型
         * */
        public cardType: number;
        /*
         * 玩家最终牌型的牌
         * */
        public cardTypeData: number[];
        /*
         * 玩家最终牌型排名
         */
        public userRank: number;
        /*
         * 玩家赢筹码中的抽水
         * */
        public lGameTax: number;
        /*
         * 玩家最终牌型的排名
         * */
        /*
         * 玩家这局输赢的金币数
         * */
        public lGameScore: number;
        //最总赢筹码数量
        public getScoreCount: number = 0;
        /*
         * 本局下的总游戏币数
         * */
        public lTotalScore: number = 0;
        /*
         * 玩家最后牌型的牌
         * */
        public cbLastCenterCardData: number[] = [];
        /* 牌局中玩家基础数据
         * {"lScore":84273, //游戏币
         * "lGameGold":84273,  //筹码
         * "lInterScore":0,     //钻石
         * "lInsureScore":0,
         * "lMatchScore":0,
         * "dwCoupon":0,
         * "lWinCount":10, //胜场
         * "lLostCount":3, //败场
         * "lDrawCount":0, //平局
         * "lFleeCount":18, //逃跑局
         * "lExperience":198}*/ //玩家等级 base.Utils.getLevel(lExperience)
        public UserScoreInfo: any;
        /**
         * 座位编号，相对于用户自己0号位置
         */
        //国籍
        public userfrom: string = null;
        public get seatID(): number {
            return AppData.getInstance().gameData.getSeatID(this.chairID);
        }
        /**
        * 根据数据源设置数据
        */
        public setData(source: any) {
            var dwUserID = source.dwUserID.toString();
            this.nickName = source.dwUserID == AppData.getInstance().userData.id ? dwUserID : "****" + dwUserID.substring(dwUserID.length - 3, dwUserID.length);
            // this.nickName = dwUserID;
            this.nickName2 = source.nickname;
            this.gender = source.cbGender ? source.cbGender : 0;
            this.vipLevel = source.cbMember || source.dwVIP;
            if (source.dwFortuneCoin == null && !source.UserScoreInfo) {
                this.lTakeMoney = this.money = 0;
            } else {
                this.lTakeMoney = this.money = source.dwFortuneCoin != null ? parseInt(source.dwFortuneCoin) : parseInt(source.UserScoreInfo.lGameGold);
            }
            this.gold = source.dwGold;
            this.ticket = source.dwScore;
            this.avatar = (source.wFaceID % 8);
            this.id = source.dwUserID;
            this.tableID = source.wTableID;
            this.chairID = source.wChairID;
            this.status = source.cbUserStatus;
            this.UserScoreInfo = source.UserScoreInfo;
            let jackList = ["AE", "AU", "CN", "AE", "DE", "FR", "GB", "HK", "ID", "IN", "JP", "KP", "LA", "MM", "MY", "PH", "SA", "SG", "TH", "TW", "UAE", "UN", "US", "VN"]
            this.userfrom = jackList.indexOf(source.userfrom) < 0 ? "UN" : source.userfrom;
        }
        /*
         * 收到用户携带的钱
         * */
        public getPlayerlTakeMoney(data: any) {
            if (this.chairID != null && this.chairID != 65535 && this.chairID == data.wChairID) {
                this.lTakeMoney = data.lTakeMoney;
            }
        }
        /**
         * 游戏开始更新data
         * */
        public setStartData(data: any) {
        }
        /*
         * 断线重连更新Data
         * */
        public onReConnectedData(data: any) {
        }
        /**
         * 操作结束更新data
         * */
        public setOperateOverData(data: any) {
        }
        /**
        * 游戏结束更新data
        * */
        public setGameEndData(data: any) {
        }
        //更新appData自己携带的筹码
        public updataUserDataLTakeMoney(lTakeMoney: number) {
            if (this.id == base.AppData.getInstance().userData.id) {
                base.AppData.getInstance().userData.lTakeMoney = lTakeMoney;
            }
        }
        //判断是否是玩家是否是自己
        public isMyself(): boolean {
            return this.id == AppData.getInstance().userData.id;
        }
    }
}
