module how {
	/**
	 * 页面切换控件
	 * @author none
	 *
	 */
    export class PageView extends eui.Scroller {
        private group: eui.Group;
        private isLand: string;
        private beginPoint: number;
        private endPoint: number;
        private scrollerCount: number;

        //滚动灵敏度（像素）
        public rate: number = 200;
        //滚动时间（毫秒）
        public scrollerSpeed = 500;
        //回弹时间（毫秒）
        public boundSpeed = 300;
        //正在滚动
        public isScrolling = false;
        public constructor() {
            super();
            this.throwSpeed = 0;
        }

        public childrenCreated(): void {
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.addEventListener(eui.UIEvent.CHANGE_START, this.touchBegin, this);
            this.addEventListener(eui.UIEvent.CHANGE_END, this.touchEnd, this);
            this.group = <eui.Group>this.getChildAt(0);
            this.isLand = egret.is(this.group.layout, "eui.VerticalLayout") ? "scrollV" : "scrollH";
            this.start();
        }

        private touchBegin(evt: eui.UIEvent): void {
            if (this.isScrolling) {
                return;
            }
            this.scrollerCount = Math.floor(this.viewport[this.isLand] / this.width);
            this.beginPoint = this.viewport[this.isLand];
        }
        private touchEnd(evt: eui.UIEvent): void {
            if (this.isScrolling) {
                return;
            }
            this.endPoint = this.viewport[this.isLand];
            this.onMove();
        }

        private onMove(): void {
            this.touchEnabled = false;
            if (Math.abs(this.endPoint - this.beginPoint) >= this.rate) {
                if (this.endPoint - this.beginPoint > 0) {
                    this.scrollerCount++;
                    this.scrollerCount = this.scrollerCount >= this.group.numChildren ? this.group.numChildren - 1 : this.scrollerCount;
                } else {
                    this.scrollerCount--;
                    this.scrollerCount = this.scrollerCount < 0 ? 0 : this.scrollerCount;
                }
                egret.Tween.get(this.viewport).to({ [this.isLand]: this.width * this.scrollerCount }, this.scrollerSpeed).call(this._scrollerend, this, [true]);
                this.isScrolling = true;
            } else {
                egret.Tween.get(this.viewport).to({ [this.isLand]: this.width * this.scrollerCount }, this.boundSpeed).call(this._scrollerend, this, [false]);
                this.isScrolling = true;
            }
        }


        private onDestroy(): void {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.removeEventListener(eui.UIEvent.CHANGE_START, this.touchBegin, this);
            this.removeEventListener(eui.UIEvent.CHANGE_END, this.touchEnd, this);
            this.end();
        }
        private _scrollerend(data: any): void {
            this.touchEnabled = true;
            this.isScrolling = false;
            this.scrollerEnd(data);
        }

        public scrollerEnd(isScroller: boolean): void { }
        public start(): void { }
        public end(): void { }
    }
}
