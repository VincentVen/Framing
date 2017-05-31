module how.module {
    /**
     * 带约束泛型的场景模块
     * @author none
     *
     */
    export class TWindowModule<V extends View,D extends Data> extends WindowModule {
        /**
         * 窗口模块
         * @param guiClass 视图类
         * @param dataClass 数据类
         * @param modal 是否是模态窗口
         * @param center  是否默认居中
         * @param autoClose 点击窗口以为区域是否自动关闭
         */
        public constructor(guiClass: any = null,dataClass: any = null,modal: boolean = true,center: boolean = true,autoClose: boolean = true) {
            super(guiClass,dataClass,modal,center,autoClose);
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
