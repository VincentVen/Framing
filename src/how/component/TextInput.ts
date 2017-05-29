module how {
    /**
     * 文本输入框
     * @author none
     */
    export class TextInput extends eui.TextInput{

        public textDisplay: how.EditableText;
        public promptDisplay: how.Label;
        
        public constructor() {
            super();
        }

        public childrenCreated(): void {
//            this.textDisplay.textColor = 0xffffff;
//            this.promptDisplay.textColor = 0xa9a9a9;
//            this.textDisplay.displayAsPassword = this._displayAsPassword;
        }
    }
}
