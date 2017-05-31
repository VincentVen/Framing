/**
 * 命令配置，用中文作为是方便维护，目前测试下来没任何副作用
 * @author none
 *
 */
class CMDConfig {
    public constructor() {
    }
    /*----------------收到信息-------------------------*/
    public static GET_TASK_ACHIEVEMENT = "14,200";//收到任务成就活动
    public static GET_TASK_GET_TYPE = "14,201";//收到领取任务后的状态
    public static GET_GET_TASK_AWARD = "201,108";//收到领取任务奖励
    public static GET_GOAL_COMPLETE = "201,109";//全局目标达成推送
    public static GET_DOLE_INFO = "201,113";//救济金信息
    public static GET_LOGINFAILURE = "18,101";
    // public static GET_LOGINSUCESS = "18,100"; //收到登录成功
    public static GET_SESSIONID = "18,105";
    // public static GET_LASTSERVERID = "18,106";//获取最后的服务器判断是否需要断线重连
    public static GET_ROOMCONFIG = "9,100";
    public static GET_BATTLEINFO = "21,204";

    public static GET_CHANGESERVER_SUCESS = "100,100";
    public static GET_CHANGESERVER_ERROR = "100,101";
    public static GET_ENTERGAME_ERROR = "7,101";
    public static GET_ENTERGAME_COMPLETE = "7,102";
    public static GET_PLAYER_ENTER = "8,100";
    public static GET_STATUS_CHANGE = "8,101";
    public static GET_SIT_ERROR = "8,103";
    public static GET_ROOM_CONFIG = "9,100";//收到房间配置
    public static GET_GAMESTART = "17,100";
    public static GET_GAMESTARTTIME = "17,200";
    public static GET_GAMEEND = "17,104";
    public static GET_LOOKCARDS = "17,106";//收到看牌消息
    public static GET_MAINACCESSORYPOOL = "17,109";//主边池信息
    public static GET_POOLTOPLAYER = "17,110";//结束时主边池对应座位号
    public static GET_COMPARECARD = "17,105";//收到比牌
    public static GET_PLAYER_TAKEMONEY = "17,105";//收到用户该局所携带的钱
    public static GET_ROUNDOVER = "17,108";//收到轮次结束
    public static GET_FRIEND_INFO = "21,204";//收到好友详细信息
    public static GET_FRIEND_LIST = "208,101";//收到好友列表返回*
    public static GET_FRIEND_ADD = "208,102";//收到添加好友*
    public static GET_AGREE_ADD_FRIEND = "208,103";//收到同意添加好友*
    public static GET_REFUSE_ADD_FRIEND = "208,104";//收到拒绝添加好友
    public static GET_DELETE_FRIEND = "208,105";//收到删除好友
    public static GET_FRIEND_GAMEMONEY = "208,106";//收到赠送游戏币结果*
    public static GET_SEARCH_PLAYER = "208,107";//收到根据ID或昵称返回的好友*
    public static GET_FRIEND_APPLYFOR_LIST = "208,108";//好友申请列表*
    public static GET_FRIEND_SEND_ONLINE_CHAT = "208,109";//收到发送聊天成功返回
    public static GET_FRIEND_CHAT_LIST = "208,110";//*
    //    public static 收到赠送筹码返回 = "208,111";
    public static GET_FRIEND_ONLINE_CHAT = "208,112";//收到好友即时聊天信息
    public static GET_FRIEND_BE_FRIEND = "208,114";//申请的陌生人成为好友*
    public static GET_FRIEND_REQUEST = "208,113";//收到主动推送的申请好友请求*

