/**
* 主类，游戏入口
* @author none
*/
class Main extends how.HowMain {
    public constructor() {
        RES.setMaxLoadingThread(10);
        super("gamesLobby", LoadingUI, "default.res.json" + "?v=" + GameConfig.version, GameConfig.resourceUrl, "default.thm.json", ["hall_main_scene"], 1280, 720, base.Loadding);
    }
    public start(): void {
        how.ComponentUtils.init(true, "public.AlertSkin", "public.DialogSkin", "public.BannerSkin", "MainSceneViewNoticeSkin", "public.LoaddingSkin",
            "GameSceneAnnouncement", "SettingWindowSkin", this.afterStart, this);//初始化通用组件
    }
    public afterStart(): void {
        this.stage.maxTouches = 1;//多点触摸禁止
        how.Alert.titleString = LanguageConfig.ALERT_DEFAULT_TITLE;
        how.Alert.buttonLableString = LanguageConfig.ALERT_DEFAULT_BUTTON_CONFIRM_LABEL;
        how.Dialog.titleString = LanguageConfig.ALERT_DEFAULT_TITLE;
        how.Dialog.buttonLableString = LanguageConfig.ALERT_DEFAULT_BUTTON_CONFIRM_LABEL + "|" + LanguageConfig.ALERT_DEFAULT_BUTTON_CANCEL_LABEL;

        this.moduleManager.initGlobalModule(base.GameHallGlobalModule);//全局切登陆逻辑模块
        this.moduleManager.initGlobalModule(base.GameRoomGlobalModule);//全局切登陆逻辑模块
        this.moduleManager.initGlobalModule(base.ChangeServerGlobalModule);//全局切服务器逻辑模块
        this.moduleManager.initGlobalModule(SystemMassageModule);//系统消息模块
        this.moduleManager.initGlobalModule(ReConnectedModule);//游戏全局断线重连模块
        this.moduleManager.initGlobalModule(LoaddingGlobalModule);//全局loading模块
        this.initLocalStorage();
    }
    /*初始化本地数据，音乐，音效，震动，自动登录等*/
    private initLocalStorage(): void {
        if (egret.localStorage.getItem(StorageKeys.musicValue) == null) {
            egret.localStorage.setItem(StorageKeys.musicValue, "0.5");
        }
        if (egret.localStorage.getItem(StorageKeys.soundValue) == null) {
            egret.localStorage.setItem(StorageKeys.soundValue, "0.8");
        }
        if (egret.localStorage.getItem(StorageKeys.shakeValue) == null) {
            egret.localStorage.setItem(StorageKeys.shakeValue, "false");
        }
        how.SoundManager.musicVolume = base.Utils.getLocalStorageItem(StorageKeys.musicValue, "Number");
        how.SoundManager.effectVolume = base.Utils.getLocalStorageItem(StorageKeys.soundValue, "Number");

        this.eventManager.dispatchEvent(base.GameHallGlobalModule.response.getLogin);
    }
    /**
    * 子类继承获取加载进度
    */
    protected onLoaddingProgress(percent: number, current: number, total: number): void {
        var loadingUI: LoadingUI = <LoadingUI>this.loadingUI;
        loadingUI.setProgress(percent, current, total);
    }
    /**
     * 当所有资源组加载完成
     */
    protected onAllGroupComplete(): void {
        var loadingUI: LoadingUI = <LoadingUI>this.loadingUI;
        loadingUI.setText("正在登陆游戏，请稍候...");//初始化样式
    }
    /**
     * 事件监听管理器
     */
    public get eventManager(): how.EventManager {
        return how.EventManager["getInstance"](this);
    }
}