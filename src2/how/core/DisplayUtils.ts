module how {
	/**
	 * 显示对象工具类
	 * @author none
	 *
	 */
    export class DisplayUtils {
        public constructor() {
        }
        /**
         * 获取扇形
         */
        public static getSector(r: number = 100, startFrom: number = 0, angle: number = 360, color: number = 0xff0000): egret.Shape {
            var shape: egret.Shape = new egret.Shape();
            var x: number = 0;
            var y: number = 0;
            shape.graphics.beginFill(color);
            startFrom = startFrom * Math.PI / 180;
            var isClockwise: boolean = true;//是否顺时针
            if (angle < 0) {
                isClockwise = false;
            }
            shape.graphics.drawArc(x, y, r, startFrom, startFrom + angle * Math.PI / 180, !isClockwise);
            shape.graphics.lineTo(x, y);
            shape.graphics.lineTo(x + r * Math.cos(startFrom), y + r * Math.sin(startFrom));
            shape.graphics.endFill();
            return shape;
        }
        /**
         * 获取矩形
         */
        public static getRect(width: number, height: number, alpha: number = 1, color: number = 0xff0000): egret.Shape {
            var shape: egret.Shape = new egret.Shape();
            shape.graphics.beginFill(color, alpha);
            shape.graphics.drawRect(0, 0, width, height);
            shape.graphics.endFill();
            return shape;
        }

        private static _poolDisplay: any = {};
        /*
         * 获取池对象
         * */
        public static getPoolDisplayObject(displayClass: any): egret.DisplayObject {
            var displayObj: egret.DisplayObject = null;
            var arr: any[] = [];
            var className: string = egret.getQualifiedClassName(displayClass);
            if (this._poolDisplay[className]) {
                arr = this._poolDisplay[className];
            }

            if (arr.length > 0) {
                displayObj = arr.pop();
            }
            else {
                displayObj = new displayClass();
            }

            return displayObj;
        }
        /*
         * 回收池对象
         * */
        public static recyclePoolDisplayObject(displayObj: egret.DisplayObject): void {
            //重置显示对象基本参数
            if (displayObj.parent) {
                displayObj.parent.removeChild(displayObj);
            }
            displayObj.alpha = 1;
            displayObj.visible = true;
            displayObj.scaleX = displayObj.scaleY = 1;
            displayObj.mask = null;
            displayObj.x = displayObj.y = 0;

            var arr: any[] = [];
            var className: string = egret.getQualifiedClassName(displayObj);
            if (this._poolDisplay[className]) {
                arr = this._poolDisplay[className];
            }
            else {
                this._poolDisplay[className] = arr;
            }
            arr.push(displayObj);
        }
        //清除回收池对象
        public static clearAllPoolDisplayObject(): void {
            for (var key in this._poolDisplay) {
                var arr: egret.DisplayObject[] = this._poolDisplay[key];
                while (arr.length > 0) {
                    var tmp: egret.DisplayObject = arr.pop();
                    tmp = null;
                }
            }
            this._poolDisplay = {};
        }

        //恢复灰化图片
        public static restoreEuiImage(argImage: eui.Image): void {
            if (this._darkGroup && this._darkGroup[argImage.hashCode]) {
                this.clearDarkImage(this._darkGroup[argImage.hashCode]);
            }
        }

        private static _darkGroup: any;
        //图片灰化
        public static darkEuiImage(argImage: eui.Image): void {
            if (!this._darkGroup) {
                this._darkGroup = {};
            }

            var group: eui.Group;
            var img: eui.Image;
            if (!this._darkGroup[argImage.hashCode]) {
                group = new eui.Group();
                this._darkGroup[argImage.hashCode] = group;
                img = new eui.Image();
                img.source = argImage.source;
                var rect: eui.Rect = new eui.Rect();
                rect.top = 0;
                rect.bottom = 0;
                rect.right = 0;
                rect.left = 0;
                rect.fillColor = 0x0;
                rect.fillAlpha = 0.3;
                group.addChild(img);
                group.addChild(rect);
                group.mask = img;

                if (!argImage.parent.contains(group)) {
                    argImage.parent.addChild(group);
                    group.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveGroup, this);
                }
            }
            else {
                group = this._darkGroup[argImage.hashCode];
                img = <eui.Image>group.getChildAt(0);
                img.source = argImage.source;
            }
        }

        private static onRemoveGroup(event: egret.Event): void {
            var group: eui.Group = event.currentTarget;
            this.clearDarkImage(group);
        }

        private static clearDarkImage(group: eui.Group): void {
            for (var key in this._darkGroup) {
                if (this._darkGroup[key] == group) {
                    this._darkGroup[key] = null;
                    delete this._darkGroup[key];
                    break;
                }
            }

            group.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveGroup, this);
            if (group.parent) {
                group.parent.removeChild(group);
                group.mask = null;
            }
        }
    }
}