    public static GET_GAMECONFIG = "23,100";//断线重连所需，给23,101使用；正常游戏时，桌子状态
    public static GET_GAMESTATUS = "23,101";//断线重连和获取金币所用；正常游戏时候，桌子信息
    // public static GET_SYSMESSAGE = "23,300";//系统消息
    public static GET_REFRESH_USERINFO = "21,101";
    public static GET_HEGUAN = "17,153";//收到荷官打赏
    public static GETSNGPLAYER_IN = "43,113";//SNG收到玩家进入
    public static GET_SNG_RANK = "43,108";
    public static GET_ACTIVITY = "201,112";//获取活动引导
    public static GET_DAYRANK_LIST = "201,101";//获取日盈里排行
    public static GET_CHANGE_ROOM_INFO = "209,102";
    public static GET_GAMELIST = "250,105";//收到游戏列表
    /*----------------发送信息-------------------------*/
    public static SEND_GAMELIST = "250,5";//请求游戏列表
    public static SEND_DAYRANK_LIST = "201,1";//获取日盈利榜
    public static SEND_ACTIVITY = "201,12";//请求活动引导
    public static SEND_DOLE_REQUEST = "201,13";//请求救济金
    public static SEND_HEGUAN = "17,53";//发送荷官打赏
    public static SEND_REFRESH_USERINFO = "21,1";
    public static SEND_LOGIN_GAMESERVER = "7,11";
    public static SEND_REGIST = "18,3";
    public static SEND_SESSIONID = "18,5";
    public static SEND_LOGIN = "18,11";
    public static SEND_SELECTBATTLEINFO = "21,203";
    public static SEND_TASK_ACHIEVEMENT = "14,100";//发送查询任务成就活动
    public static SEND_GET_TASK_AWARD = "201,8";//发送领取任务奖励
    public static SEND_GET_TASK_START = "201,9";//获取任务状态
    public static SEND_GET_TUTORIAL_REWARD = "201,10";//发送领取新手教程奖励
    public static SEND_CHANGESERVER = "100,1";//发送切换服务器
    public static SEND_FRIEND_INFO = "21,203";//发送好友详细信息
    public static SEND_FRIEND_LIST = "208,1";//好友列表
    public static SEND_FRIEND_ADD = "208,2";//发送添加好友
    public static SEND_AGREE_ADD_FRIEND = "208,3";//发送同意添加好友
    public static SEND_REFUSE_ADD_FRIEND = "208,4"; //发送拒绝添加好友
    public static SEND_DELETE_FRIEND = "208,5";//发送删除好友
    public static SEND_FRIEND_GAMEMONEY = "208,6";//发送赠送游戏币
    public static SEND__SEARCH_PLAYER = "208,7";//发送根据ID或昵称搜索好友
    public static SEND_FRIEND_APPLYFOR_LIST = "208,8";// 请求申请列表
    public static SEND_FRIEND_ONLINE_CHAT = "208,9";//发送好友聊天
    public static SEND_FRIEND_CHAT_LIST = "208,10";
    public static SEND_JPUSHREGId = "202,1";//把激光推送id和玩家id绑定在一起
    public static SEND_GET_CHANGE_ROOM_INFO = "209,2";//达到换房线获取目标房信息
    //    public static 发送赠送筹码 = "208,11";
    public static SEND_SIT = "8,1";
    public static SEND_LOOK_SIDE = "8,2";//发送旁观
    public static SEND_STANDUP = "8,3";//发送起立
    public static SEND_LEAVE_GAME = "8,4";//发送离开游戏
    public static SEND_LEAVE_ROOM = "8,5";//发送离开房间
    public static SEND_SYNTABLE = "23,1";//同步牌桌
    public static SEND_READY = "23,2";
    public static SEND_TALK_MESSAGE = "23,200";//发送聊天消息

