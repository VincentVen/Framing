module how {
    /**
     * 文本
     * @author none
     */
    export class Label extends eui.Label {
        public constructor() {
            super();
        }

        public childrenCreated(): void {
            this.fontFamily = "微软雅黑";
        }
    }
}
