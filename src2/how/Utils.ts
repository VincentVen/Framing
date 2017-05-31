module how {
	/**
	 * 游戏工具箱
	 * @author none
	 *
	 */
    export class Utils {
        public constructor() {
        }
        /**
        * 判断是否是整型
        */
        public static isInteger(x: number): boolean {
            return x % 1 === 0;
        }
        /**
        * 判断是否是整型
        */
        public static isFunction(func: any): boolean {
            return typeof func == 'function';
        }
        /**
        * 判断是否是数组
        * */
        public static isArray(obj): boolean {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        /**
        * 根据元素的属性和值获取数组中的元素
        */
        public static getItem(array: Array<any>, property: string, value: any): any {
            for (var i: number = 0; i < array.length; i++) {
                if (array[i][property] == value) {
                    return array[i];
                }
            }
            return null;
        }
        /**
        * 删除数组中的某项元素
        * */
        public static remove(array: Array<any>, item: any): void {
            var index: number = array.indexOf(item);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
        /**
        * 日期格式化
        */
        public static formatDate(date: Date, fmt: string) {
            var o = {
                "M+": date.getMonth() + 1,                 //月份   
                "d+": date.getDate(),                    //日   
                "h+": date.getHours(),                   //小时   
                "m+": date.getMinutes(),                 //分   
                "s+": date.getSeconds(),                 //秒   
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
                "S": date.getMilliseconds()             //毫秒   
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        /**
        * 查找数组元素的索引
        */
        public static indexOf(array: any, item: number): number {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == item) {
                    return i;
                }
            }
            return -1;
        }
        /**
        * 获取utf8字符串长度
        */
        public static getUtf8Length = function (str) {
            var cnt = 0;
            for (var i = 0; i < str.length; i++) {
                var value = str.charCodeAt(i);
                if (value < 0x080) {
                    cnt += 1;
                }
                else if (value < 0x0800) {
                    cnt += 2;
                }
                else {
                    cnt += 3;
                }
            }
            return cnt;
        }
        /**
        * 获取指定范围的随机整数
        * 包含n到m
         */
        public static getRandom = function (n, m) {
            var c = m - n + 1;
            return Math.floor(Math.random() * c + n);
        }
        /**
         * 拷贝数据到另一个对象中
         */
        public static copy(source: any, target: any, override: boolean = false): void {
            if (source && target) {
                for (var key in source) {
                    if (target.hasOwnProperty(key) && override) {
                        target[key] = source[key];
                    }
                }
            }
        }
        public static checkRealVisible(display: egret.DisplayObject): boolean {
            var parent: egret.DisplayObject = display;
            while (parent && !egret.is(parent, "egret.Stage")) {
                if (!parent.visible) {
                    return false;
                }
                parent = parent.parent;
            }
            return true;
        }
        /**
         * 移除指定类型的子控件
         * @param parent 父容器
         * @param type 类型
         * @param reverse 反转，只有指定类型的不会被移除
         */
        public static removeChildrenNotByType(parent: egret.DisplayObjectContainer, types: string[], reverse: boolean): void {
            var otherChildren: egret.DisplayObject[] = [];
            for (var i = 0; i < parent.numChildren; i++) {
                var children: egret.DisplayObject = parent.getChildAt(i);
                var canRemove: boolean = true;
                for (var i = 0; i < types.length; i++) {
                    canRemove = canRemove && egret.is(children, types[i]) != reverse;
                }
                if (canRemove) {
                    otherChildren.push(children);
                }
            }
            while (otherChildren.length) {
                parent.removeChild(otherChildren.shift());
            }
        }
        /**
         * 是否是IOS的native
         */
        public static isIOSNative(): boolean {
            return window.navigator && navigator.userAgent == "ios_miq";
        }
    }
}