    /*---------------------------------MTT消息处理------------------------*/
    public static SEND_GET_MTT_TIME = "43,2";//发送查询MTT比赛开赛时间
    public static GET_MTT_START_TIME = "43,102";//收到MTT比赛开赛时间
    public static SEND_MATCH_SIGNUP = "43,1";//发送比赛报名
    public static GET_SIGNUP_RESULT = "43,101";//收到报名反馈
    public static SEND_MTT_CANCEL_SIGNUP = "43,3";//发送取消MTT报名
    public static SEND_MTT_ADD_RE_BUY = "43,6";//获取能否加买或者重买筹码消息
    public static GET_MTT_ADD_RE_BUY = "43,106";//第一次游戏时的身上携带的筹码数，当小盲注额度小于初始额度时可以重买，当小盲注额度为多少时 可以加买
    public static GET_MATCH_BLIND_CHANGE = "43,100";//盲注改变提示
    public static GET_MATCH_RESULT = "43,104";//收到比赛结束
    public static GET_MTT_START = "43,111";//收到MTT比赛开始
    public static GET_MTT_UPDATA_ITEM = "43,114";//推送当前某比赛参赛人数和开始日期，剩余开始时间的
    public static GET_MTT_AUTO_EXIT = "43,115";//自动退赛通知
    public static SEND_MTT_BUY_CHIP = "43,7";//购买筹码
    public static GET_MTT_BUY_CHIP = "43,107";//购买筹码返回
    public static SEND_MTT_RANK = "43,10";//发送MTT排名
    public static GET_MTT_RANK = "43,110";//获取MTTGET排名
    public static SEND_SELECT_MATCH_INFO = "43,9";//发送获取比赛大致信息
    public static GET_SELECT_MATCH_INFO = "43,109";//获取比赛大致信息
    public static SEND_SELECT_MATCH_RANK = "43,10";//发送查询MTT排名
    public static GET_SELECT_MATCH_RANK = "43,110";//获取查询MTT排名
    //    /*----------------游戏差异化收到信息-------------------------*/
    public static GET_OPERATE = "17,101";//收到操作结果
    public static GET_QIPAI = "17,102";//收到弃牌
    public static GET_CARDS = "17,103";//收到发牌
    public static GET_SHOWCARDS = "17,107";//收到亮牌发牌
    public static GET_IN_GAME_GOLD_CHANGE = "8,102";//收到金币改变
    //    /*----------------游戏差异化发送信息-------------------------*/
    public static SEND_CALL_CHIP = "17,1";//发送让牌或者跟注
    public static SEND_QIPAi = "17,2";//发送弃牌
    public static SEND_COMPARECARD = "17,3";//发送比牌
    public static SEND_LOOKCARDS = "17,4";//发送看牌
    public static SEND_SHOWCARDS = "17,7";//发送亮牌
    //    /*----------------商城购买信息-------------------------*/
    public static SEND_BUY_GOODS = "203,3";//发送购买道具
    public static GET_BUY_RESULT = "203,103";//收到购买结果
    public static GET_TOOL_UPDATA = "39,555";//上线发一次我的道具列表
    public static GET_PROPRESOURCE = "203,102";//获取我的道具列表
    public static GET_SHOP_PROPLIST = "203,101";//获取商品道具列表
    public static SEND_USE_MYPROP = "203,4";//使用的我道具
    public static GET_USE_MYPROP = "203,104"//返回使用道具
    //    /*----------------道具列表信息-------------------------*/
    public static SEND_PROPLIST = "203,2";//请求我的道具列表
    public static SEND_SHOP_PROPLIST = "203,1";//获取商品列表

    // /*----------------结算信息----------------------------*/
    // public static 发送昨日结算请求 = "204,1";
    // public static 收到昨日结算 = "204,101";

