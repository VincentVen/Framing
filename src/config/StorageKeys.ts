/**
 * 本地存储键配置
 * @author none
 *
 */
class StorageKeys {
    public constructor() {
    }

    public static get accountSave(): string {
        return how.Application.appName + "accountSave";
    }
    public static get account(): string {
        return how.Application.appName + "account";
    }
    public static get password(): string {
        return how.Application.appName + "password";
    }
    public static get imei_windows(): string {
        return how.Application.appName + "imei_windows";
    }
    public static get isGuest(): string {
        return how.Application.appName + "isGuest";
    }
    public static get isLoginType(): string {
        return how.Application.appName + "isLoginType";
    }
    public static get musicValue(): string {
        return how.Application.appName + "musicValue";
    }
    public static get soundValue(): string {//音效开关状态
        return how.Application.appName + "soundValue";
    }
    public static get shakeValue(): string {//震动开关状态
        return how.Application.appName + "shakeValue";
    }
    public static get DZPKTakeScore(): string {
        return how.Application.appName + AppData.getInstance().userData.id + "DZPKTakeScore";
    }
    public static get DZPKCSZData(): string {
        return how.Application.appName + AppData.getInstance().userData.id + "DZPKCSZData";
    }
    public static get DZPKDSTip(): string {//德州扑克打赏提示
        return how.Application.appName + "DZPKDSTip";
    }
}    
