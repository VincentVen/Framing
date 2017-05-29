/**
 * 语言配置
 * @author none
 *
 */
class LanguageConfig {
    public constructor() {
    }
    public static frequencyBntText = "不限";
    public static caiSanZhangFrequencyLabel1 = "买入次数";
    public static caiSanZhangFrequencyLabel2 = "剩余次数";
    public static caiShanZhangTip: string = "猜三张下注成功，祝您好运！";
    public static caiShanZhangUnlimited: string = "不限";
    public static nosendChatmessage: string = "亲，游戏过程中才能使用聊天功能哦~";
    public static noDashangTip: string = "亲，游戏过程中才能进行打赏哦~";
    public static screenfullTip: string = "部分浏览器可能无法开启全屏模式或全屏后显示异常，如果遇到以上问题，请使用浏览器自带的全屏功能！";
    //游戏大厅通告
    public static announcement: string = " ";
    // public static announcement: string = "欢迎来到全球最大的线上棋牌彩游戏中心，我们将为您提供最真实公平的游戏环境，祝您赢钱多多！快乐多多！";
    //游戏大厅服务器返回错误码
    public static hall_error_100 = "该游戏暂时无法进入，请稍后重试，给您带来不便敬请谅解！";
    public static hall_error_1 = "TOKEN丢失";
    public static hall_error_2 = "渠道不存在";
    public static hall_error_3 = "验证时间超时";
    public static hall_error_4 = "验证错误";
    public static hall_error_5 = "渠道白名单错误";
    public static hall_error_6 = "验证字段丢失";
    public static hall_error_7 = "您的连接已过期，请重新登录";
    public static hall_error_8 = "不存在的请求";
    public static hall_error_10 = "玩家同时在多款游戏中";
    public static hall_error_11 = "玩家账号不存在";
    public static hall_error_12 = "玩家账号在渠道中不存在";
    public static hall_error_13 = "玩家登录账号不匹配";
    public static hall_error_14 = "玩家正在游戏中";
    public static hall_error_15 = "渠道验证错误";
    public static hall_error_16 = "数据不存在";
    public static hall_error_17 = "游戏返回码不存在";
    public static hall_error_18 = "取出金额和订单号金额不一致,订单号: ";
    public static hall_error_19 = "游戏金额与订单金额不一致，订单号: ";
    public static hall_error_1016 = "账号禁用";
    public static hall_error_20 = "您的账号暂时处于封停状态，如有疑问请联系平台在线客服了解详情！";
    public static hall_error_21 = "账号被踢";
    public static hall_error_1001 = "注册会员账号系统异常";
    public static hall_error_1002 = "注册会员账号系统异常";
    public static hall_error_1003 = "代理商金额不足";
    public static hall_error_1004 = "玩家大厅上分/下分异常";
    public static hall_error_1005 = "玩家登录游戏上分异常";
    public static hall_error_1006 = "会员金额不足";
    public static hall_error_1007 = "会员游戏上分/下分异常";
    public static hall_error_1008 = "玩家登出游戏下分异常";
    public static hall_error_1009 = "上下分出现负数(非法值)";
    public static hall_error_130 = "字段不正确";
    public static hall_error_131 = "渠道不正确";
    public static hall_error_132 = "操作超时";
    public static hall_error_133 = "验证未通过";
    public static hall_error_134 = "请求数据为空";
    public static hall_error_135 = "账号注册失败";
    public static hall_error_136 = "游戏中不可取钱";
    public static hall_error_137 = "取钱超出";
    public static hall_error_138 = "订单号不存在";
    // 130,131,132,133,134,135,136,137,138
    //诈金花 start
    public static dizhu: string = "底注：{0}";
    public static jinru1: string = "进入：{0}-{1}";
    public static jinru2: string = "进入：{0}";
    public static nogongneng: string = "该功能正在建设中，敬请期待！";
    public static getRankFail: string = "获取排名失败，请稍后再试";
    public static reward: string = "{0}游戏币";
    public static zhu: string = "底注：{0}  单注上限：{1}";
    public static lun: string = "轮数：{0}/{1}";
    public static discardTitle = "系统提示";
    //诈金花 end
    public static faceEffectTip = "互动表情每次消耗{0}场外游戏币";
    public static dashangTip = "打赏荷官会消耗一定数量筹码，房间不同打赏费用不同，本次打赏将消耗{0}筹码。";
    public static resumeGameSetTimeOutLabel = "{0}秒后自动继续游戏";
    public static noGameRecord = "暂无牌局记录";
    public static qianzhuTipLabelText = "本房间前注：{0}";
    public static heguanSay0 = "祝您发大财！";
    public static heguanSay1 = "玩牌时要正经点哦！";
    public static heguanSay2 = "我看好你哟！";
    public static resumeGameButtonLabel = "继续匹配";
    public static SettingWindowTextMusic = "音乐";
    public static SettingWindowTextSound = "音效";
    public static SettingWindowCloseTextMusic = "音乐开关";
    public static SettingWindowCloseTextSound = "音效开关";
    public static htlpTabBarText = [
        { label: "基本玩法", iconDown: "help_tabar1_1_png", iconUp: "help_tabar1_0_png", iconDownBg: "help_tabarBg_0_png", scaleX: "1" },
        { label: "游戏操作", iconDown: "help_tabar2_1_png", iconUp: "help_tabar2_0_png", iconDownBg: "help_tabarBg_1_png", scaleX: "1" },
        { label: "牌型说明", iconDown: "help_tabar3_1_png", iconUp: "help_tabar3_0_png", iconDownBg: "help_tabarBg_1_png", scaleX: "1" },
        { label: "功能键说明", iconDown: "help_tabar4_1_png", iconUp: "help_tabar4_0_png", iconDownBg: "help_tabarBg_0_png", scaleX: "-1" }
    ];
    public static chognshilian = "重新登陆";
    public static actionTimeout = "由于您长时间未执行任何操作，系统已将您断开连接，请重新登陆！";
    public static connectedLabel = "连接中";
    public static chognshiLabel = "重试";
    public static loginErrorTip = "登陆游戏失败,请检查您的网络连接后重试";
    public static autoGenzhuLabel = "自动让牌";
    public static noNetworkTip = "网络连接故障，您可能尚未连接网络，请检查网络连接后重试！";
    public static reConnectedTip = "网络断开，正在进行第{0}次重连...";
    public static connectClose = "网络连接故障，请检查网络连接后重试";
    public static pipeiTip = "正在为您匹配牌桌\n\n游戏即将开始，请耐心等待";
    public static qianzhuTip = "1、除了大小盲注外，所有玩家在牌局开始后会自动下{0}前注。\n2、前注进入池子后不会退还。\n3、下注顺序和牌局规则与普通房相同。";
    public static qianzhuTip2 = "1、除了大小盲注外，所有玩家在牌局开始后会自动下一定数额的筹码作为前注。\n2、前注进入池子后不会退还。\n3、下注顺序和牌局规则与普通房相同。";
    public static qipaiTip = "您确定要弃牌吗？";
    public static allinTip = "您确定要Allin吗？";
    public static matchSignUpError = "游戏币不足，报名失败！";
    public static friendGiveGold = "赠送好友游戏币成功";
    public static pairPlusTip = "（前注：{0}）";
    public static waitNextFrame = "等待下一局";
    public static buyScoreFailure = "增加筹码时，目标携带不能小于当前牌桌现有筹码!";
    public static buyScoreSuccessTakeEffect = "系统已将您筹码增加至{0}，祝您赢钱多多!";
    public static buyScoreSuccess = "筹码增加成功,下局生效!";
    public static victoryUILabel = "赢";
    public static theCardBeforeEffectLabel = "比牌前赢";
    public static operateUILabel = "思考中";
    public static ALERT_DEFAULT_TITLE = "提   示";
    public static ALERT_DEFAULT_BUTTON_CONFIRM_LABEL = "确   定";
    public static ALERT_DEFAULT_BUTTON_CANCEL_LABEL = "取   消";
    public static cantChat = "旁观时无法聊天或使用互动表情";
    public static loadProgress = "游戏资源加载中，请稍候：{0} ，第{1}/{2}";
    public static loginFailed = "登录失败，帐号或密码错误";
    public static loginFailed_53 = "您的账号登录错误次数超过系统限制上限，锁定10分钟";
    public static editUserInfoFailure = "修改个人资料失败";
    public static editUserInfoSucess = "修改个人资料成功";
    public static mangzhu = "盲注：{0}/{1}";
    public static friendCellmangzhu = "{0}/{1}";
    public static getMatchRoomFailed = "获取比赛房间列表失败";
    public static roomIsNowClosed = "房间正在维护";
    public static nomoney = "游戏币不足，匹配失败，请充值后继续游戏！";
    public static notable = "桌子爆满，已经没有空的位置了";
    public static giveup: string = "弃牌";
    public static pass: string = "让牌";
    public static raise: string = "加注";
    public static call: string = "跟注";
    public static callNum: string = "跟注{0}";
    public static allin: string = "Allin";
    public static dichi: string = "底池：{0}";
    public static damangzhu: string = "大盲注";
    public static xiaomangzhu: string = "小盲注";
    public static genzhuButtonText1 = "让牌";
    public static genzhuButtonText2 = "AllIn";
    public static cardType0: string = "未知";
    public static cardType1: string = "散牌";
    public static cardType2: string = "对子";
    public static cardType3: string = "两对";
    public static cardType4: string = "三条";
    public static cardType5: string = "顺子";
    public static cardType6: string = "同花";
    public static cardType7: string = "葫芦";
    public static cardType8: string = "四条";
    public static cardType9: string = "同花顺";
    public static cardType10: string = "皇家同花顺";
    public static playerShowID: string = "ID：{0}";
    public static onBackButtonTip: string = "确定要退出游戏吗？";
    public static onBackButtonPlayerisGaming: string = "游戏中禁止退出，请先弃牌后再退出！";

