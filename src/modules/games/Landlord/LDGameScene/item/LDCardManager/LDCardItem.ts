// TypeScript file
class LDCardItem extends how.module.ItemView {
    public card: eui.Image;//牌
    public shade: eui.Image;//遮罩
    public tag: number;//标志，用于记录牌点
    public constructor() {
        super();
        this.skinName = "LDCard";
        this.shade.visible = false;
    }
    public getByTag(index: number) {
        if (this.tag == index) return this;
    }
    public setShade(value: boolean) {
        this.shade.visible = value;
    }
}