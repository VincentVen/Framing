module how.module {
	/**
	 * 全局模块，只能init一次，无法destroy
	 * @author none
	 *
	 */
    export class GlobalModule extends how.module.Module {
        private static globalModules: any = {};
        /**
         * 全局模块
         * 注意：不能直接new全局模块，必须通过how.HowMain中的模块管理器来初始化全局模块
         * @param guiClass 视图类
         * @param dataClass 数据类
         */
        public constructor(guiClass: any = null, dataClass: any = null) {
            super(guiClass, dataClass);
            var globalModule: how.module.GlobalModule = GlobalModule.globalModules[egret.getQualifiedClassName(this)];
            if (!globalModule) {
                GlobalModule.globalModules[egret.getQualifiedClassName(this)] = this;
            }
            else {
                error("全局模块 " + egret.getQualifiedClassName(this) + " 只能初始化一次！");
            }
        }
        /**
         * 移除模块
         */
        public destroy(): void {
            error("全局模块 " + egret.getQualifiedClassName(this) + " 禁止销毁！");
        }
        /**
         * 根据类型获取模块
         * @param moduleClass 模块类路径
         */
        public static getModule<T extends GlobalModule>(moduleClass: any | string): T {
            if (typeof (moduleClass) == "string") {
                return GlobalModule.globalModules[moduleClass];
            }
            else {
                return GlobalModule.globalModules[egret.getQualifiedClassName(moduleClass)];
            }
        }
    }
}