    // /*----------------排行列表信息-------------------------*/
    // public static 发送获取排行榜信息 = "21,200";
    // public static 接收获取排行榜信息 = "21,201";
    //    /*----------------发送喇叭信息-------------------------*/
    public static SEND_TRUMPET_MESSAGE = "39,504";//发送喇叭信息
    //    /*----------------游戏场景礼物交互-------------------------*/
    public static SEND_MAGIC_FACE = "17,52";//发送魔法表情
    public static GET_MAGIC_FACE = "17,152";//收到魔法表情
    // public static 发送场景礼物 = "17,50";
    // public static 收到场景礼物 = "17,150";
    // /*----------------游戏场景邀请好友游戏-------------------------*/
    // public static 发送游戏场景邀请好友 = "8,301";
    /*----------------------大转盘消息----------------------------------*/
    public static SEND_TURNTABLE = "206,2";
    public static GET_TURNTABLE = "206,102";
    public static SEND_EVERYDAYTASK = "201,3";//发送连续登陆任务
    public static GET_EVERYDAYTASK = "201,103";//收到连续登陆任务
    public static SEND_SELECT_REWARDLIST = "201,7";//查询转盘奖励列表
    public static GET_SELECT_REWARDLIST = "201,107";//查询转盘奖励列表
    /*----------------------猜三张消息----------------------------------*/
    public static SEND__BETTINGSCORE = "8,230";//查询下注情况和下注
    public static GET__BETTINGSCORE = "8,231";//下注成功和查询返回
    public static SEND__CANCLEBETTINGSCORE = "8,240";//取消下注
    public static GET__CANCLEBETTINGSCORE = "8,241";//取消下注返回
    public static GET__CSZRESULT = "17,113";//猜三张开奖
    public static SEND__CSZRECORD = "202,9";//请求猜三张记录
    public static GET__CSZRECORD = "202,109";//猜三张记录返回
    /////////////////////////////兑换面板消息
    public static SEND_EXCHANGE_TYPE = "205,1";//获取兑换类型
    public static GET_EXCHANGE_TYPE = "205,101";//返回兑换类型
    public static SEND_EXCHANGE_TP_LIST = "205,2";//获取指定兑换分类物品列表
    public static GET_EXCHANGE_TP_LIST = "205,102";//返回指定分类物品列表
    public static SEND_EXCHANGE_MY_LIST = "205,3";//获取获奖列表
    public static GET_EXCHANGE_MY_LIST = "205,103";//返回获奖列表
    public static SEND_EXCHANGE_SVAE_ADDRESS = "205,4";//获取指定用户地址
    public static GET_EXCHANGE_SVAE_ADDRESS = "205,104";//返回指定用户地址
    public static SEND_EXCHANGE_UPDATE_ADDRESS = "205,5";//获取修改指定用户地址
    public static GET_EXCHANGE_UPDATE_ADDRESS = "205,105";//返回修改指定用户地址
    public static SEND_EXCHANGE_GOODS = "205,6";//获取兑换物品
    public static GET_EXCHANGE_GOODS = "205,106";//返回兑换物品
    public static SEND_EXCHANGE_LOG_LIST = "205,7";//获取兑换物品
    public static GET_EXCHANGE_LOG_LIST = "205,107";//返回兑换物品


    /*-------------------------------邮件消息----------------------------*/
    public static SEND_MAIL_GETPROP = "207,1";//发送领取道具
    public static GET_MAIL_GETPROP = "207,101";//返回领取道具
    public static SEND_MAIL_LIST = "207,2";//发送邮件列表
    public static GET_MAIL_LIST = "207,102";//返回邮件列表
    public static SEND_MAIL_LOOKOVER = "207,3"//发送查看列表
    /*-------------------------------VIP房消息----------------------------*/
    public static SEND_REQUEST_CREATE_VIP_ROOM_INFO = "9,6";//请求创建VIP房间
    public static SEND_REQUEST_VIP_ROOM_LIST = "9,7";//请求VIP房间列表
    public static GET_REQUEST_VIP_ROOM_LIST = "9,107";//获得VIP房间列表
    public static GET_REQUEST_VIP_ROOM = "9,106";//获得VIP房间
    /*-------------------------------CD-KEY----------------------------*/
    public static SEND_CD_KEY = "210,1";//CD-KEY发送
    public static GET_CD_KEY = "210,101";//CD-KEY返回
    /*-------------------------------修改密码---------------------------*/
    public static SEND_ALFTER_CODE = "21,105";//发送修改密码
    public static GET_ALFTER_CODE = "21,202";//收到修改密码
    /*-------------------------------支付相关---------------------------*/
    public static GET_PAY_RESULT = "39,1000";//支付成功返回 {"orderId":11960,"nPropertyID":101}
    public static GET_PAY_TMP_RESULT = "39,555";//支付返回（作用未知） {"num":0,"data":[]}
    /*------------------------------第三方登陆回调-------------------------*/
    public static APP_THIRDPARTYLOGINWBS = "app_ThirdPartyLoginWBS";
    /*------------------------------兼容性登录-------------------------*/
    public static SEND_MAC_IMEI_LOGIN = "250,2";
    public static GET_MAC_IMEI_LOGIN = "250,102";
    /*------------------------------钻石兑换游戏币-------------------------*/
    public static SEND_DIAMOND_TO_MONEY = "203,8";
    public static GET_DIAMOND_TO_MONEY = "203,108";
    /*------------------------------免费领奖中的VIP奖励特殊处理-------------------------*/
    public static GET_FREE_VIP_INFO = "201,106";//免费领奖中的VIP奖励特殊处理
    public static SEND_FREE_VIP_INFO = "201,6";//免费领奖中的VIP奖励特殊处理
    /*------------------------------福吧绑定公众号消息-------------------------*/
    public static SEND_FUBA_BIND = "211,4";//绑定公众号
    /*------------------------------游戏场中买筹码消息-------------------------*/
    public static SEND_BUY_CHIP = "8,220";
    public static GET_BUY_CHIP = "8,221";
    /*------------------------------心跳包-------------------------------------*/
    public static SEND_HEARTBEAT1 = "1,0";
    public static SEND_HEARTBEAT2 = "0,1";


