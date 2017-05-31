/**
 * 猜三张购买列表item
 * @author none
 */
class CaiSanZhangBuyItem extends how.module.ItemView {
    public title: eui.Label;
    public odds: eui.Label;
    public multipleBtn1: how.CheckBox;
    public multipleBtn5: how.CheckBox;
    public multipleBtn10: how.CheckBox;
    public constructor() {
        super();
        this.skinName = "CaiSanZhangBuyItemSkin";
        this.multipleBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMultipleBtn1, this);
        this.multipleBtn5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMultipleBtn5, this);
        this.multipleBtn10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMultipleBtn10, this);
    }
    public dataChanged(): void {
        this.title.text = this.data.title;
        this.odds.text = this.data.odds;
        this.multipleBtn1.selected = this.data.selected == 1;
        this.multipleBtn5.selected = this.data.selected == 5;
        this.multipleBtn10.selected = this.data.selected == 10;
    }
    public onMultipleBtn1(): void {
        this.multipleBtn5.selected = false;
        this.multipleBtn10.selected = false;
        var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
        caiSanZhangData.betNumber[this.itemIndex] = 1;
        egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify(caiSanZhangData));
    }
    public onMultipleBtn5(): void {
        this.multipleBtn1.selected = false;
        this.multipleBtn10.selected = false;
        var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
        caiSanZhangData.betNumber[this.itemIndex] = 5;
        egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify(caiSanZhangData));
    }
    public onMultipleBtn10(): void {
        this.multipleBtn1.selected = false;
        this.multipleBtn5.selected = false;
        var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
        caiSanZhangData.betNumber[this.itemIndex] = 10;
        egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify(caiSanZhangData));
    }
}
