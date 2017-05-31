/**
 * 头像表项
 * @author none
 */
class HeaderItem extends how.module.Data {
    public headerIcon: string;
    public selected: boolean;//头像选择
}

class HeaderItemData extends how.module.ItemView {
    public headerIcon: eui.Image;
    public selectedBg: eui.Image;
    public constructor() {
        super();
        this.skinName = "avater_headerIcon";
    }
    public dataChanged(): void {
        this.selectedBg.visible = this.data.selected;
        this.headerIcon.source = this.data.headerIcon;
    }
}
