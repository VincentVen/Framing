/**
 * 设置窗口界面
 * @author none
 * this.moduleManager.initModule(MainSceneModule, MainSceneView, MainSceneData);
 */
class SettingWindowView extends how.module.Window {
    public textMusic: how.Label;
    public textSound: how.Label;
    public closeTextMusic: how.Label;
    public closeTextSound: how.Label;
    public musicSwitch: eui.ToggleSwitch;
    public soundSwitch: eui.ToggleSwitch;
    public sliderMusic: eui.HSlider;//音乐拖动条
    public sliderSound: eui.HSlider;//音效拖动条

    public get userData(): base.UserData {
        return AppData.getInstance().userData;
    }
    public constructor() {
        super();
        this.skinName = "SettingWindowSkin";
        this.textMusic.text = LanguageConfig.SettingWindowTextMusic;
        this.textSound.text = LanguageConfig.SettingWindowTextSound;
        this.closeTextMusic.text = LanguageConfig.SettingWindowCloseTextMusic;
        this.closeTextSound.text = LanguageConfig.SettingWindowCloseTextSound;
    }
    public childrenCreated(): void {
        super.childrenCreated();
        this.sliderMusic.addEventListener(egret.Event.CHANGE, this.onSliderMusicChange, this);
        this.sliderSound.addEventListener(egret.Event.CHANGE, this.onSliderSoundChange, this);
        this.musicSwitch.addEventListener(eui.UIEvent.CHANGE, this.onMusicSwitch, this);
        this.soundSwitch.addEventListener(eui.UIEvent.CHANGE, this.onSoundSwitch, this);
        this.sliderMusic.value = how.SoundManager.musicVolume * 10;
        this.sliderSound.value = how.SoundManager.effectVolume * 10;
        this.musicSwitch.selected = how.SoundManager.musicVolume > 0 ? true : false;
        this.soundSwitch.selected = how.SoundManager.effectVolume > 0 ? true : false;
    }
    //按下音乐开关
    public onMusicSwitch(event: eui.UIEvent): void {
        if (this.musicSwitch.selected) {
            var lastMusic: number = base.Utils.getLocalStorageItem(StorageKeys.musicValue + "last", "Number");
            how.SoundManager.musicVolume = lastMusic;
            this.sliderMusic.value = lastMusic * 10;
        }
        else {
            egret.localStorage.setItem(StorageKeys.musicValue + "last", how.SoundManager.musicVolume.toString());
            how.SoundManager.musicVolume = 0;
            this.sliderMusic.value = 0;
        }
        egret.localStorage.setItem(StorageKeys.musicValue, how.SoundManager.musicVolume.toString());
    }
    //按下音效开关
    public onSoundSwitch() {
        if (this.soundSwitch.selected) {
            var lastSound: number = base.Utils.getLocalStorageItem(StorageKeys.soundValue + "last", "Number")
            how.SoundManager.effectVolume = lastSound;
            this.sliderSound.value = lastSound * 10;
        }
        else {
            egret.localStorage.setItem(StorageKeys.soundValue + "last", how.SoundManager.effectVolume.toString());
            how.SoundManager.effectVolume = 0;
            this.sliderSound.value = 0;
        }
        egret.localStorage.setItem(StorageKeys.soundValue, how.SoundManager.effectVolume.toString());
    }
    //音乐拖条滑动
    public onSliderMusicChange(): void {
        how.SoundManager.musicVolume = this.sliderMusic.value / 10;
        if (this.sliderMusic.value > 0) {
            this.musicSwitch.selected = true;
        } else {
            this.musicSwitch.selected = false;
        }
        egret.localStorage.setItem(StorageKeys.musicValue, how.SoundManager.musicVolume.toString());
    }
    //音效拖条滑动
    public onSliderSoundChange(): void {
        how.SoundManager.effectVolume = this.sliderSound.value / 10;
        if (this.sliderSound.value > 0) {
            this.soundSwitch.selected = true;
        } else {
            this.soundSwitch.selected = false;
        }
        egret.localStorage.setItem(StorageKeys.soundValue, how.SoundManager.effectVolume.toString());
    }
}
