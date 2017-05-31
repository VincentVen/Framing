class TEBCMDConfig {
	public constructor() {
	}
	/*----------------发送信息-------------------------*/
	public static LD_SEND_CALL_BANKER = "17,202";//用户叫庄
	/*----------------收到信息-------------------------*/
	public static LD_GET_ON_READY = "17,101";//开始准备
	public static LD_GET_CALL_BANKER = "17,102";//开始叫庄
	public static LD_GET_CALL_RET = "17,103";//用户抢庄返回
	public static LD_GET_ON_SCORE = "17,104";//开始下注
	public static LD_GET_DICE_RESULT = "17,105";//摇骰子结果
	public static LD_GET_OPEN_CARD = "17,106";//开牌结果
	public static LD_GET_GAME_START = "17,107";//游戏结束
	public static LD_GET_PLAYER_EXIT = "17,108";//用户退出
}