    //普通房字数
    public static minMaxTake: string = "准入：{0}";
    public static smallBigBlind: string = "盲注：{0}/{1}";
    public static preScoreText: string = "前注：{0}";
    public static minMaxMoney: string = "准入：";
    //提示出牌文字
    public static discardMsg = "轮到您操作了！";

    public static error_0: string = "未知错误";
    public static error_1: string = "操作成功";
    public static error_2: string = "数据库操作错误";
    public static error_3: string = "头像没有付费";
    public static error_4: string = "购买的道具不存在";
    public static error_5: string = "游戏币或筹码不足";
    public static error_6: string = "喇叭不足，请先购买";
    public static error_7: string = "二级货币不够";
    public static error_8: string = "道具不能赠送vip";
    public static error_9: string = "踢人必须是vip用户";
    public static error_10: string = "玩家正在游戏不能踢";
    public static error_11: string = "玩家跟我不在同一桌子";
    public static error_12: string = "玩家不在线";
    public static error_13: string = "用户等级升级，奖励2000游戏币";
    public static error_14: string = "此游戏桌已经解散！";
    public static error_15: string = "{0}断线了，请耐心等待90秒。";
    public static error_16: string = "为了不影响比赛选手比赛，旁观的用户禁止发言！";
    public static error_17: string = "您暂时没有发送房间消息的权限，只能与管理员私聊！";
    public static error_18: string = "抱歉，本游戏房间不允许发送聊天信息！";
    public static error_19: string = "对不起，此房间不可以踢人！";
    public static error_20: string = "请注意，游戏房间即将关闭或者不允许玩家进入，请您离开游戏桌子！";
    public static error_21: string = "{0}使用了[双倍积分卡]，得分翻倍！";
    public static error_22: string = "{0}使用了[四倍积分卡]，得分翻四倍！";
    public static error_23: string = "{0}使用了[护身符卡]，积分不变";
    public static error_24: string = "亲爱的用户，欢迎您来到德州扑克比赛游戏房间，祝比赛选手赛出水平，取得好的成绩！";
    public static error_25: string = "亲爱的用户，欢迎您来到德州扑克普通场，欢迎您多提宝贵建议！";
    public static error_26: string = "请注意，您设置了允许所有玩家观看您游戏。";
    public static error_27: string = "抱歉，由于系统维护的原因，本游戏房间不允许任何玩家登录进入！";
    public static error_28: string = "抱歉，游戏房间已经满，无法加入！";
    public static error_29: string = "您的游戏币超过本房间的最大限制额度，请更换游戏房间！";
    public static error_30: string = "设置用户权限失败！";
    public static error_31: string = "您的账号在其它地方登录，如果这不是您本人操作，那么您的密码很可能已经泄露！";
    public static error_32: string = "抱歉，您被管理员踢出房间，若有任何疑问，请联系游戏客服！";
    public static error_33: string = "您好，您拥有的游戏币不在本房间设定的范围，请进入对应的房间游戏，谢谢！";
    public static error_34: string = "抱歉，您的帐号被冻结了，若有任何疑问，请联系游戏客服！";
    public static error_35: string = "您被{0}踢离房间了";
    public static error_36: string = "比赛结束，返回大厅！";
    public static error_37: string = "恭喜您获得游戏币{0}";
    public static error_38: string = "恭喜您获得钻石{0}";
    public static error_39: string = "踢人成功，扣除踢人卡1张";
    public static error_40: string = "比赛类型错误";
    public static error_41: string = "比赛用户不存在";
    public static error_42: string = "比赛当前不可重买筹码";
    public static error_43: string = "非常抱歉，您重买筹码的次数已达到上限，无法重新购买。";
    public static error_44: string = "非常抱歉，您的筹码数量超过基础筹码数，无法重新购买。";
    public static error_45: string = "比赛当前不可加购筹码";
    public static error_46: string = "比赛加购筹码达到上限";
    public static error_47: string = "恭喜您额外获得游戏币{0}";
    public static error_48: string = "由于数据库操作异常，请您稍后重试或选择另一服务器登录！";
    public static error_49: string = "抱歉地通知您，系统禁止了您所在的 IP 地址的登录功能，请联系客户服务中心了解详细情况！";
    public static error_50: string = "抱歉地通知您，系统禁止了您的机器的登录功能，请联系客户服务中心了解详细情况！";
    public static error_51: string = "您已经在游戏房间，不能进入当前游戏房间！";
    public static error_52: string = "您的账号由于长时间未登录游戏已被封存，请联系客服人员开通！";
    public static error_53: string = "您的账号登录错误次数超过系统限制上限，锁定10分钟！";
    public static error_54: string = "您的帐号不存在或者密码输入有误，请查证后再次尝试登录！";
    public static error_55: string = "您已绑定游客账号，请使用账号登录或关闭本窗口使用其他方式登录";
    public static error_56: string = "账号禁止";
    public static error_57: string = "帐号关闭";
    public static error_58: string = "牌桌玩家已满，请稍后重试或更换牌桌";
    public static error_59: string = "你正在桌上游戏，暂时不能离开位置！";
    public static error_60: string = "本房间限制了旁观游戏!";
    public static error_61: string = "暂时没有能够加入的比赛，请稍后！";
    public static error_62: string = "抱歉，你没有进行旁观游戏的权限，若需要帮助，请联系游戏客服咨询！";
    public static error_63: string = "该房间正在维护中，请稍后重试，您还可以选择其它房间进行游戏。";
    public static error_64: string = "抱歉，此游戏桌现在不允许玩家进入！";
    public static error_65: string = "密码错误，不能加入游戏！";
    public static error_66: string = "服务器正在维护中，请稍候重试!";
    public static error_67: string = "抱歉，此游戏桌现在不允许玩家进入！";
    public static error_68: string = "椅子已经被其他玩家捷足先登了，下次动作要快点了！";
    public static error_69: string = "游戏已经开始了，暂时不能进入游戏桌！";
    public static error_70: string = "您因存在非法行为，账号已被封停，如需申述请联系官方客服！";
    public static error_71: string = "游戏币不足，请赶快充值！";
    public static error_72: string = "游戏币不足，无法加入房间，请充值！";
    public static error_73: string = "您的游戏币超过本房间的最大限制额度，请切换游戏房间！";
    public static error_74: string = "您的游戏币太少，请选择其他房间进行游戏！";
    public static error_75: string = "您的游戏币超出本房间限制，请选择其他房间进行游戏！";
    public static error_76: string = "本房间没有适合您的座位。";
    public static error_77: string = "你的逃跑率太高，与当前牌桌的设置的不符，不能加入游戏！";
    public static error_78: string = "你的胜率太低，与当前牌桌的设置不符，不能加入游戏！";
    public static error_79: string = "你的积分太高，与当前牌桌的设置不符，不能加入游戏！";
    public static error_80: string = "你的积分太低，与当前牌桌的设置不符，不能加入游戏！";
    public static error_81: string = "本房间设置了相同IP不可坐在同一桌，请选择其它坐位！";
    public static error_82: string = "你设置了不跟相同 IP 地址的玩家游戏，此游戏桌存在与你 IP 地址相同的玩家，不能加入游戏！";
    public static error_83: string = "坐下的桌子盲注错误";
    public static error_84: string = "昵称不合法请修改";
    public static error_135: string = "进入房间失败，禁止同IP多个账号同时进入该房间！";
    public static error_1001: string = "任务奖励已经领取过了";
    public static error_1002: string = "任务出错了";
    public static error_1003: string = "任务未完成";
    public static error_1013: string = "道具不存在";
    public static error_1014: string = "道具支付类型错误";
    public static error_1015: string = "道具支付创建订单错误";
    public static error_1016: string = "游戏中不允许赠送游戏币";
    public static error_1017: string = "支付订单道具不存在错误";
    public static error_1020: string = "添加好友已经存在";
    public static error_1021: string = "已经邀请过该好友";
    public static error_1022: string = "添加好友同意不存在";
    public static error_1023: string = "今天已经发送过礼物了";
    public static error_1024: string = "今天发送礼物超过限制了";
    public static error_1025: string = "今天好友接收礼物超过限制了";
    public static error_1026: string = "好友赠送的免费游戏币不存在";
    public static error_1027: string = "好友赠送的免费游戏币已经被领取过";
    public static error_1028: string = "好友赠送的免费游戏币-与应该领取的用户不匹配";
    public static error_1029: string = "赠送游戏币数量大于用户账户总游戏币数";
    public static error_1030: string = "用户错误";
    public static error_1031: string = "比赛不存在";
    public static error_1032: string = "比赛已经报名";
    public static error_1033: string = "比赛报名等级不足";
    public static error_1034: string = "比赛报名vip等级不够";
    public static error_1035: string = "比赛报名sng积分不够";
    public static error_1036: string = "比赛报名缺少道具";
    public static error_1037: string = "邮件中没有附件";
    public static error_1038: string = "您当前的vip等级已经很高，此vip包无需再买";
    public static error_1039: string = "邮件附件类型错误";
    public static error_1040: string = "游戏配置错误";
    public static error_1041: string = "首充已经充值过了";
    public static error_1042: string = "转账的账号不存在";
    public static error_1045: string = "手机号已经绑定";
    public static error_1046: string = "手机号验证码验证失败";
    public static error_1047: string = "每日赠送限制";
    public static error_1048: string = "已经绑定过或输入的ID不正确";
    public static error_1049: string = "推广人的游戏局数不够";
    public static error_1050: string = "没有报名，无需取消报名";
    public static error_1051: string = "报名的比赛，开始条件不匹配";
    public static error_1052: string = "报名的比赛，场次异常";
    public static error_1053: string = "比赛不存在";
    public static error_1054: string = "抱歉！您报名的比赛已经开始系统自动为您退赛，或您未报名比赛。";
    public static error_1055: string = "抱歉！您正在比赛中，不能弃赛。";
    public static error_1057: string = "该用户已绑定您的ID。";
    public static error_1058: string = "账号信息获取失败，无法注册！";
    public static error_1059: string = "抱歉地通知您，您今日注册数量达到系统上线，请明天再进行注册！";
    public static error_1060: string = "抱歉地通知您，您所输入的帐号名含有限制字符串，请更换帐号名后再次申请帐号！";
    public static error_1061: string = "抱歉地通知您，系统禁止了您所在的 IP 地址的注册功能，请联系客户服务中心了解详细情况！";
    public static error_1062: string = "此帐号名已被注册，请换另一帐号名字尝试再次注册！";
    public static error_1063: string = "帐号已存在，请换另一帐号名字尝试再次注册！";
    public static error_1064: string = "昵称不合法请修改";
    public static error_1065: string = "改名卡不足，请先购买";
    public static error_5001: string = "牌桌外游戏币不足，操作失败！";
    public static error_5002: string = "赠送游戏币不足";
    public static error_5003: string = "被赠送玩家不在座位上";
    public static error_5004: string = "您不是vip用户"

