module how {
	/**
	 * 公告组件，用一个存在一定时间的横幅来显示重要的消息。
	 * 如果文字内容过长，会自左向右滚动，直到显示完毕。
	 * 一定时间会自动消失，如果期间有多条消息需要展示，那么会排队等待上一个消失，也没有交互产生。
	 * @author none
	 *
	 */
    export class NoticeItem extends eui.Component {
        //ui
        private chatLabel: eui.Label;
        private labelScroller: eui.Scroller;
        private labelPosX: number = 0;//初始化位置
        //公告信息
        private type: number;//消息类型：4：上面喇叭 8：下面通告
        //循环滚动
        private intervalTime: number = 1000;//间隔时间
        private speed: number = 0.1;
        private timeout: number = -1;//计时器
        //内容相关
        public noticeList: Array<any> = [];//记录需要重复播放的消息:{id(id为0表示系统默认消息),content,count,interval,cb,target,runInterval}
        private showingNotice: Array<any> = [];//需要此刻播放的队列
        private currentNotice: any;//正在跑的消息
        //标志
        public isShow: boolean = false;//是否正在播放
        public showFlag: boolean = false;//是否允许播放
        private runFlag: boolean = false;//是否在滚动
        public constructor(type: number, skin: any) {
            super();
            this.skinName = skin;
            this.type = type;
            this.left = this.right = this.top = this.bottom = 0;
            this.touchEnabled = false;
            Application.addWindow(this, false, false, false, false);
        }
        public initSkin(skin: any) {
            this.skinName = skin;
            this.labelPosX = this.width - this.labelScroller.right - this.labelScroller.left;
            if (this.type != 8) {
                this.showFlag = true;
            }
        }
        public setShowFlag(value: boolean): void {
            this.showFlag = value;
        }
        /**
         * 更新消息列表
         */
        public update(data: any) {
            var showingNotice = this.showingNotice;//是否马上更新显示
            //游戏消息的id为-1
            if (data.id == -1) {
                showingNotice.push(data);
                this.show();
            } else {
                //游戏大厅广播
                var index = this.getNoticeById(data.id), noticeList = this.noticeList;
                if (index == -1) {//找不到消息
                    if (data.count > 1) {
                        data.runInterval = -1;
                        data.count--;
                        noticeList.push(data);
                        showingNotice.push(data);
                        this.show();
                    } else if (data.count == 1) {
                        showingNotice.push(data);
                        this.show();
                    }
                } else {
                    var notice = noticeList[index];
                    if (data.count > 0) {
                        notice.count += data.count;
                        notice.content = data.content;
                    } else {//删除公告
                        egret.clearInterval(notice.runInterval);
                        this.removeShowingById(data.id);
                        noticeList.splice(index, 1);
                    }
                }
            }
        }
        private getNoticeById(id: number): number {
            for (var i = 0, noticeList = this.noticeList, len = noticeList.length; i < len; i++) {
                if (id == noticeList[i].id) {
                    return i;
                }
            }
            return -1;
        }
        //根据内容删除已经进入列表的消息
        private removeShowingById(id: string) {
            var showingNotice = this.showingNotice, len = showingNotice.length;
            for (var i = 0; i < len; i++) {
                if (showingNotice[i].id == id) {
                    showingNotice.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        //查找正在播放的消息
        private getIndexById(id: number): number {
            var index = -1;
            var showingNotice = this.showingNotice, len = showingNotice.length;
            for (var i = 0; i < len; i++) {
                if (showingNotice[i].id == id) {
                    showingNotice.splice(i, 1);
                    i--;
                    len--;
                }
            }
            return index;
        }
        //更新正在播放列表
        private updateShowing(data: any) {
            var index = this.getNoticeById(data.id);
            if (index != -1) {
                var notice = this.noticeList[index], id = notice.id;
                if (this.getIndexById(id) == -1) {
                    this.showingNotice.push(notice);
                    if (--notice.count <= 0) {
                        egret.clearInterval(notice.runInterval);
                        this.noticeList.splice(index, 1);
                    }
                    this.show();
                }
            } else {//清楚不存在的消息
                this.removeShowingById(data.id);
                if (data.runInterval != -1) {
                    egret.clearInterval(notice.runInterval);
                }
            }
        }
        //展示相关
        public show(): void {
            if (!this.showFlag) {//是否允许播放
                if (this.isShow) {
                    this.close();
                }
                return;
            }
            if (this.runFlag) {//正在跑中
                return;
            }
            if (this.showingNotice.length == 0) {//当前没有播放内容
                this.close();
                return;
            }
            //播放第一条
            var data = this.currentNotice = this.showingNotice.shift();
            this.chatLabel.textFlow = how.StringUtils.textToRichText(data.content);//消息内容
            var runningTime = (this.chatLabel.width + this.labelPosX) / this.speed;//以固定速度计算滚动时间
            if (this.type == 8 && this.chatLabel.width <= (how.Application.app.stage.stageWidth - 40)) {
                this.chatLabel.horizontalCenter = this.labelScroller.horizontalCenter;
                egret.Tween.get(this.chatLabel).wait(runningTime).call(this.runningOver, this);
            } else {
                this.chatLabel.x = this.labelPosX;
                egret.Tween.get(this.chatLabel).to({ x: -this.chatLabel.width }, runningTime).call(this.runningOver, this);//滚动
            }
            this.isShow = true;
            this.runFlag = true;
        }
        //结束滚动
        private runningOver() {
            var data = this.currentNotice;
            this.runFlag = false;
            if (this.timeout != -1) {
                egret.clearTimeout(this.timeout);
                this.timeout = -1;
            }
            //相隔一秒钟播放下一条消息
            this.timeout = egret.setTimeout(this.show, this, this.intervalTime);
            //检查是否需要重复
            var index = this.getNoticeById(data.id);
            if (index != -1) {
                this.noticeList[index].runInterval = egret.setTimeout(this.updateShowing, this, data.interval * 1000, data);
            }
            this.currentNotice = null;
        }
        public onResize() {
            if (this.type == 8 && this.chatLabel.width <= how.Application.app.stage.stageWidth - 40) {
                if (this.runFlag) {
                    this.runFlag = false;
                    egret.Tween.removeTweens(this.chatLabel);
                    this.chatLabel.horizontalCenter = this.labelScroller.horizontalCenter;
                    this.labelPosX = this.width - this.labelScroller.right - this.labelScroller.left;
                }
            } else if (!this.runFlag) {
                this.show();
            }
        }
        /**
         * 关闭不移除通知
         */
        public close(): void {
            //检查是否需要重复
            if (this.currentNotice) {
                var data = this.currentNotice, index = this.getNoticeById(data.id);
                if (index != -1) {
                    this.noticeList[index].runInterval = egret.setTimeout(this.updateShowing, this, data.interval * 1000, data);
                }
                this.currentNotice = null;
            }
            this.isShow = false;
            this.runFlag = false;
            egret.Tween.removeTweens(this.chatLabel);
            this.chatLabel.textFlow = [];
            if (this.timeout != -1) {
                egret.clearTimeout(this.timeout);
                this.timeout = -1;
            }
        }
    }
}
