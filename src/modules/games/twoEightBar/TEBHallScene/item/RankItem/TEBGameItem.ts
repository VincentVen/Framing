class TEBGameBtnItem extends how.Button {
	public bg: eui.Image;
	public title: eui.Image;
	public baseScore: eui.BitmapLabel;
	public lessNumber: eui.Label;
	public constructor() {
		super();
		this.skinName = "TEBGameBtn";
	}
}

class TEBGameItem extends how.module.ItemView {
	private gameBtn: TEBGameBtnItem;
	public constructor() {
		super();
		this.skinName = "TEBGameItemSkin";
	}
	public dataChanged(): void {
		this.gameBtn.bg.source = "bar_game_bg_" + this.data.id + "_png";
		this.gameBtn.title.source = "bar_game_title_" + this.data.id + "_png";
		this.gameBtn.baseScore.text = base.Utils.formatCurrency(this.data.cellScore);
		this.gameBtn.lessNumber.text = TEBLanguage.hallLessMoney + base.Utils.formatCurrency(this.data.baseScore);
		this.gameBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goGame, this);
	}
	public goGame() {
		if (AppData.getInstance().userData.money >= this.data.baseScore) {
			this.report(TEBHallSceneModule.request.onGetGameInfo, this.data);
		} else {
			how.Alert.show(LanguageConfig.error_72);
		}
	}
}
