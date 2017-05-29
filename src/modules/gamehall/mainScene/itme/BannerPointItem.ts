class BannerPointItem extends eui.ItemRenderer {
	public bannerPointImage: eui.Image;
	public constructor() {
		super();
		this.skinName = "bannerPoint";
	}
	public dataChanged(): void {
		this.bannerPointImage.source = this.data;
	}
}