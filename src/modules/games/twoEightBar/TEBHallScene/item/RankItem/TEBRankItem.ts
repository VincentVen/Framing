
//暂时方案
class TEBRankItem extends how.module.Data {
	//国旗
	// public jack: string;
	//头像
	public avatar: string;
	//名字
	public name: string;
	//金币
	public score: string;
}

class TEBRankListItem extends eui.ItemRenderer {
	// private itemJack: eui.Image;//国旗
	private itemHeader: eui.Image;//头像
	private itemName: eui.Label;//名字
	private itemScore: eui.Label;//金币
	public constructor() {
		super();
		this.skinName = "TEBRankItemSkin";
	}
	public dataChanged(): void {
		// this.itemJack.source = this.data.jack;
		this.itemHeader.source = this.data.gender == 1 ? "man" + this.data.avatar + "_png" : "women" + this.data.avatar + "_png";
		if (this.data.name == AppData.getInstance().userData.accounts) {
			this.itemName.text = "ID：" + base.Utils.formatNickName(this.data.name, 10);
		} else {
			this.itemName.text = "ID：*****" + this.data.name.substring(this.data.name.length - 3, this.data.name.length);
		}
		this.itemScore.text = this.data.score;
	}
}