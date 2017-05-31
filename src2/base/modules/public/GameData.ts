//游戏信息
class GameData extends how.module.Data {
    //游戏id
    public id: number;
    //游戏id
    public channelID: number;
    //游戏类型
    public type: number;
    //游戏logo
    public logo: string;
    //游戏排序
    public order: number;
    //游戏当前在线人数
    public count: number;
    //游戏状态：0:无 1:火爆 2：最新
    public lable: number;
    //0：正常 1：关闭
    public status: number;
}