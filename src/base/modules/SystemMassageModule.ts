/**
 *系统消息模块
 * @author none
 *
 */
class SystemMassageModule extends how.module.GlobalModule {
    private notice: how.NoticeItem;
    private announce: how.NoticeItem;
    public static response: any = {
        onResize: how.Application.APPEVENT_RESIZE,
        onSystemTalk: CMDConfig.GET_SYSMESSAGE,
        onNoticeTalk: CMDConfig.GET_NOTICE_MSG,
        onNoticeChange: CMDConfig.GET_NOTICE_CHANGE,
        changeScene: how.Application.CHANGESCENE,
        onGameError: CMDConfig.GET_GAME_ERROR,//获取游戏错误信息
    }
    public constructor() {
        super();
        this.notice = new how.NoticeItem(4, "MainSceneViewNoticeSkin");
        this.announce = new how.NoticeItem(8, "GameSceneAnnouncement");
        //初始化公告默认消息
        this.announce.noticeList = [{
            id: 0,
            content: LanguageConfig.announcement,
            count: 2,
            interval: 0,
            cb: null,
            target: null
        }];
    }
    /**
     * 消息信息改变
     */
    private onNoticeChange(data: any): void {
        this.onNoticeTalk(data);
    }
    /**
     * 收到系统消息
     */
    private onNoticeTalk(data: any): void {
        //一次性推送多次消息处理
        for (var i = 0, len = data.content.length; i < len; i++) {
            switch (data.type[i]) {
                case 0://公告
                    this.notice.update({
                        id: data.id[i],
                        content: data.content[i],
                        count: data.count[i],
                        interval: data.interval[i] == null ? 0 : data.interval[i],
                        cb: null,
                        target: null
                    });
                    break;
                case 1://系统消息
                    //公告信息:{id(id为0表示系统默认消息),content,count,cb,target}
                    this.announce.update({
                        id: data.id[i],
                        content: data.content[i],
                        count: data.count[i],
                        interval: data.interval[i] == null ? 0 : data.interval[i],
                        cb: null,
                        target: null
                    });
                    break;
            }
        }
    }
    //获取游戏大厅错误信息
    private onGameError(data: any): void {
        switch (data.code) {
            case 21://服务器要求退出
                this.communicate(ReConnectedModule.response.setIsThrowOut, true);
                how.Alert.show(LanguageConfig.error_31, function () {
                    if (top.location != location) {
                        location.href = base.Utils.getQueryString(location.search, "returnUrl");
                    } else {
                        location.reload();//刷新当前页面
                    }
                }, this, null, LanguageConfig.chognshilian);
                break;
            case 20://账号禁用
                this.communicate(ReConnectedModule.response.setIsThrowOut, true);
                this.hallSocket.close();
                var alert = how.Alert.show(LanguageConfig.hall_error_20);
                alert.okButton.visible = false;
                break;
            case 7://服务器要求退出
                how.Alert.show(LanguageConfig["hall_error_" + data.code], () => {
                    if (top.location != location) {
                        location.href = base.Utils.getQueryString(location.search, "returnUrl");
                    } else {
                        location.reload();//刷新当前页面
                    }
                }, location, null, LanguageConfig.chognshilian);
                break;
            case 18:
            case 19:
                how.Alert.show(LanguageConfig["hall_error_" + data.code] + data.orderID);
                break;
            default://关闭房间
                how.Alert.show(LanguageConfig["hall_error_" + data.code]);
                break;
        }
    }
    private onSystemTalk(data: any): void {
        switch (data.wMessageType) {
            case 1:
                if (data.szContent == 58) {
                    this.communicate(LoaddingGlobalModule.response.hideLoad);
                    how.Alert.show(LanguageConfig["error_" + data.szContent]);
                }
                break;
            case 2://弹出消息
                if (egret.is(how.Application.currentScene, "NewGameSceneView") && data.szContent == 5) //判断出来是在牌桌上边游戏币不足，需弹出救济金或者被动计费点
                {

                } else {
                    how.Alert.show(LanguageConfig["error_" + data.szContent]);
                }
                break;
            case 4:
                if (data.szContent == 34) {//账号被禁用
                    this.communicate(ReConnectedModule.response.setIsThrowOut, true);
                    this.gameSocket.close();
                    var alert = how.Alert.show(LanguageConfig.hall_error_20);
                    alert.okButton.visible = false;
                    return;
                }
                if (data.wMessageLength != 0) {
                    var content: string = data.szContent;
                    if (content.indexOf("[") != -1) {//赢钱金额按比例缩小
                        var money = content.substring(content.indexOf("[") + 1, content.indexOf("]"));
                        content = content.replace(money, base.Utils.formatCurrency(money));
                        content = content.replace("[", "");
                        content = content.replace("]", "");
                    }
                    this.notice.update({
                        id: -1,
                        content: content,
                        count: 1,
                        interval: 0,
                        cb: null,
                        target: null
                    });
                }
                break;
            case 8:
                if (data.wMessageLength != 0) {
                    this.announce.update({
                        id: -1,
                        content: data.szContent,
                        count: 1,
                        interval: 0,
                        cb: null,
                        target: null
                    });
                }
                break;
            case 1000://服务器要求退出
                if (!this.hallSocket.connected) {
                    this.communicate(ReConnectedModule.response.setIsThrowOut, true);
                    how.Alert.show(LanguageConfig["error_" + data.szContent], function () {
                        if (top.location != location) {
                            location.href = base.Utils.getQueryString(location.search, "returnUrl");
                        } else {
                            location.reload();//刷新当前页面
                        }
                    }, this, null, LanguageConfig.chognshilian);
                }
                break;
            case 2000://关闭房间
                break;
        }
    }
    private onResize(data: any) {
        if (this.announce.showFlag) {
            this.announce.onResize();
        }
        if (this.notice.showFlag) {
            this.notice.onResize();
        }
    }
    /*
    *收到场景切换
    */
    private changeScene(): void {
        var noticeSkins = {
            MainSceneView: "MainSceneViewNoticeSkin",
            DZPKRoomHallSceneView: "DZPKRoomHallSceneViewNoticeSkin",
            NewGameSceneView: "NewGameSceneViewNoticeSkin",
            LDGameSceneView: "landlordGameNoticeSkin",
            LDHallSceneView: "LDHallNotice",
            TEBGameSceneView: "TEBGameSceneNoticeSkin",
        }
        //是否需要通知，每一个界面都需要定义
        var announcements = {
            MainSceneView: true,
            DZPKRoomHallSceneView: true,
            NewGameSceneView: false,
            LDGameSceneView: false,
            LDHallSceneView: true,
            TEBGameSceneView: false,
        }
        for (var key in announcements) {
            if (egret.is(how.Application.currentScene, key)) {
                var notice = this.notice;
                notice.initSkin(noticeSkins[key]);
                if (notice.isShow) {
                    notice.close();
                }
                notice.show();
                var announce = this.announce;
                announce.close();
                announce.setShowFlag(announcements[key]);
                if (announcements[key]) {
                    announce.show();
                }
                return;
            }
        }
    }
}
