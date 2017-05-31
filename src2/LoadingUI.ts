/**
 * 游戏初始的载入界面
 * @author none
 */
class LoadingUI extends eui.Group {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createView, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
    }
    private onStageResize(event: egret.Event): void {
        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;
    }
    private onRemovedFromStage(event: egret.Event): void {
        this.progressLight.removeSelf();
        for (var i = 0, len = this.effectList.length; i < len; i++) {
            egret.Tween.removeTweens(this.effectList[i]);
        }
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createView, this);
        this.stage.removeEventListener(egret.Event.RESIZE, this.onStageResize, this);
    }
    private progress: eui.Image;
    private titleLight: eui.Image;
    private labelProgress: how.Label;
    private logoAnimation: how.Animation;
    private progressLight: ProgressLight;
    private createView(): void {
        this.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
        document.getElementById("loadingDiv").style.display = "none";
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.createView, this);
        var width = this.width = this.stage.stageWidth;
        var height = this.height = this.stage.stageHeight;
        var bg: eui.Image = new eui.Image();
        bg.source = "loading_bg_jpg";
        bg.left = bg.right = bg.top = bg.bottom = 0;
        this.addChild(bg);
        //动画
        var logo = new eui.Image();
        logo.source = "logo_0_png";
        logo.horizontalCenter = 0;
        logo.verticalCenter = -20;
        this.addChild(logo);
        // var animation = this.logoAnimation = new how.Animation();
        // animation.source = "effect_logo_0_png";
        // animation.animationSource = "effect_logo_{0}_png";
        // animation.frameNum = 9;
        // animation.frameRate = 200;
        // animation.autoPlay = true;
        // animation.horizontalCenter = 0;
        // animation.verticalCenter = -65;
        // this.addChild(animation);
        var animation = new eui.Image();
        animation.source = "effect_logo_0_png";
        animation.horizontalCenter = 0;
        animation.verticalCenter = -65;
        this.addChild(animation);

        var title = new eui.Image();
        title.source = "loding_title_png";
        title.horizontalCenter = 0;
        title.verticalCenter = 150;
        this.addChild(title);

        var titleLight = this.titleLight = new eui.Image();
        titleLight.source = "loding_light_png";
        titleLight.horizontalCenter = -300;
        titleLight.verticalCenter = 157;
        titleLight.height = 40;
        titleLight.width = 63;
        this.addChild(titleLight);
        titleLight.alpha = 0;
        egret.Tween.get(titleLight).to({ alpha: 1, horizontalCenter: -150 }, 70).to({ horizontalCenter: 150 }, 100).to({ horizontalCenter: 200, alpha: 0 }, 50);

        var progressBg = new eui.Image();
        progressBg.source = "progress_bg_png";
        progressBg.horizontalCenter = 0;
        progressBg.verticalCenter = 200;
        progressBg.height = 30;
        progressBg.width = 954;
        this.addChild(progressBg);

        var progress = this.progress = new eui.Image();
        progress.source = "progress_slip_png";
        progress.horizontalCenter = -467;
        progress.verticalCenter = 200;
        progress.height = 8;
        progress.width = 0;
        this.addChild(progress);

        var labelProgress = this.labelProgress = new how.Label();
        labelProgress.verticalCenter = 250;
        labelProgress.horizontalCenter = 0;
        labelProgress.fontFamily = "微软雅黑";
        labelProgress.size = 18;
        labelProgress.textColor = 0xFFFFFF;
        this.addChild(labelProgress);

        var progressLight = this.progressLight = new ProgressLight();
        progressLight.verticalCenter = 195;
        progressLight.horizontalCenter = -467;
        this.addChild(progressLight);

        this.initEffect();
        this.dispatchEventWith(egret.Event.COMPLETE);//告诉HowMain，加载界面初始化完成
    }

    public setProgress(percent: number, current: number = 0, total: number = 0): void {
        if (this.progress) {
            var width = this.progress.width = 9.34 * percent;
            this.progress.horizontalCenter = (width - 934) / 2;
            this.progressLight.horizontalCenter = (width - 470);
            this.setText(how.StringUtils.format(LanguageConfig.loadProgress, percent, current, total));
        }
    }
    public setText(text: string): void {
        if (this.labelProgress) {
            this.labelProgress.text = text;
        }
    }

    /*------------------------------------------------------------------- */
    private effectNumber: number = 20;
    private addNumber: number = 3;
    private effectPool: Array<eui.Image> = [];
    private effectList: Array<eui.Image> = [];
    private effecInterval: number = -1;
    private effectTime: number = 300;
    private initEffect(): void {
        let len = this.effectNumber, pool = this.effectPool = [];
        for (let i = 0; i < len; i++) {
            let snow = new eui.Image();
            snow.source = "right_0_png";
            snow.y = 0;
            this.addChild(snow);
            pool.push(snow);
        }
        this.effecInterval = egret.setInterval(this.addEffect, this, this.effectTime);
    }
    //增加雪
    private addEffect(): void {
        //回收image
        let list = this.effectList, listLen = list.length, width = how.Application.app.stage.stageWidth,
            height = how.Application.app.stage.stageHeight, tempW = width / 3, pool = this.effectPool;
        for (let j = 0; j < listLen; j++) {
            let item = list[j];
            if (item.y <= 0) {
                egret.Tween.removeTweens(item);
                pool.push(item);
                list.splice(j, 1);
                j--;
                listLen--;
            }
        }
        //增加image
        for (let i = 0, len = 1 + Math.floor(Math.random() * this.addNumber); i < len; i++) {
            if (list.length >= this.effectNumber) {
                return;
            }
            let snow = this.effectPool.pop();
            let temp = snow.x = Math.random() * width;
            snow.y = height * 0.2 + height * 0.2 * Math.random();
            var tempX: number = 0;
            if (Math.random() > 0.5) {
                snow.x = width * 0.12 + 300 * Math.random();
                snow.source = "left_" + Math.floor(Math.random() * 5) + "_png";
                tempX = snow.x - 20 - 40 * Math.random();
            } else {
                snow.x = width * 0.62 + 300 * Math.random();
                snow.source = "right_" + Math.floor(Math.random() * 5) + "_png";
                tempX = snow.x + 20 + 40 * Math.random();
            }
            egret.Tween.get(snow).to({ y: -15, x: tempX }, 1000 + 1000 * Math.random());
            list.push(snow);
        }
    }
}
class ProgressLight extends eui.Group {
    private point: eui.Image;
    public constructor() {
        super();
        this.initUI();
    }
    private initUI() {
        this.width = 44;
        this.height = 84;
        var bg = new eui.Image();
        bg.source = "progress_blink_bg_png"
        bg.x = 0;
        bg.y = 0;
        this.addChild(bg);

        var point = this.point = new eui.Image();
        point.source = "progress_blink_bg1_png";
        point.x = 12;
        point.y = 26;
        this.addChild(point);
        egret.Tween.get(point, { loop: true }).to({ alpha: 0.5 }, 500).to({ alpha: 1 }, 500);
    }
    public removeSelf() {
        egret.Tween.removeTweens(this.point);
    }
}