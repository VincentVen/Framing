// TypeScript file
enum LDPlayerAction {
    NULL = 0,//无动作
    CALL = 101,//叫地主
    NOCALL = 102,//不叫地主
    GRAB = 103,//抢地主
    NOGRAB = 104,//不抢地主
    NOPLAY = 105,//不出
    OUTPLAY = 106,//任意出牌
    RESTART = 107,//重新开始
}
//游戏状态
enum LDGameStatus {
    GS_WK_CALL_LANDLORD = 100,//叫地主状态
    GS_WK_GRAB_LANDLORD = 101,//抢地主状态
    GS_WK_BRIGHT_CARD = 102,//明牌状态
    GS_WK_PLAYING = 103,//游戏进行
}