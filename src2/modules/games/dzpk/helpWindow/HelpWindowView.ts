/**
 *帮助窗口界面
 * @author none
 *
 */
class HelpWindowView extends how.module.Window {
    private helpTabBar: eui.TabBar;
    public constructor() {
        super();
        this.skinName = "HelpWindowSkin";
    }
    public start(): void {
        this.helpTabBar.dataProvider = new eui.ArrayCollection(LanguageConfig.htlpTabBarText);
        this.helpTabBar.selectedIndex = 0;
        this.helpTabBar.addEventListener(eui.ItemTapEvent.CHANGE, this.onTabbarChange, this);
    }
    //tabbar改变时
    public onTabbarChange(): void {
        for (var i = 0; i < 4; i++) {
            this["help" + i].visible = i == this.helpTabBar.selectedIndex;
        }
    }
}
