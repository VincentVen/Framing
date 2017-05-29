/**
 * 下的筹码面板
 * @author none
 *
 */
class ChipsPanel extends eui.Panel {
    public moneyGroup: eui.Group;//保存筹码的组容器
    public chipLabel: eui.Label;//筹码文本
    public scoreIcon: eui.Image;//筹码面板图标
    private _data: number = NaN;
    public get data(): number {
        return this._data;
    }
    public set data(value: number) {
        this._data = value;
        if (this.chipLabel && !isNaN(value)) {
            this.chipLabel.text = base.Utils.formatCurrency(value);
        }
        this.visible = !isNaN(value);
    }
}
