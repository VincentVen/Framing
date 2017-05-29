/**
 * 游戏配置
 * @author none
 *
 */
class GameConfig {
    public constructor() {
    }
    /**
    * 游戏资源地址
    * */
    public static resourceUrl: string = "resource/";
    /**
    * 游戏版本默认1.0.0
    * */
    public static version: string = "1.0.0";
    /**
    * 是否打印日志开关
    * */
    public static useConsoleLog: boolean = true;
    /*-----------------------大厅websocket链接------------------------*/
    // public static hallSocketHost: string = "172.16.6.106";//王源智电脑
    public static hallSocketHost: string = "192.168.20.156";//内网开发服
    // public static hallSocketHost: string = "103.230.242.142";//外网服
    public static hallSocketPort: string = ":9099";
    /*-----------------------获取登录信息API地址------------------------*/
    // public static httpUrl: string = "http://172.16.6.111:88/proxy/api.do";//邓剑彬电脑
    public static httpUrl: string = "http://192.168.20.156:8080/proxy/api.do";//内网开发服
    // public static httpUrl: string = "http://103.230.242.142:8080/proxy/api.do";//外网服
}
