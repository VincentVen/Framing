class ldGameBtnItem extends how.Button {
	public title: eui.Image;
	public baseNumber: eui.BitmapLabel;
	public lessNumber: eui.Label;
	public baseBet: eui.Image;
	public constructor() {
		super();
		this.skinName = "ldGameItemSkin";
	}
}

class LDGameItem extends how.module.ItemView {
	private gameBtn: ldGameBtnItem;
	public constructor() {
		super();
		this.skinName = "ldGameBtnSkin";
	}
	public dataChanged(): void {
		this.gameBtn.title.source = "ld_title_" + this.data.name + "_png";
		this.gameBtn.baseBet.source = "ld_base_bet_" + this.data.name + "_png";
		this.gameBtn.baseNumber.text = base.Utils.formatCurrency(this.data.cellScore);
		this.gameBtn.lessNumber.text = base.Utils.formatCurrency(this.data.baseScore);
		this.gameBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goGame, this);
	}
	public goGame() {
		if (AppData.getInstance().userData.money >= this.data.baseScore) {
			this.report(LDHallSceneModule.request.onGetGameInfo, this.data);
		} else {
			how.Alert.show(LanguageConfig.error_72);
		}
	}
}
