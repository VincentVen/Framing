/**
 * 头像窗口界面
 * @author none
 *
 */
class AvaterWindowView extends how.module.Window {
    private headerList: eui.List;//头像列表
    private tabBarSex: eui.TabBar;//性别选择
    private allList: Array<Array<HeaderItem>> = [];
    private btnSave: eui.Button;//保存按钮
    private btnClose: eui.Button;//关闭按钮
    private sexIndex: number;//当前选择性别
    private iconIndex: number;//当前选择头像
    private myHeaderIcon: eui.Image;
    public constructor() {
        super();
        this.skinName = "AvaterWindowSkin";
    }
    public start(): void {
        this.sexIndex = AppData.getInstance().userData.gender;
        this.iconIndex = AppData.getInstance().userData.avatar;
        this.initUI();
        this.initEvent();
    }
    private initUI() {
        this.initSexList();//头像列表初始化
        this.initHeader();
    }
    private initEvent() {
        this.tabBarSex.addEventListener(egret.Event.CHANGE, this.onTabBarChange, this);
        this.headerList.addEventListener(egret.Event.CHANGE, this.setHeaderIndex, this);
        this.btnSave.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaveButton, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseButton, this);
    }
    //初始化列表界面
    private initSexList() {
        var manList: Array<HeaderItem> = [], womenList: Array<HeaderItem> = [];
        for (var i = 0; i < 8; i++) {
            var item = new HeaderItem();
            item.selected = false;
            item.headerIcon = "man" + i + "_png";
            manList.push(item);
        }
        for (var i = 0; i < 8; i++) {
            var item = new HeaderItem();
            item.selected = false;
            item.headerIcon = "women" + i + "_png";
            womenList.push(item);
        }
        this.allList = [womenList, manList];
        this.tabBarSex.selectedIndex = this.sexIndex;
        this.allList[this.sexIndex][this.iconIndex].selected = true;
        this.headerList.dataProvider = new eui.ArrayCollection(this.allList[this.sexIndex]);
    }
    //设置头像
    private initHeader() {
        this.myHeaderIcon.source = this.sexIndex == 1 ? "man" + this.iconIndex + "_png" : "women" + this.iconIndex + "_png";
    }
    //选择头像改变
    public setHeaderIndex() {
        var iconIndex = this.iconIndex, sexIndex = this.sexIndex, list = this.allList[sexIndex];
        list[iconIndex].selected = false;
        if (sexIndex == this.tabBarSex.selectedIndex) {
            var item = <HeaderItemData>this.headerList.getVirtualElementAt(iconIndex);
            item.selectedBg.visible = false;
        }
        this.iconIndex = this.headerList.selectedIndex;
        this.sexIndex = this.tabBarSex.selectedIndex;
        var item1 = <HeaderItemData>this.headerList.getVirtualElementAt(this.iconIndex);
        item1.selectedBg.visible = true;
        this.allList[this.sexIndex][this.iconIndex].selected = true;
        //设置右边头像
        this.initHeader();
    }
    //tabbar改变
    public onTabBarChange() {
        this.headerList.dataProvider = new eui.ArrayCollection(this.allList[this.tabBarSex.selectedIndex]);
        if (this.sexIndex == this.tabBarSex.selectedIndex) {
            this.headerList.selectedIndex = this.iconIndex;
        } else {
            this.headerList.selectedIndex = -1;
        }
    }
    //按下保存按钮    
    public onSaveButton(): void {
        this.report(AvaterWindowModule.request.onSaveButton, this.sexIndex, this.iconIndex);
    }
    /**
    * 按下关闭按钮
    * */
    protected onCloseButton(): void {
        super.onCloseButton();
    }
}