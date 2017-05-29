module how.module {
	/**
	 * 所有数据的基类
	 * @author none
	 *
	 */
    export class Data extends egret.EventDispatcher {
        /**
         * 数据类
         */
        public constructor() {
            super();
        }
        /**
        * 执行控制层的方法
        */
        public report(request: string,...args): void { }
        /**
         * 根据数据源设置数据
         */ 
        public setData(source: any) {
            for(var key in source){
                this[key] = source[key];
            }
        }
    }
}