    /*------------------------------大厅数据-------------------------------------*/
    public static SEND_GAME_CONFIG = "30,0";//获取大厅数据
    public static GET_GAME_CONFIG = "30,100";//接收大厅数据
    public static GET_GAME_LIST = "30,102";//接收游戏数据
    public static GET_GAME_ERROR = "0,102";//接受游戏大厅错误信息
    /*------------------------------公告----------------------------------------*/
    public static GET_NOTICE_CHANGE = "0,101";//接收公告数据
    public static GET_NOTICE_MSG = "30,103";//接收公告数据
    public static GET_SYSMESSAGE = "23,300";//系统消息
    /*------------------------------更换头像-------------------------------------*/
    public static SEND_CHANGEPERSONALDATA = "31,0";
    public static GET_CHANGEPERSONALDATA = "31,100";
    /*------------------------------金币更新----------------------------------------*/
    public static SEND_UPDATE_MONEY = "31,2";
    public static GET_UPDATE_MONEY = "31,102";
    /*------------------------------进入游戏---------------------------------------*/
    public static SEND_GAME_ENTER = "30,1";//请求进入游戏
    public static GET_GAME_ENTER = "30,101";//进入游戏
    public static GET_LASTSERVERID = "18,106";//收到最后一次登陆服务器id
    public static GET_LOGIN_SUCCESS = "18,100";//登录成功
    /*------------------------------房间大厅数据-------------------------------------*/
    public static SEND_ROOMLIST = "250,6";//请求房间大厅数据
    public static GET_ROOMLIST = "19,103";//收到房间大厅数据
    public static GET_ROOMDATA_COMPLETE = "19,104";//数据加载完成
    public static GET_LOGINCOMPLETE = "18,102";//登录完成
    /*------------------------------退出游戏---------------------------------------*/
    public static SEND_GAME_QUIT = "18,7";//请求退出游戏
    public static SEND_GAME_QUIT_SUCCESS = "18,107";//请求退出游戏
    /*------------------------------获取玩家列表-------------------------------------*/
    public static SEND_PLAYERList = "18,4";
    public static GET_PLAYERList = "18,104";
    /*------------------------------获取玩家国籍-------------------------------------*/
    public static SEND_USERFROM = "202,6";//获取玩家国家
    public static GET_USERFROM = "202,106";//收到玩家国籍
    /*------------------------------获取游戏记录-------------------------------------*/
    public static SEND_GAMERECORD = "202,5";//请求游戏记录
    public static GET_GAMERECORD = "202,105";//收到游戏记录
    /*------------------------------获取游戏场玩家信息-------------------------------------*/
    public static SEND_USERINFO = "202,8";//请求游戏场玩家信息
    public static GET_USERINFO = "202,108";//收到游戏场玩家信息
    /***********************************************************************************************************/
}
