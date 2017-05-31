/**
 * 聊天模块
 * @author none
 * 
 */
class ChatWindowModule extends how.module.WindowModule {
    public constructor(guiClass: any = null, dataClass: any = null, modal: boolean = true, center: boolean = true, autoClose: boolean = true) {
        super(guiClass, dataClass, modal, false);
    }
    public static request: any = {
        onfaceItem: "onfaceItem",
        onlanguageItem: "onlanguageItem"
    }
    //点击某个表情
    public onfaceItem(data: any): void {
        if (AppData.getInstance().userData.status == UserStatus.PLAY) {
            var sendMassage = "[" + data.index + "]";
            this.gameSocket.send(CMDConfig.SEND_TALK_MESSAGE, {
                szChatMessage: sendMassage,
                wChatLength: base.Utils.getUtf8Length(sendMassage),
                crFontColor: "",
                dwSendUserID: AppData.getInstance().userData.id,
                dwTargetUserID: null
            });
        } else {
            how.Banner.show(LanguageConfig.nosendChatmessage);
        }
        this.close();
    }
    //点击某个快捷语
    public onlanguageItem(data: any): void {
        if (AppData.getInstance().userData.status == UserStatus.PLAY) {
            var sendMassage = data.label;
            this.gameSocket.send(CMDConfig.SEND_TALK_MESSAGE, {
                szChatMessage: sendMassage,
                wChatLength: base.Utils.getUtf8Length(sendMassage),
                crFontColor: "",
                dwSendUserID: AppData.getInstance().userData.id,
                dwTargetUserID: null
            });
        } else {
            how.Banner.show(LanguageConfig.nosendChatmessage);
        }
        this.close();
    }
}
