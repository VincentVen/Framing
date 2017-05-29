/**
 * 倒计时进度条
 * @author none
 */
class ProgressTimer extends eui.Image {
    public shape: egret.Shape;
    private shapeX: number = 0;
    private shapeY: number = 0;
    private _value: number = 0;
    public blink: eui.Image;
    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        var isChanged: boolean = this._value != value;
        this._value = value;
        if (isChanged) {
            this.updateNow();
        }
    }
    public childrenCreated(): void {
        this.shapeX = this.width / 2 + this.width * 0.1362;
        this.shapeY = this.height / 2;
    }
    /**
     * 实时更新进度显示
     */
    public updateNow(): void {
        this.visible = this.value != 0;
        this.blink.visible = this.value != 0;
        if (this.shape) {
            this.parent.removeChild(this.shape);
        }
        //var percent: number = -(360 - (this.value / 100 * 360));//从有到无
        var percent: number = this.value / 100 * 360;//从无到有
        this.shape = how.DisplayUtils.getSector(this.width * 0.6, 0, percent);
        this.shape.rotation = -90;
        this.shape.x = this.shapeX;
        this.shape.y = this.shapeY;
        this.parent.addChild(this.shape);
        this.mask = this.shape;
        var startPoint: egret.Point = this.getPoint(percent + 90, { x: this.x + this.width / 2, y: this.y + this.height / 2 }, this.width / 2 - this.blink.width / 4);
        this.blink.x = startPoint.x;
        this.blink.y = startPoint.y;
    }
    public startBlinkTween(): void {
        egret.Tween.get(this.blink, { loop: true }).to({ rotation: 360 }, 3000);
    }
    public getPoint(angle, centre, r): egret.Point {
        var hudu = (2 * Math.PI / 360) * angle;
        return new egret.Point(centre.x - Math.cos(hudu) * r, centre.y - Math.sin(hudu) * r);
    }
}
