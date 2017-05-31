/**
 * 聊天界面
 * @author none
 */
class ChatWindowView extends how.module.Window {
    public chatTabBar: eui.TabBar;
    public faceList: eui.List;
    public languageList: eui.List;
    public faceScroller: eui.Scroller;
    public languageScroller: eui.Scroller;
    public constructor() {
        super();
        this.skinName = "gameScene.ChatWindowView";
    }
    public start(): void {
        this.chatTabBar.addEventListener(eui.ItemTapEvent.CHANGE, this.onTabBarChange, this);
        this.faceList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onfaceItem, this);
        this.languageList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onlanguageItem, this);
        this.faceScroller.visible = NewGameSceneData.getInstance().chatWindowTabIndex == 0;
        this.languageScroller.visible = NewGameSceneData.getInstance().chatWindowTabIndex == 1;
        this.chatTabBar.selectedIndex = NewGameSceneData.getInstance().chatWindowTabIndex;
    }
    public childrenCreated(): void {
        super.childrenCreated();
        var faceListData = [];
        for (var i = 0; i < 26; i++) {
            faceListData.push({
                "index": i,
                "source": "face" + i + "_png"
            })
        }
        this.faceList.dataProvider = new eui.ArrayCollection(faceListData);
        this.languageList.dataProvider = new eui.ArrayCollection(DataConfig.chatQuickLanguages);
    }
    //点击某个表情
    public onfaceItem(): void {
        this.report("onfaceItem", this.faceList.selectedItem);
    }
    //点击某个快捷语
    public onlanguageItem(): void {
        this.report("onlanguageItem", this.languageList.selectedItem);
    }
    //选项卡切换时
    private onTabBarChange(): void {
        NewGameSceneData.getInstance().chatWindowTabIndex = this.chatTabBar.selectedIndex;
        this.faceScroller.visible = this.chatTabBar.selectedIndex == 0;
        this.languageScroller.visible = this.chatTabBar.selectedIndex == 1;
    }
    public openEffect(): boolean {
        this.left = 5;
        this.bottom = 5;
        this.onOpenScaleComplete();
        return false;
    }
    public closeEffect(): boolean {
        this.onCloseScaleComplete();
        return false;
    }
}
