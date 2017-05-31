module how {
/**
 * 帧动画按钮
 * @author none
 */
     export class AnimationButton extends how.Button {
         public animDisplay: how.Animation;
    
        public constructor() {
            super();
        }
    
        public get getanimDisplay(): how.Animation {
            return this.animDisplay;
        }
    }
}
