module base {
	/**
	 * 游戏工具箱
	 * @author none
	 *
	 */
    export class Utils {
        public constructor() {
        }

        /**
         * 检查电子邮箱格式是否正确
         */
        public static checkEmail(str: string): boolean {
            var re: RegExp = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            return re.test(str);
        }

        public static toThousands(num: number) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
        /**
         * 检查手机号码格式是否正确
         */
        public static checkPhone(str: string): boolean {
            var re: RegExp = /^[1][3,5,7,8]\d{9}/;
            return re.test(str);
        }
        private static md5Object: md5;
        /**
        * md5方式加密字符串
        */
        public static md5(str: string): string {
            this.md5Object = this.md5Object || new md5();
            return this.md5Object.hex_md5(str);
        }
        /** 
        * 将数值保留2位小数后格式化成金额形式 
        * @param num 数值(Number或者String)
        * @param accurate 是否显示后面为.00的小数
        * @type {String} 
        */
        public static formatCurrency(num: any, accurate: boolean = false): string {
            num = parseFloat(num) / 100;
            if (num < 1 && num > -1) {
                return num.toString();
            }
            num = (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
            if (accurate) {
                return num;
            } else {
                var decimal = num.substring(num.length - 2, num.length);
                if (parseInt(decimal) == 0) {
                    decimal = '';
                } else if (parseInt(decimal.substring(1, decimal.length)) == 0) {
                    decimal = '.' + decimal.substring(0, 1);
                } else {
                    decimal = "." + decimal;
                }
                var result = num.substring(0, num.length - 3);
                return result + decimal;
            }
            // var result;
            // if (num < 10000) {
            //     result = this.toFixed(num, 2);
            // }
            // else if (num < 100000000) {
            //     var n = num / 10000;
            //     result = this.isInteger(n) ? n.toString() + "万" : this.toFixed(n, 2) + "万";
            // }
            // else if (num < 1000000000000) {
            //     var n = num / 100000000;
            //     result = this.isInteger(n) ? n.toString() + "亿" : this.toFixed(n, 2) + "亿";
            // }
            // else {
            //     var n = num / 1000000000000;
            //     result = this.isInteger(n) ? n.toString() + "兆" : this.toFixed(n, 2) + "兆";
            // }
            // return result;
        }
        /** 
        * 格式化账号或者昵称，超过长度以...代替 
        * @param nickName 昵称
        * @param length 要显示的长度
        * @type {String} 
        */
        public static formatNickName(nickName: string, length: number): string {
            if (nickName.length <= length) {
                return nickName;
            } else {
                return nickName.substring(0, length) + "...";
            }
        }
        /**
        * 没有四舍五入的fix方法
        */
        public static toFixed(value: any, length: number): string {
            value = value.toString();
            var pointIndex = value.lastIndexOf(".");
            if (pointIndex == -1) {
                return value;
            }
            return value.substring(0, pointIndex + length + 1);
        }
        /**
        * 判断是否是整型
        */
        public static isInteger(x: number): boolean {
            return x % 1 === 0;
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
        * 获取设备唯一号，暂时只支持安卓平台，别的平台用当前时间的md5代替
        * @returns 设备唯一号
        */
        public static getIMEI(): string {
            if (how.ExternalInterfaceUtils.IMEI) {
                return how.ExternalInterfaceUtils.IMEI;
            }
            var result = egret.localStorage.getItem(StorageKeys.imei_windows);
            if (!result) {
                result = base.Utils.md5(base.Utils.formatDate(new Date(), "qqddMMhhmmS") + Math.random());
                egret.localStorage.setItem(StorageKeys.imei_windows, result);
            }
            return result;
        }

        public static getMAC(): string {
            return how.ExternalInterfaceUtils.MACAddress;
        }

        /**
         * 获取网页地址参数内容
         * @param argID 参数ID
         */
        public static GetQueryString(argID: string): string {
            var reg: RegExp = new RegExp("(^|&)" + argID + "=([^&]*)(&|$)");
            var r: RegExpMatchArray = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]);
            }
            return null;
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
        /*倒计时格式化*/
        public static formatCD(cd: number, fmt: string): string {
            var d: number = Math.floor(cd / (24 * 3600));
            var h: number = Math.floor((cd - d * 24 * 3600) / 3600);
            var m: number = Math.floor((cd - d * 24 * 3600) % 3600 / 60);
            var s: number = Math.floor((cd - d * 24 * 3600) % 3600 % 60);
            var o = {
                "d+": d,                    //日   
                "h+": h,                   //小时   
                "m+": m,                 //分   
                "s+": s,                 //秒   
            };

            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }


        public static getImacyNowToNext($imacy: number): number {
            var toNextNum: number = -1;
            var imacyList: Array<number> = [0, 1000, 10000, 25000, 65000, 100000]; // 每个等级的最小值
            for (var i = 0; i < imacyList.length; i++) {
                if ($imacy >= imacyList[i]) {
                    if (i < (imacyList.length - 1))
                        toNextNum = imacyList[i + 1] - $imacy;
                }
                else {
                    break;
                }
            }

            return toNextNum;
        }

        /**
         * 获取亲密度
         */
        public static getImacyLevel(imacy: any): number {
            var imacyList: Array<number> = [0, 1000, 10000, 25000, 65000, 100000]; // 每个等级的最小值
            var index: number = 0;
            for (var i = 0; i < imacyList.length; i++) {
                if (imacy >= imacyList[i]) {
                    index = i;
                }
                else {
                    break;
                }
            }
            return index;
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
         * 保密昵称
         */
        public static hideNickName(name: string): string {
            var temp = "**";
            var isEven = name.length % 2 == 0 ? true : false;
            var head = isEven ? name.substring(0, name.length / 2 - 1) : name.substring(0, Math.floor(name.length / 2) - 1);
            var end = name.substring(head.length + 2, name.length);
            return head + temp + end;
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
        public static getQueryString(url, name): any {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.substr(1).match(reg);
            if (r != null) {
                return r[2];
            } else {
                return null;
            }
        }
        public static getLocalStorageItem(key: string, type: string): any {
            var localStorageItem: string = egret.localStorage.getItem(key);
            switch (type) {
                case "Array":
                    if (!localStorageItem) {
                        return [];
                    }
                    else {
                        return JSON.parse(localStorageItem);
                    }
                case "Object":
                    if (!localStorageItem) {
                        return {};
                    }
                    else {
                        return JSON.parse(localStorageItem);
                    }
                case "String":
                    if (!localStorageItem) {
                        return "";
                    }
                    else {
                        return localStorageItem;
                    }
                case "Number":
                    if (!localStorageItem) {
                        return 0;
                    }
                    else {
                        return parseFloat(localStorageItem);
                    }
                case "Boolean":
                    if (!localStorageItem) {
                        return false;
                    }
                    else {
                        return localStorageItem == "true";
                    }
            }
        }
    }
}
