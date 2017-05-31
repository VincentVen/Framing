module base {
    /**
     * 用户数据
     * @author none
     *
     */
    export class UserData extends PlayerData {
        /**
         * 帐号
         */
        public accounts: string;
        /**
         * 渠道ID
         */
        public channelID: string;
        /**
        * 会员等级
        */
        public vipLevel: number;

        public constructor() {
            super();
        }
        /**
        * 根据数据源设置数据
        */
        public setData(source: any) {
            super.setData(source);
            this.accounts = source["accounts"];
            this.vipLevel = source["cbMember"];
            this.nickName = this.accounts;
        }
        /**
         * 玩家登录时，设置玩家信息
         */
        public setHallData(source: any) {
            this.accounts = source["account"];
            this.id = source["userID"];
            this.avatar = source["faceID"];
            this.gender = source["sex"];
            this.money = source["score"];
            this.channelID = source["channelID"];
            this.nickName = this.accounts;
        }
    }
}