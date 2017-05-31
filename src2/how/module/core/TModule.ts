module how.module {
    /**
     * 带约束泛型的模块
     * @author none
     *
     */
    export class TModule<V extends View,D extends Data> extends Module {
        /**
         * 模块
         * @param guiClass 视图类
         * @param dataClass 数据类
         */
        public constructor(guiClass: any = null,dataClass: any = null) {
            super(guiClass,dataClass);
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
        public get tdata(): D{
            return <D>this.data;
        }
    }
}
