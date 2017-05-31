/**
 * 房间数据
 * @author none
 *
 */
class RoomData extends how.module.Data {
    /**
     * 游戏类型编号
     */
    public kindID: number;
    /**
     * 编号
     */
    public id: number;
    /**
     * 端口
     */
    public port: number = 0;
    /**
     * 主机
     */
    public host: string = "";
    /**
     * 在线人数
     */
    public onLineCount: number;
    /**
     * 服务器名称
     */
    public name: string;
    /**
     * 底分
     */
    public baseScore: number;
    /**
     * 顶分
     */
    public limitScore: number;
    /**
     * 单位积分,小盲注额度
     */
    public cellScore: number;
    /**
     * 私有房间类型
     */
    public privateType: number;
    /**
     * 换房线，为0时没有限制
     */
    public changeScore: number = 0;
    /**
     * 默认携带
     */
    public takeScore: number;
    /**
     * 最大携带，默认携带的二倍
     */
    public maxTakeScore: number;
    /**
     * 互动表情钱
     */
    public ExpreCost: number;
    /**
     * 前注
     */
    public preScore: number = 0;
    /**
     * 台桌费
     */
    public tableFree: number = 0;
    /**
     * 椅子个数
     */
    public chairCount: number;
    /**
     * 椅子个数
     */
    public tableCount: number;
    /*房间类型*/
    public gameGenre: number;
    /*房间密码*/
    public szTablePass: string = "";
    /*房间密码长度*/
    public cbPassLen: number = 0;

    public static MAX_PLAYER: number = 9;
    public constructor() {
        super();
    }
    /**
     * 根据数据源设置数据
     */
    public setData(source: any) {
        this.kindID = source.kindID;
        this.id = source.wServerID;
        this.port = source.wServerPort;
        this.host = source.dwServerAddr;
        this.onLineCount = source.dwOnLineCount;
        this.name = source.szServerName;
        this.baseScore = source.lBaseScore;
        this.limitScore = source.lLimitScore;
        this.cellScore = source.lCellScore;
    }

    /**
     *  拷贝数据，为快速开始使用
     * @param source
     */
    public cloneData(source: RoomData): void {
        this.kindID = source.kindID;
        this.id = source.id;
        this.port = source.port;
        this.host = source.host;
        this.onLineCount = source.onLineCount;
        this.name = source.name;
        this.baseScore = source.baseScore;
        this.limitScore = source.limitScore;
        this.cellScore = source.cellScore;
        this.changeScore = source.changeScore;
        this.takeScore = source.takeScore;
        this.maxTakeScore = source.maxTakeScore;
    }
}
