module how.module {
    /**
     * 带约束泛型的场景模块
     * @author none
     *
     */
    export class TSceneModule<V extends View,D extends Data> extends SceneModule {
        /**
         * 场景模块
         * @param guiClass 模块类
         * @param dataClass 模块数据
         * @param removeAllPops 切换的时候是否移除所有的弹出层，默认为false
         * @param cancelAllHttps 切换的时候是否移除所有http请求
         */
        public constructor(guiClass: any = null,dataClass: any = null,removeAllPops: boolean = false,cancelAllHttps: boolean = true) {
            super(guiClass,dataClass,removeAllPops,cancelAllHttps);
        }
        /**
         * 视图对象，返回类型就是传入的类型V
         */ 
        public get tgui(): V {
            return <V>this.gui;
        }
        /**
         * 数据对象，返回类型就是传入的类型D
         */ 
        public get tdata(): D {
            return <D>this.data;
        }
    }
}
