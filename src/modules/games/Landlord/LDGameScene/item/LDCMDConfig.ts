/**
 * 斗地主协议
 * @author none
 *
 */
class LDCMDConfig {
    public constructor() {
    }
    /*----------------发送信息-------------------------*/
    public static LD_SEND_CALL_LANDLORD = "17,201";//用户叫地主
    public static LD_SEND_OUT_CART = "17,202";//用户出牌
    public static LD_SEND_PASS_CARD = "17,203";//放弃出牌
    public static LD_SEND_TRUSTEE = "17,204";//托管消息
    public static LD_SEND_BRIGHT_START = "17,205";//明牌开始
    public static LD_SEND_BRIGHT = "17,206";//玩家明牌
    public static LD_SEND_GRAB_LANDLORD = "17,207";//用户抢地主
    public static LD_SEND_REQ_CARDVIVER = "17,208";//请求牌河信息
    /*----------------收到信息-------------------------*/
    public static LD_GET_PLAYER_CARD = "17,300";//收到牌
    public static LD_GET_LAND_SCORE = "17,301";//叫分命令
    public static LD_GET_GAME_START = "17,302";//游戏开始
    public static LD_GET_OUT_CARD = "17,303";//用户出牌
    public static LD_GET_PASS_CARD = "17,304";//放弃出牌
    public static LD_GET_GAME_END = "17,305";//游戏结束
    public static LD_GET_BRIGHT_START = "17,306";//明牌开始
    public static LD_GET_BRIGHT_CARD = "17,307";//玩家明牌
    public static LD_GET_DOUBLE_SCORE = "17,308";//加倍命令
    public static LD_GET_GRAB_LANDLORD = "17,309";//抢地主返回
    // public static LD_GET_RANDOM_TASK = "17,110";//随机任务
    // public static LD_GET_RANDOM_TASK_FINISH = "17,111";//完成随机任务
    public static LD_GET_CARDRIVER = "17,112";//牌河数据
    public static LD_GET_CELL_SCORE = "17,113";//底分变化
    public static LD_GET_USEROFFLINE = "17,115";//用户断线
}
