/**
 * 游戏场玩家信息界面
 * @author none
 */
class UserInfoWindowView extends how.module.Window {
    public avater: eui.Image;//头像
    private headkuang: eui.Image;//头像框
    public gender: eui.Image;//性别
    public accounts: eui.Label;//账号
    public money: eui.Label;//金币数量
    public total: eui.Label;//总局数
    public vpip: eui.Label;//入局率
    public pfr: eui.Label;//翻牌前加注率
    public af: eui.Label;//激进程度
    public win: eui.Label;//生涯胜率
    public thanCardWin: eui.Label;//摊牌胜率
    public allInWin: eui.Label;//AllIN胜率
    public magicFaceList: eui.List;//互动表情列表
    public helpbutton: how.Button;//帮助按钮
    public reportButton: how.Button;//举报按钮
    public userInfoWindow_help_text: eui.Image;
    public userInfoWindow: eui.Group;//用户信息窗口
    public useMoneyGroup: eui.Group;//使用金币数量分组
    public faceEffectTipLabel: eui.Label;
    public constructor() {
        super();
        this.skinName = "gameScene.UserInfoWindowViewSkin";
    }
    public start(): void {
        this.helpbutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelpbutton, this);
        this.reportButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReportButton, this);
        this.magicFaceList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onMagicFaceItem, this);
        this.avater.mask = this.headkuang;
        this.width = how.Application.app.stage.width;
        this.height = how.Application.app.stage.height;
        this.faceEffectTipLabel.text = how.StringUtils.format(LanguageConfig.faceEffectTip, base.Utils.formatCurrency(AppData.getInstance().currentRoom.cellScore));
    }
    public childrenCreated(): void {
        super.childrenCreated();
        var magicFaceListData = [];
        for (var i = 0; i < 6; i++) {
            magicFaceListData.push({
                "index": i,
                "source": "magicFace_" + i + "_png"
            })
        }
        this.magicFaceList.dataProvider = new eui.ArrayCollection(magicFaceListData);
    }
    //显示玩家信息
    public showUserInfo(data: any): void {
        this.magicFaceList.visible = AppData.getInstance().userData.id != data.id;
        this.useMoneyGroup.visible = AppData.getInstance().userData.id != data.id;
        this.reportButton.visible = AppData.getInstance().userData.id != data.id;
        this.avater.source = data.Gender == 1 ? "man" + data.FaceID + "_png" : "women" + data.FaceID + "_png";
        this.gender.source = data.Gender == 1 ? "userInfoWindow_gender1_png" : "userInfoWindow_gender0_png";
        this.accounts.text = data.accounts;
        this.money.text = base.Utils.formatCurrency(data.Score);
        this.total.text = data.Total;
        this.vpip.text = data.Total == 0 ? "-" : this.formatString(((data.VIPIP / data.Total) * 100).toFixed(2)) + "%";//入局率
        this.pfr.text = data.Total == 0 ? "-" : this.formatString(((data.PFR / data.Total) * 100).toFixed(2)) + "%";//翻牌前加注率
        this.af.text = data.AFFollowTimes == 0 ? "-" : this.formatString((data.AF / data.AFFollowTimes).toFixed(2));//激进度
        this.win.text = data.Total == 0 ? "-" : this.formatString(((data.WIN / data.Total) * 100).toFixed(2)) + "%";//生涯胜率
        this.thanCardWin.text = data.ThanCardTimes == 0 ? "-" : this.formatString(((data.ThanCardWin / data.ThanCardTimes) * 100).toFixed(2)) + "%";//摊牌胜率
        this.allInWin.text = data.AllInTimes == 0 ? "-" : this.formatString(((data.AllInWin / data.AllInTimes) * 100).toFixed(2)) + "%";//ALLIN胜率
    }
    public formatString(str: string): string {
        return str.replace(".00", "");
    }
    //按下某个互动表情
    public onMagicFaceItem(): void {
        this.report("onMagicFaceItem", this.magicFaceList.selectedItem);
    }
    public onHelpbutton(): void {
        this.userInfoWindow_help_text.scaleY = (this.stage.height - 30) / this.userInfoWindow_help_text.height;
        this.userInfoWindow_help_text.scaleX = (this.stage.height - 30) / this.userInfoWindow_help_text.height;
        this.userInfoWindow_help_text.visible = true;
        this.userInfoWindow.visible = false;
    }
    public onReportButton(): void {

    }
}
