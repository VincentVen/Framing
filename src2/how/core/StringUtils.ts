module how {
	/**
	 * 字符串工具类
	 * @author none
	 *
	 */
    export class StringUtils {
        public constructor() {
        }
		/**
		 * 类似C#中的格式化字符串函数
		 * 例：format("Hello {0}",world)
		 * @param str {string} 要格式化的字符串
		 * @param args {Array<any>} 参数列表
		 * @returns {string} 格式化之后的字符串
		 */
        public static format(str: string, ...args: Array<any>): string {
            var result: string = str;
            for (var i: number = 0; i < args.length; i++) {
                result = result.replace("{" + i + "}", args[i].toString());
            }
            return result;
        }
        /**
         * 判断是否是空字符串，null、undefined和""都会返回true
         * @returns {boolean} 是否是空字符串
         */
        public static isEmpty(value: string): boolean {
            return value == null || value == undefined || value.length == 0;
        }
        /**
         * 去左右两端空格
         */
        public static trim(str): string {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        /**
          * 白鹭专用字符串转富文本
          * 要求格式：
          * @parma str {string} 传入的字符串
          *
          * '没有任何格式初始文本，' +
          * '<font color="#0000ff" size="30" fontFamily="Verdana">Verdana blue large</font>' +
          * '<font color="#ff7f50" size="10">珊瑚色<b>局部加粗</b>小字体</font>' +
          *  '<i>斜体</i>'
          */
        public static textToRichText(str: any): Array<egret.ITextElement> {
            var reStr = <Array<egret.ITextElement>>[];
            if (str == null) {
                return;
            }
            return (new egret.HtmlTextParser).parser(str);
            // if (str.indexOf("[") != -1) {
            //     reStr = eval(str);
            // }
            // else {
            //     reStr.push({ text: str, style: {} });
            // }
            // return reStr;
        }
    }
}
