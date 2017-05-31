module how {
    /**
     * 声音管理器
     * 必须要预加载所有声音文件
     */
    export class SoundManager {
        private static music: egret.SoundChannel;
        private static effectList: egret.SoundChannel[] = [];
        private static _musicVolume: number = 1;
        public static get musicVolume(): number {
            return this._musicVolume;
        }
        public static set musicVolume(value: number) {
            this._musicVolume = value;
            if (this.music) {
                this.music.volume = value;
            }
        }
        private static _effectVolume: number = 1;
        public static get effectVolume(): number {
            return this._effectVolume;
        }
        public static set effectVolume(value: number) {
            this._effectVolume = value;
            for (var i: number = 0; i < this.effectList.length; i++) {
                this.effectList[i].volume = value;
            }
        }
        private static _lastmusicVolume: number;
        private static _lasteffectVolume: number;
        private static musicSource: string;
        private static musicLoop: boolean;
        private static isInited: boolean;
        private static init(): void {
            if (!this.isInited) {
                this.isInited = true;
                EventManager["getInstance"](this).addEventListener(Application.APPEVENT_PAUSE, this.onAppPause, this);
                EventManager["getInstance"](this).addEventListener(Application.APPEVENT_RESUME, this.onAppResume, this);
            }
        }
        private static onAppPause(): void {
            this._lastmusicVolume = this.musicVolume;
            if (this.musicVolume != 0) {
                this.musicVolume = 0;
            }
            this._lasteffectVolume = this.effectVolume;
            if (this.effectVolume != 0) {
                this.effectVolume = 0;
            }
            this.stopAllEffects();
        }
        private static onAppResume(): void {
            if (this._lastmusicVolume != undefined) {
                this.musicVolume = this._lastmusicVolume;
                this._lastmusicVolume = 0;
            }
            if (this._lasteffectVolume != undefined) {
                this.effectVolume = this._lasteffectVolume;
                this._lasteffectVolume = 0;
            }
        }
        /**
         * 播放音乐，建议用mp3格式
         * @param source 相对于resource的音乐资源路径
         * @param loop 是否循环播放
         */
        public static playMusic(source: string, loop: boolean = true, startTime: number = 0): void {
            this.init();
            if (this.music) {
                if (this.musicSource == source) {
                    return;
                }
                this.music.stop();
            }
            this.musicSource = source;
            this.musicLoop = loop;
            var sound: egret.Sound = RES.getRes(source);
            if (sound) {
                sound.type = egret.Sound.MUSIC;
                this.music = sound.play(startTime, loop ? 0 : 1);
                this.music.volume = this._musicVolume;
                this.music.once(egret.Event.SOUND_COMPLETE, (event: Event): void => {
                    this.music = null;
                }, this);
            } else {
                RES.getResAsync(source, (data, key) => {
                    if (key == this.musicSource) {
                        this.playMusic(this.musicSource, this.musicLoop);
                    }
                }, this);
            }
        }
        /**
         * 停止播放音乐
         */
        public static stopMusic(): void {
            this.musicSource = null;
            if (this.music) {
                this.music.stop();
                this.music = null;
            }
        }
        /**
         * 播放音效，建议用mp3格式
         * @param source 相对于resource的音效资源路径
         * @param loop 是否循环播放
         */
        public static playEffect(source: string, loop: boolean = false): void {
            this.init();
            var sound: egret.Sound = RES.getRes(source);
            if (sound) {
                sound.type = egret.Sound.EFFECT;
                var effect: egret.SoundChannel = sound.play(0, loop ? 0 : 1);
                effect.volume = this._effectVolume;
                this.effectList.push(effect);
                effect.once(egret.Event.SOUND_COMPLETE, (event: Event): void => {
                    var index = this.effectList.indexOf(effect);
                    if (index != -1) {
                        this.effectList.splice(index, 1);
                    }
                }, this);
            } else {
                RES.getResAsync(source, (data, key) => { }, this);
            }
        }
        /**
         * 停止播放所有音效
         */
        public static stopAllEffects(): void {
            while (this.effectList.length) {
                this.effectList.shift().stop();
            }
        }
    }
}