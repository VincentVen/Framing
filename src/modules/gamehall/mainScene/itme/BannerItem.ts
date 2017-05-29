class BannerItem extends eui.ItemRenderer {
	public bannerIcon: eui.Image;
	public constructor() {
		super();
		this.skinName = "bannerImage";
	}
	public dataChanged(): void {
		this.bannerIcon.source = this.data;
	}
}