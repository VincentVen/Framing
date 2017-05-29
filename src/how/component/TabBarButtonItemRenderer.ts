module how {
    /**
    * 带图标的选项卡的项渲染器
    * 通过设置数据的icon属性的值来设置图标资源，icon值的例子：{icon:"未选中,选中"}
    * @author none
    *
    */
	export class TabBarButtonItemRenderer extends eui.ItemRenderer {
        public iconDisplay: eui.Image;
        public constructor() {
            super();
            this.addEventListener(eui.UIEvent.ENTER_FRAME,this.onEnterFrame,this);
        }
        public updateIcon(): void {
            var icon: string = this.data?this.data.icon:null;
            if(icon && this.iconDisplay) {
                this.iconDisplay.source = !this.selected?icon.split(",")[0]:icon.split(",")[1];
            }
        }
        private onEnterFrame(event:eui.UIEvent): void {
            this.updateIcon();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        }
	}
}
