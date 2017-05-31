module how.module {
	/**
	 * 所有场景的基类
	 * @author none
	 *
	 */
    export class Scene extends View implements IBehaviour {
        /**
         * 场景界面
         */
        public constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
        }
        /**
         * 销毁所用资源，由resourceList指定-只有切换场景才做销毁操作
         */
        public destroyResources(): void {
            if (how.Utils.isIOSNative() || egret.Capabilities.isMobile && this.resourceList) {
                var resourceList: Array<string> = this.resourceList;
                for (var i: number = 0; i < resourceList.length; i++) {
                    RES.destroyRes(resourceList[i], false);
                }
            }
        }
    }
}
