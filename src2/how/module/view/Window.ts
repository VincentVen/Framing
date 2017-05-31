module how.module {
	/**
	 * 所有窗口的基类，窗口在舞台的生命周期包括awake、openEffect、start、close、closeEffect、onDestroy这6个阶段
	 * @author none
	 *
	 */
    export class Window extends View {
        private children: egret.DisplayObject[] = [];
        private sceneTexture: egret.RenderTexture;
        private windowTexture: egret.RenderTexture;
        private static textureCache: any = {};
        protected delayChildrenCreated: boolean = true;
        protected window: eui.Panel;
        public constructor() {
            super();
        }
        /**
         * 当添加到舞台时
         * @param event 事件对象
         */
        protected onAddedToStage(event: egret.Event): void {
            super.onAddedToStage(event);
            
            how.EventManager["getInstance"](this).dispatchEvent(Application.APPEVENT_WINDOW_OPEN, this);
            // how.SoundManager.playEffect("window_open_mp3");
        }
        /**
         * 当从舞台移除时，推荐重写onDestroy
         * @param event 事件对象
         */
        protected onRemovedFromStage(event: egret.Event): void {
            this.removeCache();
            super.onRemovedFromStage(event);
            how.EventManager["getInstance"](this).dispatchEvent(Application.APPEVENT_WINDOW_CLOSE, this);
            // how.SoundManager.playEffect("window_close_mp3");
        }
        /**
         * 当子项创建完成，推荐重写start
         */
        public childrenCreated(): void {
            if (!this.openEffect() || !this.delayChildrenCreated) {
                super.childrenCreated();
            }
            super.childrenCreated();
            this.window = this.numChildren > 0 ? <eui.Panel>this.getChildAt(0) : null;
            if (this.window && this.window["_closeButton"]) {
                this.window["_closeButton"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseButton, this);
            }
        }
        public get useFast(): boolean {
            return false;
        }
        protected addCache(): void {
            var sceneTexture: egret.RenderTexture = new egret.RenderTexture();
            sceneTexture.drawToTexture(how.Application["_guiLayer"]);
            this.sceneTexture = sceneTexture;
            how.Application["_app"].addChildAt(new egret.Bitmap(sceneTexture), 0);
            how.Application["_guiLayer"].visible = false;
            this.visible = false;
            egret.callLater(() => {
                var cacheWindowTexture: egret.RenderTexture = Window.textureCache[egret.getQualifiedClassName(this)];
                this.windowTexture = cacheWindowTexture;
                if (!this.windowTexture) {
                    var windowTexture: egret.RenderTexture = new egret.RenderTexture();
                    Window.textureCache[egret.getQualifiedClassName(this)] = this.windowTexture = windowTexture;
                    windowTexture.drawToTexture(this, new egret.Rectangle(0, 0, parseInt(this.width + ""), parseInt(this.height + "")));
                }
                while (this.numChildren) {
                    this.children.push(this.removeChildAt(0));
                }
                var windowBitmap: egret.Bitmap = new egret.Bitmap(this.windowTexture);
                windowBitmap.anchorOffsetX = windowBitmap.width / 2;
                windowBitmap.anchorOffsetY = windowBitmap.height / 2;
                this.addChild(windowBitmap);
                egret.callLater(() => {
                    this.visible = true;
                    this.playOpenTwen();
                }, this);
            }, this);
        }
        protected playOpenTwen(): void {
            this.scaleX = 0.9;
            this.scaleY = 0.9;
            this.alpha = 0.5;
            egret.Tween.get(this).
                to({ scaleX: 1, scaleY: 1, alpha: 1 }, 100).
                // to({ scaleX: 1.05, scaleY: 1.05 }, 100).
                // to({ scaleX: 0.95, scaleY: 0.95 }, 100).
                // to({ scaleX: 1, scaleY: 1 }, 100).
                call(this.onOpenScaleComplete, this);
        }
        protected removeCache(): void {
            if (this.sceneTexture) {
                this.sceneTexture.dispose();
                this.sceneTexture = null;
            }
            if (!how.Application["_guiLayer"].visible) {
                how.Application["_app"].removeChildAt(0);
                how.Application["_guiLayer"].visible = true;
            }
            if (this.useFast) {
                this.removeChildren();
                while (this.children.length) {
                    this.addChild(this.children.shift());
                }
            }
        }
        public static clearTextureCache(): void {
            // if(this.sceneTexture){
            //     this.sceneTexture.dispose();
            //     this.sceneTexture = null;
            // }
            for (var key in this.textureCache) {
                var texture: egret.Texture = this.textureCache[key];
                texture.dispose();
                delete this.textureCache[key];
            }
        }
        /**
        * 打开特效，子类可以继承并返回false来禁止播放打开特效
        * */
        public openEffect(): boolean {
            if (this.useFast) {
                this.addCache();
            }
            else {
                this.playOpenTwen();
            }
            // this.scaleX = 0.9;
            // this.scaleY = 0.9;
            // this.alpha = 1;
            // new how.behaviour.Tween(this, 200, {
            //     scaleY: 1, scaleX: 1, alpha: 1, onComplete: this.onOpenScaleComplete, thisObject: this
            // }).exec();
            return true;
        }
        /**
        * 关闭窗口
        * */
        public close(): void {
            if (!this.closeEffect()) {
                Application.closeWindow(this);
            }
        }
        /**
         * 强制关闭窗口
         */
        public forceClose(): void {
            Application.closeWindow(this);
        }
        /**
        * 关闭特效，子类可以继承并返回null来禁止播放关闭特效
        * */
        public closeEffect(): boolean {
            egret.Tween.get(this).to({ scaleY: 0.9, scaleX: 0.9, alpha: 1 }, 200).call(this.onCloseScaleComplete, this);
            return true;
        }
        /**
         * 当打开特效完成
         */
        protected onOpenScaleComplete(): void {
            egret.callLater(() => {
                this.alpha = this.scaleX = this.scaleY = 1;
                if (this.delayChildrenCreated) {
                    super.childrenCreated();
                }
            }, this);
            this.removeCache();
        }
        /**
         * 当关闭特效完成
         */
        protected onCloseScaleComplete(): void {
            Application.closeWindow(this);
        }
        /*
         *按下关闭按钮
         * */
        protected onCloseButton(): void {
            this.close();
        }
    }
}
