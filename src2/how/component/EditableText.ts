module how {
    /**
     * 可编辑文本
     * @author none
     */
    export class EditableText extends eui.EditableText {
        public constructor() {
            super();
        }
        
        public childrenCreated():void{
            this.fontFamily = "微软雅黑";
        }
    }
}
