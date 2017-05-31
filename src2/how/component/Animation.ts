module how {
	/**
	 * 序列帧动画组件，可加入到布局
	 * 官方提供的工具是egret.MovieClip类型的，当时感觉无法配合GUI来布局，所以这里提供了自定义的
	 * 目前看来，应该官方提供的也可以参与布局，尽管如此，动画组件还是用这个类，后续把官方支持集成进来就行
	 * 一轮播放完成会抛出egret.Event.COMPLETE事件
	 * @author none
	 *
	 */
    export class Animation extends eui.Image {
        public sourceGroup: string = "";
        /**
         * 名称过滤，即图集中只有相关的名称资源才加入序列帧列表中
         */
        public animationSource: string = "demo{0}_png";
        /**
         * 是否自动播放
         */
        public autoPlay: boolean = true;
        /**
         * 是否循环播放
         */
        public loop: boolean = true;
        /**
         * 循环间隔
         */
        public loopTime: number = 0;
        /**
         * 动画帧频
         */
        public frameRate: number = 24;
        /*
         *帧数
         */
        public frameNum: number = 0;
        /**
         * 是否正在播放
         */
        public get isPlaying(): Boolean {
            return this._isPlaying;
        }
        private timerID: number;
        private loopID: number = -1;
        private frames: Array<string> = new Array<string>();
        private _currentFrame: number = -1;
        private completeEvent: egret.Event;
        private _isPlaying: Boolean = false;
        public constructor(animationSource?: string) {
            super();
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            this.animationSource = animationSource;
        }
        private onRemoved(event: egret.Event): void {
            this.stop();
        }
        private onAdded(event: egret.Event): void {
            this.refresh();
        }
        public childrenCreated(): void {
            this.getResources();
        }
        public resetSource(animationSource: string, frameNum: number): void {
            this.animationSource = animationSource;
            this.frameNum = frameNum;
            this.frames = [];
            this._currentFrame = 0;
            this.source = how.StringUtils.format(animationSource, 0);//初始化第一张
            this.getResources();
        }
        private getResources(): void {
            if (this.frameNum == 0) {
                var i = 0;
                while (!!RES.getRes(how.StringUtils.format(this.animationSource, i))) {
                    this.frames.push(how.StringUtils.format(this.animationSource, i));
                    i++;
                }
            } else {
                for (var i = 0; i < this.frameNum; i++) {
                    this.frames.push(how.StringUtils.format(this.animationSource, i));
                }
            }
        }
        /**
         * 播放动画
         */
        public play(): void {
            if (this._isPlaying) {//如果正在播放则先停止
                this.stop();
            }
            this.timerID = egret.setInterval(this.onInterval, this, this.frameRate);
            this._isPlaying = true;
        }
        /**
         * 停止动画
         */
        public stop(): void {
            this._currentFrame = 0;
            egret.clearInterval(this.timerID);
            this._isPlaying = true;
            if (this.loopID != -1) {
                egret.clearTimeout(this.loopID);
            }
        }
        /**
         * 帧动画当前所在帧帧
         */
        public get currentFrame(): number {
            return this._currentFrame;
        }
        /**
         * 刷新动画
         */
        public refresh(): void {
            this.stop();
            if (this.autoPlay) {
                this.onInterval();
                this.play();
            }
            else {
                this.source = this.frames[this.currentFrame];
            }
        }
        private onInterval(): void {
            if (how.Utils.checkRealVisible(this)) {
                this.source = this.frames[this.currentFrame];
                this._currentFrame++;
                if (this._currentFrame == this.frames.length) {
                    if (this.loop) {
                        this._currentFrame = 0;
                        if (this.loopTime > 0) {
                            this.stop();
                            this.loopID = egret.setTimeout(this.play, this, this.loopTime);
                        }
                    } else {
                        this.stop();
                    }
                    if (!this.completeEvent) {
                        this.completeEvent = new egret.Event(egret.Event.ENDED);
                    }
                    this.dispatchEvent(this.completeEvent);//抛出一轮播放完成事件
                }
            }
        }
    }
}
