/**
 * 渠道配置
 * @author none
 *
 */
class ChannelConfig {
    public constructor() {
    }
	/**
	* 渠道编号
	* */
    public static channelID: number = 319000;//渠道暂定999

    /*商店列表请求*/
    public static payType: number = 18;

    /*玩家类型*/
    public static userType: number;

    /*支持的登录方式*/
    public static appTyppe: number;
    /*账号登陆*/
    public static type_Normal: number = 0;

    /*QQ第三方登陆*/
    public static type_QQ: number = 16;

    /*新浪微博登陆*/
    public static Type_SinaWeibo: number = 17;

    /*微信登陆*/
    public static Type_WeiXin: number = 15;
}