    public static httpError_0: string = "操作成功";
    public static httpError_1: string = "操作失败";
    public static httpError_10: string = "Session授权失败";
    public static httpError_11: string = "Session已过期";
    public static httpError_20: string = "手机号码错误";
    public static httpError_21: string = "获取验证码太频繁";
    public static httpError_22: string = "短信接口错误";
    public static httpError_23: string = "验证码错误";
    public static httpError_24: string = "验证码已过期";
    public static httpError_30: string = "该手机号码已经注册";
    public static httpError_31: string = "该手机号码未注册";
    public static httpError_32: string = "手机号绑定失败";
    public static httpError_40: string = "电子邮箱格式错误";
    public static httpError_41: string = "该电子邮箱已经注册";
    public static httpError_42: string = "该电子邮箱未注册";
    public static httpError_43: string = "邮件发送失败";
    public static httpError_50: string = "游戏币不足";
    public static httpError_51: string = "已经领过奖";
    public static httpError_52: string = "正在开奖";
    public static httpError_53: string = "购买的项目不存在";
    public static httpError_54: string = "下注超过了指定范围";
    public static httpError_55: string = "老虎机换牌失败";
    public static httpError_56: string = "老虎机结束游戏失败";
    public static httpError_70: string = "订单创建失败";
    public static httpError_80: string = "没有更多在线礼包";
    public static httpError_90: string = "获奖物品数量不够";
    public static httpError_91: string = "物品不存在";
    public static httpError_92: string = "奖券不足";

}
