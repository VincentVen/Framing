module how {
	/**
	 * 全局事件管理器，可以抛出、监听全局事件，只允许底层框架内部使用
	 * @author none
	 *
	 */
    export class EventManager {
        private static _instance: EventManager;
        private userList: Array<any> = [
            WebSocketManager,HowMain,ExternalInterfaceUtils,Application,
            how.module.View,how.module.ItemView,how.module.Module,
            how.WebView,how.module.Window,SoundManager
        ];
        public constructor() {
            this.dispatcher = new egret.EventDispatcher();
        }
        /**
         * 获取事件管理器的唯一实例
         */
        private static getInstance(user: any): EventManager {
            if(!this._instance) {
                this._instance = new EventManager();
//                if(!user || !this._instance.canUse(user)) {
//                    error("你无权限使用EventManager");
//                }
            }
            return this._instance;
        }
        private canUse(user: any): boolean {
            for(var i: number = 0;i < this.userList.length;i++) {
                if(user instanceof this.userList[i]) {
                    return true;
                }
            }
            return false;
        }
        private dispatcher: egret.EventDispatcher;
        /**
         * 抛出事件
         */
        public dispatch(event: egret.Event): boolean {
            return this.dispatcher.dispatchEvent(event);
        }
        /**
         * 抛出事件
         * 
         */
        public dispatchEvent(type: string,data: any = null): boolean {
            return this.dispatcher.dispatchEventWith(type,false,data);
        }
        /**
         * 添加事件监听
         */
        public addEventListener(type: string,func: Function,thisObject: any): void {
            this.dispatcher.addEventListener(type,func,thisObject);
        }
        /**
         * 添加事件监听
         */
        public on(type: string,func: Function,thisObject: any): void {
            this.addEventListener(type,func,thisObject);
        }
        /**
         * 执行1次就自动移除的监听
         */
        public once(type,func,thisObject): void {
            this.dispatcher.once(type,func,thisObject);
        }
        /**
        * 取消事件监听
        */
        public off(type: string,func: Function,thisObject: any): void {
            this.removeEventListener(type,func,thisObject);
        }
        /**
         * 取消事件监听
         */
        public removeEventListener(type: string,func: Function,thisObject: any): void {
            this.dispatcher.removeEventListener(type,func,thisObject);
        }
    }
}
