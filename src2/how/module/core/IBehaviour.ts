module how.module {
	/**
	 * 行为接口，需实现基本的行为
	 * 业务逻辑层可以免去事件监听等复杂的代码，直接通过复写方法来获取响应的事件
	 * @author none
	 *
	 */
    export interface IBehaviour {
        /**
        * 创建完成的时候调用，调用顺序是在构造函数之后start之前
        */
        awake(): void;
        /**
         * 子项全部创建完成的时候调用，可以当作是入口函数使用
         */
        start(): void;
        /**
         * 每帧都会调用
         */
        update(): void;
        /**
         * 每次渲染都会调用
         */
        onRender(): void;
        /**
         * 被移除的时候调用，可以当作析构函数使用，用来移除事件监听，清除引用等防止内存泄漏
         */
        onDestroy(): void;
        /**
         * 在应用退出之前调用，如果返回false可以阻止应用退出
         */ 
        onApplicationQuit(): boolean;
        /**
         * 应用得到焦点
         */ 
        onApplicationFocus(): void;
        /**
         * 应用失去焦点
         */ 
        onApplicationPause(): void;
    }
}
