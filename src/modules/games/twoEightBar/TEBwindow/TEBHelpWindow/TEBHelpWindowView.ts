/**
 *帮助窗口界面
 * @author none
 *
 */
class TEBHelpWindowView extends how.module.Window {
    private helpTabBar: eui.TabBar;
    public constructor() {
        super();
        this.skinName = "TEBHelp";
    }
    public start(): void {
        this.helpTabBar.selectedIndex = 0;
        this.helpTabBar.addEventListener(eui.ItemTapEvent.CHANGE, this.onTabbarChange, this);
    }
    //tabbar改变时
    public onTabbarChange(): void {
        for (var i = 0; i < 3; i++) {
            this["group" + i].visible = i == this.helpTabBar.selectedIndex;
        }
    }
}
